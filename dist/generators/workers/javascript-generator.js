"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavascriptGenerator = void 0;
const vm_1 = require("@hapify/vm");
const config_1 = require("../../config");
const errors_1 = require("../../errors");
const base_generator_1 = require("./base-generator");
class JavascriptGenerator extends base_generator_1.BaseGenerator {
    eval(content, context) {
        try {
            return new vm_1.HapifyVM({ timeout: config_1.Config.Generator.timeout }).run(content, context);
        }
        catch (error) {
            if (error.code === 6003) {
                throw new errors_1.TimeoutError(`Template processing timed out (${config_1.Config.Generator.timeout}ms)`);
            }
            if (error.code === 6002) {
                // Clone error
                const evalError = new errors_1.EvaluationError(error.message);
                evalError.details = `Error: ${evalError.message}. Line: ${error.lineNumber}, Column: ${error.columnNumber}`;
                evalError.lineNumber = error.lineNumber;
                evalError.columnNumber = error.columnNumber;
                throw evalError;
            }
            throw error;
        }
    }
}
exports.JavascriptGenerator = JavascriptGenerator;
//# sourceMappingURL=javascript-generator.js.map