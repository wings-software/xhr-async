import * as assert from 'assert'
import * as ajax from './xhr-fetch'
import axios from 'axios'
import test from 'ava'

const sleep = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

test('axios defaults mapping', async t => {
  t.is(ajax.defaults, axios.defaults)
})

test('should not raise exception when server is not found', async t => {
  try {
    const { data, status, error, statusText } = await ajax.request(
      'https://notavalidurl.com1/'
    )
    t.is(status, 0)
  } catch (error) {
    t.fail('request should not raise exception, ever.')
  }
})

test('status code should be legit', async t => {
  const code = 418
  const { data, status, error, statusText } = await ajax.request(
    'https://httpbin.org/status/' + code
  )

  t.is(status, code)
})

test('status code 200', async t => {
  const { data, status } = await ajax.request('https://httpbin.org')
  t.is(status, 200)
})

test('should set header correctly with before()', async t => {
  const bearer = 'Bearer 1234'

  ajax.before(({ headers = {} }) => {
    headers.Authorization = bearer
  })

  const { data, status, request } = await ajax.request(
    'https://httpbin.org/headers'
  )

  t.is(status, 200)
  t.is(data.headers.Authorization, bearer)

  if (request && request.headers) {
    t.is(request.headers.Authorization, bearer)
  } else {
    t.fail('request.headers must be set and returned properly')
  }
})

test('should set xhr properly', async t => {
  let xhr

  const { data, status } = await ajax.request('https://httpbin.org/', {
    xhr: _xhr => (xhr = _xhr)
  })

  t.is(status, 200)
  t.is(xhr, undefined) // xhr should be unset to undefined after the request
})

test('xhr should not be null during the request', async t => {
  let xhr

  const response = ajax.request('https://httpbin.org/delay/2', {
    xhr: _xhr => (xhr = _xhr)
  })

  await sleep(1)

  t.truthy(xhr) // during the request ie being made, xhr should be set

  const { status } = await response

  t.is(status, 200)
  t.is(xhr, undefined) // when the request is fulfilled, xhr should be unset
})

test('xhr.abort() should work', async t => {
  let xhr: ajax.XHR

  const response = ajax.request('https://httpbin.org/delay/2', {
    xhr: _xhr => (xhr = _xhr)
  })

  await sleep(1)

  t.truthy(xhr) // during the request is being made, xhr should be set

  if (xhr) {
    xhr.abort()
  }

  const { status } = await response

  t.is(status, 0)
  t.is(xhr, undefined) // abort() should also unset xhr
})

test('should unset xhr when an exception happens', async t => {
  let xhr
  const {
    data,
    status,
    error,
    statusText
  } = await ajax.request('https://notavalidurl.com1/', {
    xhr: _xhr => (xhr = _xhr)
  })

  t.is(status, 0)
  t.is(xhr, undefined)
})
