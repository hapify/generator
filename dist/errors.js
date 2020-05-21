"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = exports.EvaluationError = exports.InternalError = void 0;
class InternalError extends Error {
    constructor() {
        super(...arguments);
        this.code = 2001;
        this.name = 'GeneratorInternalError';
    }
}
exports.InternalError = InternalError;
class EvaluationError extends Error {
    constructor() {
        super(...arguments);
        this.code = 2004;
        this.name = 'GeneratorEvaluationError';
        this.lineNumber = null;
        this.columnNumber = null;
        this.details = null;
    }
}
exports.EvaluationError = EvaluationError;
class TimeoutError extends Error {
    constructor() {
        super(...arguments);
        this.code = 2005;
        this.name = 'GeneratorTimeoutError';
    }
}
exports.TimeoutError = TimeoutError;
//# sourceMappingURL=errors.js.map