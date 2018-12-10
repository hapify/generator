"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const config_1 = require("./config");
/**
 * Errors 5xx counter
 *
 * @type {number}
 */
let _errors500 = 0;
/**
 * Create the cookie jar
 */
let _jar = request_promise_native_1.default.jar();
/**
 * Call the API
 *
 * @param {string} method
 * @param {string} path
 * @param {object|null} payload
 * @param {object|null} query
 * @param {object|null} headers
 * @param {boolean} json
 * @return {Promise<ApiResponse>}
 */
const call = (method, path, payload = null, query = null, headers = null, json = true) => __awaiter(this, void 0, void 0, function* () {
    const base = config_1.Config.apiUrl;
    const request = {
        uri: `${base}${path}`,
        method: method.toUpperCase(),
        json,
        resolveWithFullResponse: true,
        jar: _jar,
        qsStringifyOptions: { arrayFormat: 'repeat' }
    };
    if (payload) {
        request.body = payload;
    }
    if (query)
        request.qs = query;
    if (headers)
        request.headers = headers;
    const response = yield request_promise_native_1.default(request)
        .promise()
        .catch((error) => error.response);
    if (response.statusCode >= 500 && response.statusCode < 600) {
        _errors500++;
    }
    return {
        statusCode: response.statusCode,
        body: response.body,
        headers: response.headers
    };
});
/**
 * @typedef {{
 *  get: (function(string, (Object|null)=, (Object|null)=, boolean): Promise<ApiResponse>),
 *  post: (function(string, (Object|null)=, (Object|null)=, (Object|null)=, boolean): Promise<ApiResponse>),
 *  patch: (function(string, (Object|null)=, (Object|null)=, (Object|null)=, boolean): Promise<ApiResponse>),
 *  put: (function(string, (Object|null)=, (Object|null)=, (Object|null)=, boolean): Promise<ApiResponse>),
 *  delete: (function(string, (Object|null)=, (Object|null)=, (Object|null)=, boolean): Promise<ApiResponse>),
 *  flushCookies: (function()),
 *  countErrors500: (function(): number)
 * }} Api
 */
const Api = {
    /**
     * Get a resource from API
     *
     * @param path
     * @param query
     * @param headers
     * @param {boolean} json
     * @return {Promise.<ApiResponse>}
     */
    get: (path, query = null, headers = null, json = true) => call('get', path, null, query, headers, json),
    /**
     * Post a resource to API
     *
     * @param {string} path
     * @param {object|null} payload
     * @param {object|null} query
     * @param {object|null} headers
     * @param {boolean} json
     * @return {Promise.<ApiResponse>}
     */
    post: (path, payload = null, query = null, headers = null, json = true) => call('post', path, payload, query, headers, json),
    /**
     * Patch a resource to API
     *
     * @param {string} path
     * @param {object|null} payload
     * @param {object|null} query
     * @param {object|null} headers
     * @param {boolean} json
     * @return {Promise.<ApiResponse>}
     */
    patch: (path, payload = null, query = null, headers = null, json = true) => call('patch', path, payload, query, headers, json),
    /**
     * Put a resource to API
     *
     * @param {string} path
     * @param {object|null} payload
     * @param {object|null} query
     * @param {object|null} headers
     * @param {boolean} json
     * @return {Promise.<ApiResponse>}
     */
    put: (path, payload = null, query = null, headers = null, json = true) => call('put', path, payload, query, headers, json),
    /**
     * Delete a resource from API
     *
     * @param {string} path
     * @param {object|null} payload
     * @param {object|null} query
     * @param {object|null} headers
     * @param {boolean} json
     * @return {Promise.<ApiResponse>}
     */
    delete: (path, payload = null, query = null, headers = null, json = true) => call('delete', path, payload, query, headers, json),
    /**
     * Flush the cookies
     */
    flushCookies: () => {
        _jar = request_promise_native_1.default.jar();
    },
    /**
     * Count 5xx errors returned by the server
     *
     * @return {number}
     */
    countErrors500: () => _errors500
};
module.exports = Api;
//# sourceMappingURL=api.js.map