import { AxiosRequestConfig } from 'axios';
/**
 * Key-Value object type.
 */
export interface KVO {
    [key: string]: any;
}
/**
 * AbortableXHR, used to set and unset xhr object for fetch cancellation.
 */
export declare type AbortableXhr = undefined | {
    abort(): void;
};
/**
 * XHR Request.
 */
export interface XhrRequest {
    url?: string;
    params?: KVO;
    headers?: KVO;
    data?: any;
}
/**
 * XHR Response.
 */
export interface XhrResponse {
    status: number;
    statusText: string;
    data?: any;
    headers?: KVO;
    error?: any;
    request: XhrRequest;
}
/**
 * Request Options extends AxiosRequestConfig with xhr setter support.
 * @export
 * @interface RequestOptions
 * @extends {AxiosRequestConfig}
 */
export interface XhrOptions extends AxiosRequestConfig {
    xhr?: (xhr: AbortableXhr) => void;
}
/**
 * Before Interceptor.
 */
export interface XhrBeforeInterceptor {
    (args: XhrRequest): void;
}
/**
 * After Interceptor.
 */
export interface XhrAfterInterceptor {
    (args: XhrResponse): void;
}
export declare function requestFor(method: string): (url: string, options?: XhrOptions) => Promise<XhrResponse>;
declare const xhr: {
    get: (url: string, options?: XhrOptions) => Promise<XhrResponse>;
    post: (url: string, options?: XhrOptions) => Promise<XhrResponse>;
    put: (url: string, options?: XhrOptions) => Promise<XhrResponse>;
    delete: (url: string, options?: XhrOptions) => Promise<XhrResponse>;
    head: (url: string, options?: XhrOptions) => Promise<XhrResponse>;
    connect: (url: string, options?: XhrOptions) => Promise<XhrResponse>;
    options: (url: string, options?: XhrOptions) => Promise<XhrResponse>;
    trace: (url: string, options?: XhrOptions) => Promise<XhrResponse>;
    patch: (url: string, options?: XhrOptions) => Promise<XhrResponse>;
    defaults: AxiosRequestConfig;
    before: (interceptor: XhrBeforeInterceptor) => void;
    after: (interceptor: XhrAfterInterceptor) => void;
};
export default xhr;
