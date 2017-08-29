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
/**
 * Inject an interceptor before a request is being made.
 * @param interceptor interceptor.
 */
var xhrBefore = function (interceptor) {
    axios_1.default.interceptors.request.use(function (config) {
        var _a = config.url, url = _a === void 0 ? '' : _a, params = config.params, headers = config.headers, data = config.data;
        interceptor({ url: url, params: params, headers: headers, data: data });
        return config;
    }, function (error) { return Promise.reject(error); });
};
/**
 * Inject an interceptor after a response is returned.
 * @param interceptor interceptor.
 */
var xhrAfter = function (interceptor) {
    axios_1.default.interceptors.response.use(function (response) {
        var status = response.status, statusText = response.statusText, responseHeaders = response.headers, responseData = response.data, config = response.config;
        var url = config.url, params = config.params, headers = config.headers, data = config.data;
        interceptor({
            status: status,
            statusText: statusText,
            data: responseData,
            headers: responseHeaders,
            request: { url: url, params: params, data: data, headers: headers }
        });
        return response;
    }, function (error) { return Promise.reject(error); });
};
//
// Intercept axios request to inject cancel token and set/unset xhr.
//
axios_1.default.interceptors.request.use(function (config) {
    var xhr = config.xhr;
    if (xhr) {
        config.cancelToken = new axios_1.default.CancelToken(function (cancel) {
            // call xhr so caller has a change to save the xhr object with abort() capability
            xhr({
                abort: function () {
                    cancel('TERMINATED BY USER'); // TODO: Make it somehow cancel return request object and can be captured by APIs
                    xhr(undefined); // unset xhr
                }
            });
        });
    }
    return config;
}, function (error) { return Promise.reject(error); });
//
// Intercept axios response to unset xhr.
//
axios_1.default.interceptors.response.use(function (response) {
    var xhr = response.config.xhr;
    // call xhr() to pass undefined so caller has a chance to set its xhr to undefined
    if (xhr) {
        xhr(undefined);
    }
    return response;
}, function (error) { return Promise.reject(error); });
function get(url, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, status, statusText, responseHeaders, responseData, config, url_1, params, data, headers, error_1, response, statusText, status, responseData, xhr_1, config, _b, _c, params, _d, data, _e, headers;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    options.url = url;
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default(options)];
                case 2:
                    _a = _f.sent(), status = _a.status, statusText = _a.statusText, responseHeaders = _a.headers, responseData = _a.data, config = _a.config;
                    url_1 = config.url, params = config.params, data = config.data, headers = config.headers;
                    return [2 /*return*/, {
                            status: status,
                            statusText: statusText,
                            data: responseData,
                            headers: responseHeaders,
                            request: { url: url_1, params: params, data: data, headers: headers }
                        }];
                case 3:
                    error_1 = _f.sent();
                    response = error_1.response;
                    statusText = (response && response.statusText) || error_1.toString();
                    status = (response && response.status) || 0;
                    responseData = response && response.data;
                    xhr_1 = options.xhr;
                    config = (response && response.config) || error_1.config;
                    _b = config || {}, _c = _b.params, params = _c === void 0 ? undefined : _c, _d = _b.data, data = _d === void 0 ? undefined : _d, _e = _b.headers, headers = _e === void 0 ? {} : _e;
                    // TODO abort() does not give any object back, the request object becomes useless
                    if (xhr_1) {
                        xhr_1(undefined); // unset xhr
                    }
                    return [2 /*return*/, {
                            status: status,
                            statusText: statusText,
                            error: error_1,
                            data: responseData,
                            request: { url: url, params: params, data: data, headers: headers }
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function requestFor(method) {
    return function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                options.method = method;
                return [2 /*return*/, get(url, options)];
            });
        });
    };
}
exports.requestFor = requestFor;
var xhr = {
    get: get,
    post: requestFor('POST'),
    put: requestFor('PUT'),
    delete: requestFor('DELETE'),
    head: requestFor('HEAD'),
    connect: requestFor('CONNECT'),
    options: requestFor('OPTIONS'),
    trace: requestFor('TRACE'),
    patch: requestFor('PATCH'),
    // @see https://github.com/mzabriskie/axios#global-axios-defaults
    defaults: axios_1.default.defaults,
    before: xhrBefore,
    after: xhrAfter
};
exports.default = xhr;
//# sourceMappingURL=xhr-async.js.map