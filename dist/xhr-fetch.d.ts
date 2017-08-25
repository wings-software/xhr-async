import { AxiosRequestConfig } from 'axios';
export declare type KVO = {
    [key: string]: any;
};
export declare type XHR = {
    abort: (message?: string) => void;
} | undefined;
export declare type RequestPayload = {
    url?: string;
    params?: KVO;
    headers?: KVO;
    data?: any;
};
export interface RequestConfig extends AxiosRequestConfig {
    xhr?: (xhr?: XHR) => void;
}
export declare type BeforeInterceptor = (args: RequestPayload) => void;
export declare const defaults: AxiosRequestConfig;
/**
 * Inject an interceptor before a request is being made.
 * @param interceptor interceptor.
 */
export declare const before: (interceptor: BeforeInterceptor) => void;
export interface Response {
    status: number;
    statusText?: string;
    data?: any;
    error?: any;
    headers?: KVO;
    request: RequestPayload;
}
export declare function request(url: string, options?: RequestConfig): Promise<Response>;
