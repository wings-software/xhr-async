import xhr, { XhrRef, XhrRetryAfter, XhrRequest, XhrResponse, KVO } from './xhr-async'
import test from 'ava'
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const includes = (obj1: KVO | undefined, obj2: KVO | undefined): boolean =>
  !!(!obj2 || (obj1 && !Object.keys(obj2).some(key => !obj1[key])))

test('defaults should exist', async t => {
  t.truthy(xhr.defaults)
})

test('should not raise exception when server is not found', async t => {
  try {
    const { status } = await xhr.get('https://notavalidurl.com1/')
    t.is(status, 0)
  } catch (error) {
    t.fail('request should not raise exception, ever.')
  }
})

test('status code should be legit', async t => {
  const code = 418
  const { status } = await xhr.get('https://httpbin.org/status/' + code)

  t.is(status, code)
})

test('baseURL should work', async t => {
  const { status } = await xhr.get('https://httpbin.org/ip')
  t.is(status, 200)
})

test('as should result the same as response', async t => {
  const { status, ip, response } = await xhr.get<{ origin: string }>('https://httpbin.org/ip').as('ip')

  t.is(status, 200)
  t.truthy(ip)
  t.deepEqual(ip, response)
})

test('status code 200', async t => {
  const { response, status } = await xhr.get('https://httpbin.org')
  t.is(status, 200)
})

test('should set header correctly with before()', async t => {
  const bearer = 'Bearer 1234'

  xhr.before(({ headers = {} }) => {
    headers.Authorization = bearer
  })

  const { response, status, request } = await xhr.get('https://httpbin.org/headers')

  t.is(status, 200)
  t.is(response.headers.Authorization, bearer)

  if (request && request.headers) {
    t.is(request.headers.Authorization, bearer)
  } else {
    t.fail('request.headers must be set and returned properly')
  }
})

test('should set request object properly', async t => {
  let request: any

  const { response, status } = await xhr.get('https://httpbin.org/', {
    ref: req => (request = req)
  })

  t.is(status, 200)
  t.is(request, undefined) // xhr should be unset to undefined after the request
})

test('post should work properly', async t => {
  const data = { a: 1, b: 2 }
  const { response, status } = await xhr.post('https://httpbin.org/post', { data })

  t.is(status, 200)
  t.deepEqual(response.json, data)
})

test.skip('patch should work properly', async t => {
  const data = { a: 1, b: 2 }
  const { response, status } = await xhr.post('https://httpbin.org/patch', { data })

  t.is(status, 200)
  t.deepEqual(response.json, data)
})

test.skip('put should work properly', async t => {
  const data = { a: 1, b: 2 }
  const { response, status } = await xhr.post('https://httpbin.org/put', { data })

  t.is(status, 200)
  t.deepEqual(response.json, data)
})

test.skip('delete should work properly', async t => {
  const data = { a: 1, b: 2 }
  const { response, status } = await xhr.post('https://httpbin.org/delete', { data })

  t.is(status, 200)
  t.deepEqual(response.json, data)
})

test('ref should not be null during the request', async t => {
  let rootRequest

  const response = xhr.get('https://httpbin.org/delay/2', {
    ref: req => (rootRequest = req)
  })

  await sleep(1)

  t.truthy(rootRequest) // during the request ie being made, xhr should be set

  const { status } = await response

  t.is(status, 200)
  t.is(rootRequest, undefined) // when the request is fulfilled, xhr should be unset
})

test('ref.abort() should work', async t => {
  let rootReq: XhrRef | undefined
  const url = 'https://httpbin.org/delay/2'
  const headers = { foo: 'bar', hello: 'world' }
  const data = [1, 2, 3, 4]
  const params = { a: 1, b: 2, c: 3 }

  const xhrResponse = xhr.get(url, {
    headers,
    params,
    data,
    ref: req => (rootReq = req)
  })

  await sleep(1)

  t.truthy(rootReq) // during the request is being made, xhr should be set

  if (rootReq) {
    rootReq.abort()
  }

  const {
    status,
    request: { url: _url, params: _params, data: _data, headers: _headers },
    request
  } = await xhrResponse

  t.is(status, xhr.ABORTED)
  t.is(rootReq, undefined) // abort() should also unset xhr
  t.deepEqual(url, _url)
  t.deepEqual(params, _params)
  t.deepEqual(data, JSON.parse(_data))

  if (!includes(_headers, headers)) {
    t.fail('Request headers are not valid')
  }
})

test('should unset ref when an exception happens', async t => {
  let rootReq
  const { status } = await xhr.get('https://notavalidurl.com1/', {
    ref: req => (rootReq = req)
  })

  t.is(status, xhr.UNREACHABLE)
  t.is(rootReq, undefined)
})

test('xhr.group should work', async t => {
  const group = 'httpbin'
  let request

  const response = xhr.get('https://httpbin.org/delay/2', {
    group,
    ref: req => (request = req)
  })

  await sleep(1) // wait a bit to initialize the request

  t.truthy(request) // during the request is being made, xhr should be set

  xhr.abort(group) // abort the whole group

  const { status } = await response

  t.is(status, xhr.ABORTED)
  t.is(request, undefined) // abort() from xhr.abort(group) should also unset xhr
})

test('xhr.retry should work with with abort()', async t => {
  let request: XhrRef | undefined

  const res = xhr.get('https://httpbin.org/delay/2', {
    retry: 1,
    ref: req => (request = req)
  })

  await sleep(1) // wait a bit to initialize the request

  // Terminate the request, another attempt should be made
  if (request) {
    request.abort()
  }

  const { status, response, headers } = await res

  t.is(status, 200)
  t.truthy(response)
  t.truthy(headers)
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
})

test('abort with ignoreRetry should kill all retries', async t => {
  let count = 0
  let request: XhrRef | undefined
  const retryAfter: XhrRetryAfter & KVO = ({ counter, lastStatus }) => {
    count = counter
    return counter < 2 ? counter * 10000 : -1
  }

  const response = xhr.get('https://httpbin.org/status/401', {
    retry: retryAfter,
    ref: req => (request = req)
  })

  // hopefully the first attempt has response from httpbin, otherwise
  // this test fails because abort() terminates the first request, not the
  // retrying request
  await sleep(5000)

  if (request) {
    request.abort({ ignoreRetry: true })
  }

  const { status } = await response

  t.is(status, xhr.ABORTED)
  t.is(count, 1)
  t.falsy(retryAfter.counter)
  t.falsy(retryAfter.timeoutId)
})

test('xhr.retry with delay strategy', async t => {
  let count = 0
  const retryAfter: XhrRetryAfter & KVO = ({ counter, lastStatus }) => {
    count = counter
    return counter < 2 ? 100 * counter : -1
  }

  const { status } = await xhr.get('https://httpbin.org/status/401', {
    retry: retryAfter
  })

  t.is(status, 401)
  t.is(count, 2)
  t.falsy(retryAfter.counter)
  t.falsy(retryAfter.timeoutId)
})

test('retryImmediately should override delay strategy', async t => {
  let count = 0
  let request: XhrRef | undefined
  const WAIT_TIME = 15000
  const now = Date.now()
  const retryAfter: XhrRetryAfter & KVO = ({ counter, lastStatus }) => {
    count = counter
    return counter === 1 ? WAIT_TIME : counter <= 4 ? counter * 10 : -1 // stop after 5 tries
  }

  const response = xhr.get('https://httpbin.org/status/401', {
    retry: retryAfter,
    ref: req => (request = req)
  })

  // wait a bit for the first attempt to finish (hopefully
  // httpbin returns the first response on-time, otherwise, this test will fail)
  await sleep(5000)

  if (request) {
    request.retryImmediately() // retry immediately instead of waiting to WAIT_TIME ms after the first attempt
  }

  const { status } = await response

  t.is(status, 401)
  t.is(count, 5)
  t.true(Date.now() - now < WAIT_TIME)
  t.falsy(retryAfter.counter)
  t.falsy(retryAfter.timeoutId)
  t.falsy(retryAfter.retry)
})

test('xhr properties should be immutable', t => {
  const x = xhr as KVO
  t.throws(() => {
    x.get = null // force to re-assign, this should throw an error
    x.post = null
  })
  t.truthy(x.get)
  t.truthy(x.post)
})

test('before should be called before a request is made', async t => {
  const url = 'https://httpbin.org/anything/before-anything-' + +new Date()
  const data = { a: 1, b: 2 }
  const params = { abc: 1, def: 2 }
  const headers = { 'x-auth': true }
  let requestTime
  let beforeTime
  let xhrRequest: XhrRequest | undefined

  xhr.before(
    ({ url: _url, params: _params, headers: _headers, data: _data }) => {
      if (_url === url) {
        beforeTime = +new Date()
        xhrRequest = { url: _url, params: _params, headers: _headers, data: _data }
      }
    },
    { replaceAll: true }
  )

  await xhr.post(url, {
    params,
    headers,
    data,
    ref: req => {
      requestTime = +new Date()
    }
  })

  t.true(beforeTime && requestTime && beforeTime <= requestTime)
  t.is(xhrRequest && xhrRequest.url, url)
  t.is(xhrRequest && xhrRequest.params, params)
  t.is(xhrRequest && xhrRequest.headers, headers)
  t.is(xhrRequest && xhrRequest.data, data)
})

test('after should be called after a response is returned', async t => {
  const data = { a: 1, b: 2 }
  let requestTime
  let afterTime
  let xhrRequest

  xhr.after(({ status: _status, statusText, headers, response: _body, error, request }) => {
    afterTime = +new Date()
    xhrRequest = request
  })

  const { response, status } = await xhr.post('https://httpbin.org/post', {
    data,
    ref: req => {
      requestTime = +new Date()
    }
  })

  t.is(status, 200)
  t.true(afterTime && requestTime && afterTime >= requestTime)
})

test('after should be called after a failure', async t => {
  const data = { a: 1, b: 2 }
  const bodyStr = JSON.stringify(data)
  const url = 'https://httpbin.org/status/401'
  const params = { name: 'J', age: 10 }
  const headers = { Authorization: 'Bearer 123' }
  let xhrResponse: XhrResponse<any> | undefined

  xhr.after(_xhrResponse => (xhrResponse = _xhrResponse))

  await xhr.post(url, {
    headers,
    params,
    data
  })

  t.truthy(xhrResponse)
  t.is(xhrResponse && xhrResponse.status, 401)
  t.truthy(xhrResponse && xhrResponse.statusText)
  t.truthy(xhrResponse && xhrResponse.headers)
  t.truthy(xhrResponse && xhrResponse.error)
  t.truthy(xhrResponse && xhrResponse.request)

  t.deepEqual(xhrResponse && xhrResponse.request.data, bodyStr)
  t.is(xhrResponse && xhrResponse.request.url, url)
  t.true(includes(xhrResponse && xhrResponse.request.headers, headers))
  t.is(xhrResponse && xhrResponse.request.params, params)
  t.is(xhrResponse && xhrResponse.request.data, bodyStr)
})

test.after('cleanup', t => {
  // console.log(__internal__)
})
