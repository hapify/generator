
export class InternalError extends Error {
	code = 2001;
	name = 'GeneratorInternalError';
}
export class RequestError extends Error {
	code = 2002;
	name = 'GeneratorRequestError';
}
export class RouteError extends Error {
	code = 2003;
	name = 'GeneratorRouteError';
}
export class EvaluationError extends Error {
	code = 2004;
	name = 'GeneratorEvaluationError';
	lineNumber: number = null;
	columnNumber: number = null;
	details: string = null;
}
export class TimeoutError extends Error {
	code = 2005;
	name = 'GeneratorTimeoutError';
}
