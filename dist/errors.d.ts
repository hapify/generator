import { NumberedError } from './interfaces';
export declare class InternalError extends Error implements NumberedError {
    code: number;
    name: string;
}
export declare class EvaluationError extends Error implements NumberedError {
    code: number;
    name: string;
    lineNumber: number;
    columnNumber: number;
    details: string;
}
export declare class TimeoutError extends Error implements NumberedError {
    code: number;
    name: string;
}
