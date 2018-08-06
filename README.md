Modern await/async HTTP client library built on top of (axios)[https://github.com/axios/axios] inspired by golang's syntax.

## Install

```bash
npm i xhr-async
```

or

```bash
yarn add xhr-async
```

Then in your script:

```javascript
import xhr from 'xhr-async'
```

## API

```javascript
const {
  status,
  statusText,
  error,
  headers,
  response,
  request
} = await xhr.[get | post | delete | head | options | trace](url, options)
```

Most of the time, you'd probably need `status`, `error`, and `response` back from a request.

`options` is exactly the same as axios' [options](https://github.com/axios/axios#request-config).

xhr-async supports response alias, for example instead of:

```javascript
const { response: ip } = await xhr.get('https://httpbin.org/ip')
```

You can do:

```javascript
const { ip } = await xhr.get('https://httpbin.org/ip').as('ip')
```

To make it easier to handle network connectivity, xhr-async provides three special statuses `UNREACHABLE`, `ABORTED`, and `TIMEOUT`:

```javascript
const { status } = await xhr.get('https://httpbin.org/ip')

if (status === xhr.UNREACHABLE) {
  // server is unreachable
} else if (status === xhr.ABORTED) {
  // request is aborted by xhr.abort()
} else if (status === xhr.TIMEOUT) {
  // request is timeout
}
```

### xhr.defaults

`xhr.defaults` is used to configure global configuration. It is exactly the same as axios' [defaults](https://github.com/axios/axios#config-defaults) except that axios' `transformRequest` and `transformResponse` are currently not supported.

### xhr.abort

xhr-async supports request cancellation. You can abort an ongoing request, or abort a group of requests.

#### Abort a single request

```javascript
let xhrReq

const { status } = await xhr.get('https://httpbin.org/delay/2', {
  ref: req => xhrReq = req
})

// At some place when you want to abort a request
xhrReq.abort()
```

#### Abort a group of requests

Assume you made two requests to some endpoints, at some point you want to abort all ongoing requests of those endpoints. First you need to pass the same group name to the requests, then call `xhr.abort(GROUP_NAME)`.

```javascript
let requestGroup = 'myRequestGroup'

const { status } = await xhr.get('https://httpbin.org/delay/2', {
  group: requestGroup
})

const { status } = await xhr.get('https://httpbin.org/headers', {
  group: requestGroup
})

// At some place when you want to abort all requests that belong to `requestGroup` group:
xhrReq.abort(requestGroup)
```

If you want to abort ALL ongoing request being made by xhr-async, you can call `xhr.abort()` without any parameters.

```javascript
xhr.abort()
```

### Examples

#### GET

```javascript
const { response, status } = await xhr.get('https://httpbin.org/ip')
```

#### POST

```javascript
const {
  response,
  status
} = await xhr.post('https://httpbin.org/post', {
  data: {
    name: 'xhr-async',
    timestamp: new Date()
  }
})
```

### before/after hooks

Similar to axios' request and response interceptors, xhr-async support `before` and `after` hooks.

```javascript
xhr.before(({ url, params, headers = {}, data }) => {
  headers.Authorization = 'Bearer 1234567890'
})
```

```javascript
xhr.after(({ status, statusText, headers, response, error, request }) => {
  if (status === 401) {
    // redirect to login page
  }
})
```

### License

MIT