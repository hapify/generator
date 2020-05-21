import requestPromise from 'request-promise-native';
import { Config } from './config';

interface ApiResponse {
	statusCode: number;
	body: any;
	headers: any;
}

/**
 * Errors 5xx counter
 *
 * @type {number}
 */
let _errors500 = 0;

/**
 * Create the cookie jar
 */
let _jar = requestPromise.jar();

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
const call = async (
	method: string,
	path: string,
	payload: object = null,
	query: object = null,
	headers: object = null,
	json: boolean = true
): Promise<ApiResponse> => {
	const base = Config.apiUrl;

	const request: any = {
		uri: `${base}${path}`,
		method: method.toUpperCase(),
		json,
		resolveWithFullResponse: true,
		jar: _jar,
		qsStringifyOptions: { arrayFormat: 'repeat' },
	};

	if (payload) {
		request.body = payload;
	}
	if (query) request.qs = query;
	if (headers) request.headers = headers;

	const response = await requestPromise(request)
		.promise()
		.catch((error: any) => error.response);

	if (response.statusCode >= 500 && response.statusCode < 600) {
		_errors500++;
	}

	return {
		statusCode: response.statusCode,
		body: response.body,
		headers: response.headers,
	};
};
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
	get: (path: string, query: object = null, headers: object = null, json: boolean = true): Promise<ApiResponse> =>
		call('get', path, null, query, headers, json),

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
	post: (path: string, payload: object = null, query: object = null, headers: object = null, json: boolean = true): Promise<ApiResponse> =>
		call('post', path, payload, query, headers, json),

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
	patch: (path: string, payload: object = null, query: object = null, headers: object = null, json: boolean = true): Promise<ApiResponse> =>
		call('patch', path, payload, query, headers, json),

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
	put: (path: string, payload: object = null, query: object = null, headers: object = null, json: boolean = true): Promise<ApiResponse> =>
		call('put', path, payload, query, headers, json),

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
	delete: (path: string, payload: object = null, query: object = null, headers: object = null, json: boolean = true): Promise<ApiResponse> =>
		call('delete', path, payload, query, headers, json),

	/**
	 * Flush the cookies
	 */
	flushCookies: () => {
		_jar = requestPromise.jar();
	},

	/**
	 * Count 5xx errors returned by the server
	 *
	 * @return {number}
	 */
	countErrors500: (): number => _errors500,
};

export = Api;
