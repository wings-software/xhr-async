import { AxiosRequestConfig } from 'axios';
export declare type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'CONNECT' | 'TRACE';
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
export interface XhrResponse<T> {
    status: number;
    statusText: string;
    headers?: KVO;
    response?: T;
    error?: any;
    request: XhrRequest;
    extra?: any;
}
export interface XhrPromise<T extends XhrResponse<any>> extends Promise<T> {
    as<U extends string>(key: U): Promise<Omit<T, 'response'> & Record<U, T['response']> & {
        response: undefined;
    }>;
}
export declare type XhrRetryAfter = (params: {
    counter: number;
    lastStatus: number;
}) => number;
export interface XhrOptions<U = any> extends AxiosRequestConfig, KVO {
    ref?: (request?: XhrRef) => void;
    group?: string;
    retry?: number | XhrRetryAfter;
    data?: U;
}
export declare type XhrBeforeInterceptor = (args: XhrRequest) => void;
export declare type XhrAfterInterceptor = (args: XhrResponse<any>) => void;
export interface XhrInterceptorOptions {
    first?: boolean;
    replaceAll?: boolean;
}
export interface RequestTrackingInfo {
    config: XhrOptions;
    status?: number;
    startTime: number;
}
export declare type Request = <T, U = any>(url: string, options?: XhrOptions<U>, extra?: KVO) => XhrPromise<XhrResponse<T>>;
export declare function requestFor(method: Method): Request;
declare function abort(group: string): void;
declare const xhr: {
    get: Request;
    post: Request;
    put: Request;
    delete: Request;
    head: Request;
    connect: Request;
    options: Request;
    trace: Request;
    patch: Request;
    abort: typeof abort;
    defaults: AxiosRequestConfig;
    before: (interceptor: XhrBeforeInterceptor, options?: XhrInterceptorOptions) => void;
    after: (interceptor: XhrAfterInterceptor) => number;
    ABORTED: number;
    TIMEOUT: number;
    UNREACHABLE: number;
};
export default xhr;
