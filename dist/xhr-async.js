"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var proxymise_1 = require("./proxymise");
var beforeInterceptors = [];
var afterInterceptors = [];
var before = function (interceptor, options) {
    options = options || {};
    if (options.first) {
        beforeInterceptors.unshift(interceptor);
    }
    else if (options.replaceAll) {
        beforeInterceptors.splice(0, beforeInterceptors.length, interceptor);
    }
    else {
        beforeInterceptors.push(interceptor);
    }
};
var after = function (interceptor) { return afterInterceptors.push(interceptor); };
var xhrGroups = {};
var requests = {};
var autoGeneratedId = 0;
var UNREACHABLE = 0;
var ABORTED = -1;
var TIMEOUT = -2;
axios_1.default.interceptors.request.use(function (config) {
    var ref = config.ref, group = config.group, retry = config.retry;
    var id = config.id;
    requests[id] = { config: config, startTime: +new Date() };
    if (ref || group) {
        config.cancelToken = new axios_1.default.CancelToken(function (cancel) {
            var requestRef = {
                abort: function (options) {
                    cancel();
                    var _id = config.id;
                    if (ref) {
                        ref(undefined);
                    }
                    if (group) {
                        delete xhrGroups[group][id];
                    }
                    if (requests[_id]) {
                        requests[_id].status = ABORTED;
                    }
                    if (options && options.ignoreRetry) {
                        var retryAfter = typeof (retry) !== 'number' && retry;
                        if (retryAfter) {
                            retryAfter.cancelRetry();
                        }
                    }
                },
                retryImmediately: function () {
                    var retryAfter = typeof (retry) !== 'number' && retry;
                    if (retryAfter) {
                        retryAfter.retryImmediately();
                    }
                }
            };
            if (group) {
                xhrGroups[group] = xhrGroups[group] || {};
                xhrGroups[group][id] = requestRef;
            }
            if (ref) {
                ref(requestRef);
            }
        });
    }
    return config;
}, function (error) { return Promise.reject(error); });
axios_1.default.interceptors.response.use(function (response) {
    var _a = response.config, ref = _a.ref, id = _a.id, group = _a.group;
    if (ref) {
        ref(undefined);
    }
    if (group) {
        delete xhrGroups[group][id];
        if (!Object.keys(xhrGroups[group]).length) {
            delete xhrGroups[group];
        }
    }
    delete requests[id];
    return response;
}, function (error) { return Promise.reject(error); });
function cleanupRetry(retry, ignoreCounter) {
    if (ignoreCounter === void 0) { ignoreCounter = true; }
    var retryAfter = retry && typeof (retry) !== 'number' && retry;
    if (retryAfter) {
        if (ignoreCounter) {
            delete retryAfter.counter;
        }
        delete retryAfter.timeoutId;
        delete retryAfter.retryImmediately;
        delete retryAfter.cancelRetry;
    }
}
function ajax(url, options, extra) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var xhrResponse, _a, status, statusText, responseHeaders, responseData, config, params, data, headers, error_1, response_1, headers_1, id, request, config_1, status_1, duration, generateErrorResult_1, retryAfter_1, counter, timeoutId, delay_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options.id = ++autoGeneratedId + '-' + (new Date()).toUTCString();
                    options.url = url;
                    options.headers = options.headers || {};
                    beforeInterceptors.forEach(function (interceptor) {
                        return interceptor({ url: url, headers: options.headers, params: options.params, data: options.data, options: options });
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4, axios_1.default(options)];
                case 2:
                    _a = _b.sent(), status = _a.status, statusText = _a.statusText, responseHeaders = _a.headers, responseData = _a.data, config = _a.config;
                    params = config.params, data = config.data, headers = config.headers;
                    cleanupRetry(options.retry);
                    xhrResponse = {
                        status: status,
                        statusText: statusText,
                        response: responseData,
                        headers: responseHeaders,
                        request: { url: url, params: params, data: data, headers: headers },
                        extra: extra
                    };
                    return [3, 4];
                case 3:
                    error_1 = _b.sent();
                    response_1 = error_1.response;
                    headers_1 = response_1 && response_1.headers;
                    id = options.id;
                    request = requests[id];
                    config_1 = request.config;
                    status_1 = (request.status || response_1 && response_1.status) || UNREACHABLE;
                    if (status_1 === UNREACHABLE && !!config_1.timeout) {
                        duration = +new Date() - request.startTime;
                        if (duration >= config_1.timeout) {
                            status_1 = TIMEOUT;
                        }
                    }
                    delete requests[id];
                    generateErrorResult_1 = function (optionalStatus) {
                        var ref = options.ref;
                        var _a = config_1 || {}, _b = _a.params, params = _b === void 0 ? undefined : _b, _c = _a.data, data = _c === void 0 ? undefined : _c, _d = _a.headers, requestHeaders = _d === void 0 ? {} : _d;
                        if (ref) {
                            ref(undefined);
                        }
                        return {
                            status: optionalStatus || status_1,
                            statusText: (response_1 && response_1.statusText) || error_1.toString(),
                            headers: headers_1,
                            response: response_1 && response_1.data,
                            error: error_1,
                            request: { url: url, params: params, data: data, headers: requestHeaders },
                            extra: extra
                        };
                    };
                    if (options.retry) {
                        if (typeof (options.retry) === 'number' && options.retry > 0) {
                            options.retry--;
                            return [2, ajax(url, options)];
                        }
                        else {
                            retryAfter_1 = options.retry;
                            counter = retryAfter_1.counter, timeoutId = retryAfter_1.timeoutId;
                            retryAfter_1.counter = (counter || 0) + 1;
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                            }
                            delay_1 = retryAfter_1({ counter: retryAfter_1.counter, lastStatus: status_1 });
                            if (delay_1 >= 0) {
                                return [2, new Promise(function (resolve) {
                                        retryAfter_1.timeoutId = setTimeout(function () {
                                            resolve(ajax(url, options));
                                            cleanupRetry(retryAfter_1, false);
                                        }, delay_1);
                                        retryAfter_1.retryImmediately = function () {
                                            clearTimeout(retryAfter_1.timeoutId);
                                            resolve(ajax(url, options));
                                            cleanupRetry(retryAfter_1, false);
                                        };
                                        retryAfter_1.cancelRetry = function () {
                                            clearTimeout(retryAfter_1.timeoutId);
                                            cleanupRetry(retryAfter_1);
                                            resolve(generateErrorResult_1(ABORTED));
                                        };
                                    })];
                            }
                            else {
                                cleanupRetry(retryAfter_1);
                            }
                        }
                    }
                    xhrResponse = generateErrorResult_1();
                    xhrResponse.extra = extra;
                    return [3, 4];
                case 4:
                    afterInterceptors.forEach(function (interceptor) { return interceptor(xhrResponse); });
                    return [2, new Proxy(xhrResponse, {
                            get: function (target, name) {
                                return name === 'as'
                                    ? function (as) {
                                        xhrResponse[as] = xhrResponse.response;
                                        delete xhrResponse.response;
                                        return xhrResponse;
                                    }
                                    : target[name];
                            }
                        })];
            }
        });
    });
}
function requestFor(method) {
    var _this = this;
    return proxymise_1.default(function (url, options, extra) {
        if (options === void 0) { options = {}; }
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                options.method = method;
                return [2, ajax(url, options, extra)];
            });
        });
    });
}
exports.requestFor = requestFor;
function abort(group) {
    var xhrGroup = xhrGroups[group];
    if (xhrGroup) {
        Object.keys(xhrGroup).forEach(function (id) {
            var request = xhrGroup[id];
            if (request) {
                request.abort();
            }
        });
        delete xhrGroups[group];
    }
}
var xhr = {
    get: requestFor('GET'),
    post: requestFor('POST'),
    put: requestFor('PUT'),
    delete: requestFor('DELETE'),
    head: requestFor('HEAD'),
    connect: requestFor('CONNECT'),
    options: requestFor('OPTIONS'),
    trace: requestFor('TRACE'),
    patch: requestFor('PATCH'),
    abort: abort,
    defaults: axios_1.default.defaults,
    before: before,
    after: after,
    ABORTED: ABORTED,
    TIMEOUT: TIMEOUT,
    UNREACHABLE: UNREACHABLE
};
Object.keys(xhr).forEach(function (key) {
    return Object.defineProperty(xhr, key, {
        value: xhr[key],
        writable: false,
        configurable: false,
        enumerable: true
    });
});
exports.default = xhr;
//# sourceMappingURL=xhr-async.js.map

if (typeof(window) === 'undefined') { xhr.defaults.headers.common['User-Agent'] = 'xhr-async/1.4.8' }
