import xhr, { XhrRef, XhrRetryStrategy, KVO, __internal__ } from './xhr-async'
import test from 'ava'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

test('defaults', async t => {
  t.truthy(xhr.defaults)
})

test('should not raise exception when server is not found', async t => {
  try {
    const { data, status, error, statusText } = await xhr.get('https://notavalidurl.com1/')
    t.is(status, 0)
  } catch (error) {
    t.fail('request should not raise exception, ever.')
  }
})

test('status code should be legit', async t => {
  const code = 418
  const { data, status, error, statusText } = await xhr.get('https://httpbin.org/status/' + code)

  t.is(status, code)
})

test('baseURL should work', async t => {
  xhr.defaults.baseURL = 'https://httpbin.org'
  const { data, status } = await xhr.get('/ip')

  t.is(status, 200)
})

test('status code 200', async t => {
  const { data, status } = await xhr.get('https://httpbin.org')
  t.is(status, 200)
})

test('should set header correctly with before()', async t => {
  const bearer = 'Bearer 1234'

  xhr.before(({ headers = {} }) => {
    headers.Authorization = bearer
  })

  const { data, status, request } = await xhr.get('https://httpbin.org/headers')

  t.is(status, 200)
  t.is(data.headers.Authorization, bearer)

  if (request && request.headers) {
    t.is(request.headers.Authorization, bearer)
  } else {
    t.fail('request.headers must be set and returned properly')
  }
})

test('should set request object properly', async t => {
  let request

  const { data, status } = await xhr.get('https://httpbin.org/', {
    ref: req => request = req
  })

  t.is(status, 200)
  t.is(request, undefined) // xhr should be unset to undefined after the request
})

test('ref should not be null during the request', async t => {
  let rootRequest

  const response = xhr.get('https://httpbin.org/delay/2', {
    ref: req => rootRequest = req
  })

  await sleep(1)

  t.truthy(rootRequest) // during the request ie being made, xhr should be set

  const { status } = await response

  t.is(status, 200)
  t.is(rootRequest, undefined) // when the request is fulfilled, xhr should be unset
})

test('ref.abort() should work', async t => {
  let rootReq: XhrRef
  const url = 'https://httpbin.org/delay/2'
  const headers = { foo: 'bar', hello: 'world' }
  const data = [1, 2, 3, 4]
  const params = { a: 1, b: 2, c: 3 }

  const response = xhr.get(url, {
    headers,
    params,
    data,
    ref: req => rootReq = req
  })

  await sleep(1)

  t.truthy(rootReq) // during the request is being made, xhr should be set

  if (rootReq) {
    rootReq.abort()
  }

  const { status, request: { url: _url, params: _params, data: _data, headers: _headers } } = await response

  t.is(status, xhr.ABORTED)
  t.is(rootReq, undefined) // abort() should also unset xhr
  t.deepEqual(url, _url)
  t.deepEqual(params, _params)
  t.deepEqual(data, JSON.parse(_data))

  Object.keys(headers).forEach(key => {
    if (_headers && !_headers[key]) {
      t.fail(`header (${key}) does not exist in request header`)
    }
  })
})

test('should unset ref when an exception happens', async t => {
  let rootReq
  const { data, status, error, statusText } = await xhr.get('https://notavalidurl.com1/', {
    ref: req => rootReq = req
  })

  t.is(status, xhr.UNREACHABLE)
  t.is(rootReq, undefined)
})

test('xhr.group should work', async t => {
  const group = 'httpbin'
  let request

  const response = xhr.get('https://httpbin.org/delay/2', {
    group,
    ref: req => request = req
  })

  await sleep(1) // wait a bit to initialize the request

  t.truthy(request) // during the request is being made, xhr should be set

  xhr.abort(group) // abort the whole group

  const { status } = await response

  t.is(status, xhr.ABORTED)
  t.is(request, undefined) // abort() from xhr.abort(group) should also unset xhr
})

test('xhr.retry should work with with abort()', async t => {
  let request: XhrRef

  const response = xhr.get('https://httpbin.org/delay/2', {
    retry: 1,
    ref: req => request = req
  })

  await sleep(1) // wait a bit to initialize the request

  // Terminate the request, another attempt should be made
  if (request) {
    request.abort()
  }

  const { status, data } = await response

  t.is(status, 200)
  t.truthy(data)
  t.truthy(data.headers)
})

test('status should be TIMEOUT when timeout happens', async t => {
  const { status } = await xhr.get('https://httpbin.org/delay/2', {
    timeout: 100
  })

  t.is(status, xhr.TIMEOUT)
})

test('group should be cleaned when request is done', async t => {
  const group = 'httpbin1'

  const { status } = await xhr.get('https://httpbin.org/delay/1', {
    group
  })

  t.is(status, 200)
  t.falsy(__internal__.xhrGroups[group])
})

test('abort with ignoreRetry should kill all retries', async t => {
  let count = 0
  let request: XhrRef
  const retryStrategy: XhrRetryStrategy & KVO = ({ counter, lastStatus }) => {
    count = counter
    return counter < 2 ? counter * 10000 : xhr.STOP_RETRYING
  }

  const response = xhr.get('https://httpbin.org/status/401', {
    retry: retryStrategy,
    ref: req => request = req
  })

  // hopefully the first attempt has response from httpbin, otherwise
  // this test fails because abort() terminates the first request, not the
  // retrying request
  await sleep(2500)

  if (request) {
    request.abort({ ignoreRetry: true })
  }

  const { status } = await response

  t.is(status, xhr.ABORTED)
  t.is(count, 1)
  t.falsy(retryStrategy.counter)
  t.falsy(retryStrategy.timeoutId)
})

test('xhr.retry with delay strategy', async t => {
  let count = 0
  const retryStrategy: XhrRetryStrategy & KVO = ({ counter, lastStatus }) => {
    count = counter
    return counter < 2 ? 100 * counter : xhr.STOP_RETRYING
  }

  const { status, data } = await xhr.get('https://httpbin.org/status/401', {
    retry: retryStrategy
  })

  t.is(status, 401)
  t.is(count, 2)
  t.falsy(retryStrategy.counter)
  t.falsy(retryStrategy.timeoutId)
})

test('forceRetry should override delay strategy', async t => {
  let count = 0
  let request: XhrRef
  const WAIT_TIME = 10000
  const now = +new Date()
  const retryStrategy: XhrRetryStrategy & KVO = ({ counter, lastStatus }) => {
    count = counter
    return counter === 1 ? WAIT_TIME : (counter <= 4 ? 0 : xhr.STOP_RETRYING) // stop after 5 tries
  }

  const response = xhr.get('https://httpbin.org/status/401', {
    retry: retryStrategy,
    ref: req => request = req
  })

  // wait a bit for the first attempt to finish (hopefully httpbin returns the first response on-time)
  await sleep(2000)

  if (request) {
    request.retryImmediately() // retry immediately instead of waiting to WAIT_TIME ms after the first attempt
  }

  const { status, data } = await response

  t.is(status, 401)
  t.is(count, 5)
  t.true(+new Date() - now < WAIT_TIME)
  t.falsy(retryStrategy.counter)
  t.falsy(retryStrategy.timeoutId)
})

test.after('cleanup', t => {
  console.log(__internal__)
})
