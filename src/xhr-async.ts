import axios, {
  AxiosRequestConfig,
  AxiosInterceptorManager,
  AxiosResponse,
  AxiosPromise
} from 'axios'

/**
 * Key-Value object type.
 */
export interface KVO {
  [key: string]: any
}

/**
 * AbortableXHR, used to set and unset xhr object for fetch cancellation.
 */
export type AbortableXhr = undefined | {
  abort() : void
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

/**
 * Request Options extends AxiosRequestConfig with xhr setter support.
 * @export
 * @interface RequestOptions
 * @extends {AxiosRequestConfig}
 */
export interface XhrOptions extends AxiosRequestConfig {
  xhr?: (xhr: AbortableXhr) => void
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
      const {
        status,
        statusText,
        headers: responseHeaders,
        data: responseData,
        config
      } = response
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
// Intercept axios request to inject cancel token and set/unset xhr.
//
axios.interceptors.request.use(
  (config: XhrOptions) => {
    const { xhr } = config

    if (xhr) {
      config.cancelToken = new axios.CancelToken(cancel => {
        // call xhr so caller has a change to save the xhr object with abort() capability
        xhr({
          abort: () => {
            cancel('TERMINATED BY USER') // TODO: Make it somehow cancel return request object and can be captured by APIs
            xhr(undefined) // unset xhr
          }
        })
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
    const { xhr } = response.config as XhrOptions

    // call xhr() to pass undefined so caller has a chance to set its xhr to undefined
    if (xhr) {
      xhr(undefined)
    }

    return response
  },
  (error: any) => Promise.reject(error)
)

async function get(
  url: string,
  options: XhrOptions = {}
): Promise<XhrResponse> {
  options.url = url

  try {
    const {
      status,
      statusText,
      headers: responseHeaders,
      data: responseData,
      config
    } = await axios(options)
    const { url, params, data, headers } = config

    return {
      status,
      statusText,
      data: responseData,
      headers: responseHeaders,
      request: { url, params, data, headers }
    }
  } catch (error) {
    const { response } = error
    const statusText = (response && response.statusText) || error.toString()
    const status = (response && response.status) || 0
    const responseData = response && response.data
    const { xhr } = options
    const config = (response && response.config) || error.config
    const { params = undefined, data = undefined, headers = {} } = config || {}

    // TODO abort() does not give any object back, the request object becomes useless

    if (xhr) {
      xhr(undefined) // unset xhr
    }

    return {
      status,
      statusText,
      error,
      data: responseData,
      request: { url: url, params, data, headers }
    }
  }
}

export function requestFor(method: string) {
  return async function(
    url: string,
    options: XhrOptions = {}
  ): Promise<XhrResponse> {
    options.method = method
    return get(url, options)
  }
}

const xhr = {
  get,
  post: requestFor('POST'),
  put: requestFor('PUT'),
  delete: requestFor('DELETE'),
  head: requestFor('HEAD'),
  connect: requestFor('CONNECT'),
  options: requestFor('OPTIONS'),
  trace: requestFor('TRACE'),
  patch: requestFor('PATCH'),

  // @see https://github.com/mzabriskie/axios#global-axios-defaults
  defaults: axios.defaults,

  before: xhrBefore,
  after: xhrAfter
}

export default xhr
