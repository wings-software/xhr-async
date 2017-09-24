import axios, { AxiosRequestConfig, AxiosInterceptorManager, AxiosResponse, AxiosPromise } from 'axios'

/**
 * Key-Value object type.
 */
export interface KVO<T = any> {
  [key: string]: T
}

/**
 * RequestRef is used for cancellation.
 */
export type RequestRef =
  | undefined
  | {
      abort(): void
    }

/**
 * XHR Request.
 */
export interface XhrRequest {
  url?: string
  params?: KVO
  headers?: KVO
  data?: any
}

/**
 * XHR Response.
 */
export interface XhrResponse {
  status: number
  statusText: string
  data?: any
  headers?: KVO
  error?: any
  request: XhrRequest
}

export interface XhrRetry {
  count: number
  wait: (step: number) => number
}

/**
 * Request Options extends AxiosRequestConfig with xhr setter support.
 * @export
 * @interface RequestOptions
 * @extends {AxiosRequestConfig}
 */
export interface XhrOptions extends AxiosRequestConfig {
  ref?: (request: RequestRef) => void

  // xhr group, used to terminate a batch of xhr requests
  group?: string

  // retry if failed
  retry?: number | XhrRetry
}

/**
 * Before Interceptor.
 */
export interface XhrBeforeInterceptor {
  (args: XhrRequest): void
}

/**
 * After Interceptor.
 */
export interface XhrAfterInterceptor {
  (args: XhrResponse): void
}

enum STATUS_CODE {
  ABORTED = -1,
  TIMEOUT = -2,
  SERVER_UNREACHABLE = -3
}

/**
 * Inject an interceptor before a request is being made.
 * @param interceptor interceptor.
 */
const xhrBefore = (interceptor: XhrBeforeInterceptor) => {
  axios.interceptors.request.use(
    (config: XhrOptions) => {
      const { url = '', params, headers, data } = config

      interceptor({ url, params, headers, data })

      return config
    },
    (error: any) => Promise.reject(error)
  )
}

/**
 * Inject an interceptor after a response is returned.
 * @param interceptor interceptor.
 */
const xhrAfter = (interceptor: XhrAfterInterceptor) => {
  axios.interceptors.response.use(
    (response: any) => {
      const { status, statusText, headers: responseHeaders, data: responseData, config } = response
      const { url, params, headers, data } = config

      interceptor({
        status,
        statusText,
        data: responseData,
        headers: responseHeaders,
        request: { url, params, data, headers }
      })

      return response
    },
    (error: any) => Promise.reject(error)
  )
}

//
// Xhr groups
//
const xhrGroups: KVO<Array<RequestRef>> = {}

//
// Intercept axios request to inject cancel token and set/unset xhr.
//
axios.interceptors.request.use(
  (config: XhrOptions) => {
    const { ref, group } = config

    if (ref || group) {
      config.cancelToken = new axios.CancelToken(cancel => {
        const abort: RequestRef = {
          abort: () => {
            cancel('TERMINATED BY USER') // TODO: Make it somehow cancel return request object and can be captured by APIs

            if (ref) {
              ref(undefined) // unset xhr
            }

            if (group) {
              const xhrGroup = xhrGroups[group]
              xhrGroup.splice(xhrGroup.indexOf(abort), 1)
            }
          }
        }

        if (group) {
          const xhrGroup = (xhrGroups[group] = xhrGroups[group] || [])
          xhrGroup.push(abort)
        }

        // call xhr so caller has a change to save the xhr object with abort() capability
        if (ref) {
          ref(abort)
        }
      })
    }

    return config
  },
  (error: any) => Promise.reject(error)
)

//
// Intercept axios response to unset xhr.
//
axios.interceptors.response.use(
  (response: any) => {
    const { ref, group } = response.config as XhrOptions

    // call xhr() to pass undefined so caller has a chance to set its xhr to undefined
    if (ref) {
      ref(undefined)
    }

    if (group) {
      // TODO Remove request from xhrGroups
    }

    return response
  },
  (error: any) => Promise.reject(error)
)

async function get(url: string, options: XhrOptions = {}): Promise<XhrResponse> {
  options.url = url

  try {
    const { status, statusText, headers: responseHeaders, data: responseData, config } = await axios(options)
    const { url, params, data, headers } = config

    return {
      status,
      statusText,
      data: responseData,
      headers: responseHeaders,
      request: { url, params, data, headers }
    }
  } catch (error) {
    if (options.retry && typeof(options.retry) === 'number' && options.retry > 0) {
      options.retry--
      return get(url, options)
    }

    const { response } = error
    const status = (response && response.status) || 0
    const { ref } = options
    const config = (response && response.config) || error.config
    const { params = undefined, data = undefined, headers = {} } = config || {}

    // TODO abort() does not give any object back, the request object becomes useless

    if (ref) {
      ref(undefined) // unset xhr
    }

    // TODO Put reason(s) into error
    // error: {
    //  timeout | aborted | unreachable | hostNotFound | ...
    // }

    return {
      status,
      statusText: (response && response.statusText) || error.toString(),
      error,
      data: response && response.data,
      request: { url: url, params, data, headers }
    }
  }
}

export function requestFor(method: string) {
  return async function(url: string, options: XhrOptions = {}): Promise<XhrResponse> {
    options.method = method
    return get(url, options)
  }
}

function abort(group: string) {
  const xhrGroup = xhrGroups[group]

  if (xhrGroup) {
    xhrGroup.forEach(xhr => xhr && xhr.abort())
  }
}

export default {
  get,
  post: requestFor('POST'),
  put: requestFor('PUT'),
  delete: requestFor('DELETE'),
  head: requestFor('HEAD'),
  connect: requestFor('CONNECT'),
  options: requestFor('OPTIONS'),
  trace: requestFor('TRACE'),
  patch: requestFor('PATCH'),

  abort: abort,

  // @see https://github.com/mzabriskie/axios#global-axios-defaults
  defaults: axios.defaults,

  before: xhrBefore,
  after: xhrAfter
}

//
// TODO:
//
// 1- Differentiate status codes: timeout, abort, network unreachable, etc (currently all 0)
//    Use a key for each request, store config, then clean up when things are done?
// 2- Abort() should give back request info
// 3- More tests (binary, stream, etc)
// 4- README
// 5- Retry (if failed then retry N times)
// - Retry strategy (wait for N ms at first attempt, N*retryCount, etc...)
// - Calling abort() should also terminate retrying? Or abort({ skipRetry: true })