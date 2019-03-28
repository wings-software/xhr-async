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
    options?: KVO;
}
export interface XhrResponse {
    status: number;
    statusText: string;
    headers?: KVO;
    response?: any;
    error?: any;
    request: XhrRequest;
    [key: string]: any;
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
declare global  {
    interface Promise<T> {
        as: (as: string) => T;
    }
}
export declare function requestFor(method: string): any;
declare const xhr: {
    get: any;
    post: any;
    put: any;
    delete: any;
    head: any;
    connect: any;
    options: any;
    trace: any;
    patch: any;
    abort: (group: string) => void;
    defaults: AxiosRequestConfig;
    before: (interceptor: XhrBeforeInterceptor, options?: XhrInterceptorOptions) => void;
    after: (interceptor: XhrAfterInterceptor) => number;
    ABORTED: number;
    TIMEOUT: number;
    UNREACHABLE: number;
};
export default xhr;
