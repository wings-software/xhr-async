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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var xhr_async_1 = require("./xhr-async");
var ava_1 = require("ava");
var sleep = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var includes = function (obj1, obj2) {
    return !!(!obj2 || (obj1 && !Object.keys(obj2).some(function (key) { return !obj1[key]; })));
};
ava_1.default('defaults should exist', function (t) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        t.truthy(xhr_async_1.default.defaults);
        return [2];
    });
}); });
ava_1.default('should not raise exception when server is not found', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, response, status, error, statusText, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4, xhr_async_1.default.get('https://notavalidurl.com1/')];
            case 1:
                _a = _b.sent(), response = _a.response, status = _a.status, error = _a.error, statusText = _a.statusText;
                t.is(status, 0);
                return [3, 3];
            case 2:
                error_1 = _b.sent();
                t.fail('request should not raise exception, ever.');
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
ava_1.default('status code should be legit', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var code, _a, response, status, error, statusText;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                code = 418;
                return [4, xhr_async_1.default.get('https://httpbin.org/status/' + code)];
            case 1:
                _a = _b.sent(), response = _a.response, status = _a.status, error = _a.error, statusText = _a.statusText;
                t.is(status, code);
                return [2];
        }
    });
}); });
ava_1.default('baseURL should work', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, xhr_async_1.default.get('https://httpbin.org/ip')];
            case 1:
                status = (_a.sent()).status;
                t.is(status, 200);
                return [2];
        }
    });
}); });
ava_1.default('as should replace response', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, status, ip, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, xhr_async_1.default.get('https://httpbin.org/ip').as('ip')];
            case 1:
                _a = _b.sent(), status = _a.status, ip = _a.ip, response = _a.response;
                t.is(status, 200);
                t.truthy(ip);
                t.falsy(response);
                t.truthy(ip.origin);
                return [2];
        }
    });
}); });
ava_1.default('status code 200', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, response, status;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, xhr_async_1.default.get('https://httpbin.org')];
            case 1:
                _a = _b.sent(), response = _a.response, status = _a.status;
                t.is(status, 200);
                return [2];
        }
    });
}); });
ava_1.default('should set header correctly with before()', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var bearer, _a, response, status, request;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                bearer = 'Bearer 1234';
                xhr_async_1.default.before(function (_a) {
                    var _b = _a.headers, headers = _b === void 0 ? {} : _b;
                    headers.Authorization = bearer;
                });
                return [4, xhr_async_1.default.get('https://httpbin.org/headers')];
            case 1:
                _a = _b.sent(), response = _a.response, status = _a.status, request = _a.request;
                t.is(status, 200);
                t.is(response.headers.Authorization, bearer);
                if (request && request.headers) {
                    t.is(request.headers.Authorization, bearer);
                }
                else {
                    t.fail('request.headers must be set and returned properly');
                }
                return [2];
        }
    });
}); });
ava_1.default('should set request object properly', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var request, _a, response, status;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, xhr_async_1.default.get('https://httpbin.org/', {
                    ref: function (req) { return request = req; }
                })];
            case 1:
                _a = _b.sent(), response = _a.response, status = _a.status;
                t.is(status, 200);
                t.is(request, undefined);
                return [2];
        }
    });
}); });
ava_1.default('post should work properly', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var data, _a, response, status;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = { a: 1, b: 2 };
                return [4, xhr_async_1.default.post('https://httpbin.org/post', { data: data })];
            case 1:
                _a = _b.sent(), response = _a.response, status = _a.status;
                t.is(status, 200);
                t.deepEqual(response.json, data);
                return [2];
        }
    });
}); });
ava_1.default.skip('patch should work properly', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var data, _a, response, status;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = { a: 1, b: 2 };
                return [4, xhr_async_1.default.post('https://httpbin.org/patch', { data: data })];
            case 1:
                _a = _b.sent(), response = _a.response, status = _a.status;
                t.is(status, 200);
                t.deepEqual(response.json, data);
                return [2];
        }
    });
}); });
ava_1.default.skip('put should work properly', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var data, _a, response, status;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = { a: 1, b: 2 };
                return [4, xhr_async_1.default.post('https://httpbin.org/put', { data: data })];
            case 1:
                _a = _b.sent(), response = _a.response, status = _a.status;
                t.is(status, 200);
                t.deepEqual(response.json, data);
                return [2];
        }
    });
}); });
ava_1.default.skip('delete should work properly', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var data, _a, response, status;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = { a: 1, b: 2 };
                return [4, xhr_async_1.default.post('https://httpbin.org/delete', { data: data })];
            case 1:
                _a = _b.sent(), response = _a.response, status = _a.status;
                t.is(status, 200);
                t.deepEqual(response.json, data);
                return [2];
        }
    });
}); });
ava_1.default('ref should not be null during the request', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var rootRequest, response, status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                response = xhr_async_1.default.get('https://httpbin.org/delay/2', {
                    ref: function (req) { return rootRequest = req; }
                });
                return [4, sleep(1)];
            case 1:
                _a.sent();
                t.truthy(rootRequest);
                return [4, response];
            case 2:
                status = (_a.sent()).status;
                t.is(status, 200);
                t.is(rootRequest, undefined);
                return [2];
        }
    });
}); });
ava_1.default('ref.abort() should work', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var rootReq, url, headers, data, params, xhrResponse, _a, status, _b, _url, _params, _data, _headers, request;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                url = 'https://httpbin.org/delay/2';
                headers = { foo: 'bar', hello: 'world' };
                data = [1, 2, 3, 4];
                params = { a: 1, b: 2, c: 3 };
                xhrResponse = xhr_async_1.default.get(url, {
                    headers: headers,
                    params: params,
                    data: data,
                    ref: function (req) { return rootReq = req; }
                });
                return [4, sleep(1)];
            case 1:
                _c.sent();
                t.truthy(rootReq);
                if (rootReq) {
                    rootReq.abort();
                }
                return [4, xhrResponse];
            case 2:
                _a = _c.sent(), status = _a.status, _b = _a.request, _url = _b.url, _params = _b.params, _data = _b.data, _headers = _b.headers, request = _a.request;
                t.is(status, xhr_async_1.default.ABORTED);
                t.is(rootReq, undefined);
                t.deepEqual(url, _url);
                t.deepEqual(params, _params);
                t.deepEqual(data, JSON.parse(_data));
                if (!includes(_headers, headers)) {
                    t.fail('Request headers are not valid');
                }
                return [2];
        }
    });
}); });
ava_1.default('should unset ref when an exception happens', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var rootReq, status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, xhr_async_1.default.get('https://notavalidurl.com1/', {
                    ref: function (req) { return rootReq = req; }
                })];
            case 1:
                status = (_a.sent()).status;
                t.is(status, xhr_async_1.default.UNREACHABLE);
                t.is(rootReq, undefined);
                return [2];
        }
    });
}); });
ava_1.default('xhr.group should work', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var group, request, response, status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                group = 'httpbin';
                response = xhr_async_1.default.get('https://httpbin.org/delay/2', {
                    group: group,
                    ref: function (req) { return request = req; }
                });
                return [4, sleep(1)];
            case 1:
                _a.sent();
                t.truthy(request);
                xhr_async_1.default.abort(group);
                return [4, response];
            case 2:
                status = (_a.sent()).status;
                t.is(status, xhr_async_1.default.ABORTED);
                t.is(request, undefined);
                return [2];
        }
    });
}); });
ava_1.default('xhr.retry should work with with abort()', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var request, res, _a, status, response, headers;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                res = xhr_async_1.default.get('https://httpbin.org/delay/2', {
                    retry: 1,
                    ref: function (req) { return request = req; }
                });
                return [4, sleep(1)];
            case 1:
                _b.sent();
                if (request) {
                    request.abort();
                }
                return [4, res];
            case 2:
                _a = _b.sent(), status = _a.status, response = _a.response, headers = _a.headers;
                t.is(status, 200);
                t.truthy(response);
                t.truthy(headers);
                return [2];
        }
    });
}); });
ava_1.default('status should be TIMEOUT when timeout happens', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, xhr_async_1.default.get('https://httpbin.org/delay/2', {
                    timeout: 100
                })];
            case 1:
                status = (_a.sent()).status;
                t.is(status, xhr_async_1.default.TIMEOUT);
                return [2];
        }
    });
}); });
ava_1.default('group should be cleaned when request is done', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var group, status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                group = 'httpbin1';
                return [4, xhr_async_1.default.get('https://httpbin.org/delay/1', {
                        group: group
                    })];
            case 1:
                status = (_a.sent()).status;
                t.is(status, 200);
                return [2];
        }
    });
}); });
ava_1.default('abort with ignoreRetry should kill all retries', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var count, request, retryAfter, response, status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                count = 0;
                retryAfter = function (_a) {
                    var counter = _a.counter, lastStatus = _a.lastStatus;
                    count = counter;
                    return counter < 2 ? counter * 10000 : -1;
                };
                response = xhr_async_1.default.get('https://httpbin.org/status/401', {
                    retry: retryAfter,
                    ref: function (req) { return request = req; }
                });
                return [4, sleep(5000)];
            case 1:
                _a.sent();
                if (request) {
                    request.abort({ ignoreRetry: true });
                }
                return [4, response];
            case 2:
                status = (_a.sent()).status;
                t.is(status, xhr_async_1.default.ABORTED);
                t.is(count, 1);
                t.falsy(retryAfter.counter);
                t.falsy(retryAfter.timeoutId);
                return [2];
        }
    });
}); });
ava_1.default('xhr.retry with delay strategy', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var count, retryAfter, status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                count = 0;
                retryAfter = function (_a) {
                    var counter = _a.counter, lastStatus = _a.lastStatus;
                    count = counter;
                    return counter < 2 ? 100 * counter : -1;
                };
                return [4, xhr_async_1.default.get('https://httpbin.org/status/401', {
                        retry: retryAfter
                    })];
            case 1:
                status = (_a.sent()).status;
                t.is(status, 401);
                t.is(count, 2);
                t.falsy(retryAfter.counter);
                t.falsy(retryAfter.timeoutId);
                return [2];
        }
    });
}); });
ava_1.default('retryImmediately should override delay strategy', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var count, request, WAIT_TIME, now, retryAfter, response, status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                count = 0;
                WAIT_TIME = 10000;
                now = +new Date();
                retryAfter = function (_a) {
                    var counter = _a.counter, lastStatus = _a.lastStatus;
                    count = counter;
                    return counter === 1 ? WAIT_TIME : (counter <= 4 ? counter * 10 : -1);
                };
                response = xhr_async_1.default.get('https://httpbin.org/status/401', {
                    retry: retryAfter,
                    ref: function (req) { return request = req; }
                });
                return [4, sleep(5000)];
            case 1:
                _a.sent();
                if (request) {
                    request.retryImmediately();
                }
                return [4, response];
            case 2:
                status = (_a.sent()).status;
                t.is(status, 401);
                t.is(count, 5);
                t.true(+new Date() - now < WAIT_TIME);
                t.falsy(retryAfter.counter);
                t.falsy(retryAfter.timeoutId);
                t.falsy(retryAfter.retry);
                return [2];
        }
    });
}); });
ava_1.default('xhr properties should be immutable', function (t) {
    var x = xhr_async_1.default;
    t.throws(function () {
        x.get = null;
        x.post = null;
    });
    t.truthy(x.get);
    t.truthy(x.post);
});
ava_1.default('before should be called before a request is made', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var url, data, params, headers, requestTime, beforeTime, xhrRequest;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = 'https://httpbin.org/anything/before-anything-' + (+new Date());
                data = { a: 1, b: 2 };
                params = { abc: 1, def: 2 };
                headers = { 'x-auth': true };
                xhr_async_1.default.before(function (_a) {
                    var _url = _a.url, _params = _a.params, _headers = _a.headers, _data = _a.data;
                    if (_url === url) {
                        beforeTime = +new Date();
                        xhrRequest = { url: _url, params: _params, headers: _headers, data: _data };
                    }
                }, { replaceAll: true });
                return [4, xhr_async_1.default.post(url, {
                        params: params,
                        headers: headers,
                        data: data,
                        ref: function (req) {
                            requestTime = +new Date();
                        }
                    })];
            case 1:
                _a.sent();
                t.true(beforeTime && requestTime && beforeTime <= requestTime);
                t.is(xhrRequest && xhrRequest.url, url);
                t.is(xhrRequest && xhrRequest.params, params);
                t.is(xhrRequest && xhrRequest.headers, headers);
                t.is(xhrRequest && xhrRequest.data, data);
                return [2];
        }
    });
}); });
ava_1.default('after should be called after a response is returned', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var data, requestTime, afterTime, xhrRequest, _a, response, status;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = { a: 1, b: 2 };
                xhr_async_1.default.after(function (_a) {
                    var _status = _a.status, statusText = _a.statusText, headers = _a.headers, _body = _a.response, error = _a.error, request = _a.request;
                    afterTime = +new Date();
                    xhrRequest = request;
                });
                return [4, xhr_async_1.default.post('https://httpbin.org/post', {
                        data: data,
                        ref: function (req) {
                            requestTime = +new Date();
                        }
                    })];
            case 1:
                _a = _b.sent(), response = _a.response, status = _a.status;
                t.is(status, 200);
                t.true(afterTime && requestTime && afterTime >= requestTime);
                return [2];
        }
    });
}); });
ava_1.default('after should be called after a failure', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var data, bodyStr, url, params, headers, xhrResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = { a: 1, b: 2 };
                bodyStr = JSON.stringify(data);
                url = 'https://httpbin.org/status/401';
                params = { name: 'J', age: 10 };
                headers = { Authorization: 'Bearer 123' };
                xhr_async_1.default.after(function (_xhrResponse) { return xhrResponse = _xhrResponse; });
                return [4, xhr_async_1.default.post(url, {
                        headers: headers,
                        params: params,
                        data: data
                    })];
            case 1:
                _a.sent();
                t.truthy(xhrResponse);
                t.is(xhrResponse && xhrResponse.status, 401);
                t.truthy(xhrResponse && xhrResponse.statusText);
                t.truthy(xhrResponse && xhrResponse.headers);
                t.truthy(xhrResponse && xhrResponse.error);
                t.truthy(xhrResponse && xhrResponse.request);
                t.deepEqual(xhrResponse && xhrResponse.request.data, bodyStr);
                t.is(xhrResponse && xhrResponse.request.url, url);
                t.true(includes(xhrResponse && xhrResponse.request.headers, headers));
                t.is(xhrResponse && xhrResponse.request.params, params);
                t.is(xhrResponse && xhrResponse.request.data, bodyStr);
                return [2];
        }
    });
}); });
ava_1.default.after('cleanup', function (t) {
});
//# sourceMappingURL=xhr-async.spec.js.map