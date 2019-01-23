
export class InternalError extends Error {
	code = 2001;
	name = 'GeneratorInternalError';
}
export class RequestError extends Error {
	code = 2002;
	name = 'GeneratorRequestError';
}
export class EvaluationError extends Error {
	code = 2003;
	name = 'GeneratorEvaluationError';
	lineNumber: number = null;
	columnNumber: number = null;
}
export class TimeoutError extends Error {
	code = 2004;
	name = 'GeneratorTimeoutError';
}
