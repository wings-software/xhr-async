import { AxiosRequestConfig } from 'axios';
export interface KVO<T = any> {
    [key: string]: T;
}
export interface XhrRef {
    abort(options?: {
        ignoreRetry: boolean;
    }): void;
    retryImmediately(): void;
}
export interface XhrRequest {
    url?: string;
    params?: KVO;
    headers?: KVO;
    data?: any;
}
export interface XhrResponse {
    status: number;
    statusText: string;
    headers?: KVO;
    response?: any;
    error?: any;
    request: XhrRequest;
}
export declare type XhrRetryAfter = (params: {
    counter: number;
    lastStatus: number;
}) => number;
export interface XhrOptions extends AxiosRequestConfig {
    ref?: (request?: XhrRef) => void;
    group?: string;
    retry?: number | XhrRetryAfter;
}
export declare type XhrBeforeInterceptor = (args: XhrRequest) => void;
export declare type XhrAfterInterceptor = (args: XhrResponse) => void;
export interface XhrInterceptorOptions {
    first?: boolean;
    replaceAll?: boolean;
}
export interface RequestTrackingInfo {
    config: XhrOptions;
    status?: number;
    startTime: number;
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
    abort: (group: string) => void;
    defaults: AxiosRequestConfig;
    before: (interceptor: XhrBeforeInterceptor, options?: XhrInterceptorOptions) => void;
    after: (interceptor: XhrAfterInterceptor) => number;
    ABORTED: number;
    TIMEOUT: number;
    UNREACHABLE: number;
};
export default xhr;
