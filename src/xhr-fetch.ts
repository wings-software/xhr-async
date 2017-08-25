import axios, {
  AxiosRequestConfig,
  AxiosInterceptorManager,
  AxiosResponse,
  AxiosPromise
} from 'axios'

export type KVO = {
  [key: string]: any
}

export type XHR =
  | {
      abort: (message?: string) => void
    }
  | undefined

export type RequestPayload = {
  url?: string
  params?: KVO
  headers?: KVO
  data?: any
}

export interface RequestConfig extends AxiosRequestConfig {
  xhr?: (xhr?: XHR) => void
}

export type BeforeInterceptor = (args: RequestPayload) => void

//
// @see https://github.com/mzabriskie/axios#global-axios-defaults
//
export const defaults = axios.defaults

/**
 * Inject an interceptor before a request is being made.
 * @param interceptor interceptor.
 */
export const before = (interceptor: BeforeInterceptor) => {
  axios.interceptors.request.use(
    (config: RequestConfig) => {
      const { url = '', params, headers, data } = config

      interceptor({ url, params, headers, data })

      return config
    },
    (error: any) => Promise.reject(error)
  )
}

//
// Intercept axios request to inject cancellation token and set/unset xhr.
//
axios.interceptors.request.use(
  (config: RequestConfig) => {
    const { xhr } = config

    if (xhr) {
      config.cancelToken = new axios.CancelToken(cancel => {
        // call xhr so caller has a change to save the xhr object with abort() capability
        xhr({
          abort: message => {
            cancel(message)
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
    const { xhr } = response.config as RequestConfig

    // call xhr() to pass undefined so caller has a chance to set its xhr to undefined
    if (xhr) {
      xhr(undefined)
    }

    return response
  },
  (error: any) => Promise.reject(error)
)

export interface Response {
  status: number
  statusText?: string
  data?: any
  error?: any
  headers?: KVO
  request: RequestPayload
}

export async function request(
  url: string,
  options: RequestConfig = {}
): Promise<Response> {
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
    const {
      url: configUrl = '',
      params = undefined,
      data = undefined,
      headers = {}
    } =
      config || {}

    // TODO abort() does not give any object back

    if (xhr) {
      xhr(undefined) // unset xhr
    }

    return {
      status,
      statusText,
      error,
      data: responseData,
      request: { url: configUrl || url, params, data, headers }
    }
  }
}
