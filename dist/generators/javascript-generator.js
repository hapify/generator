"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavascriptGenerator = void 0;
const vm_1 = require("@hapify/vm");
const config_1 = require("../config");
const errors_1 = require("../errors");
class JavascriptGenerator {
    constructor() { }
    one(model, template) {
        return __awaiter(this, void 0, void 0, function* () {
            // Eval template content
            return this.eval(template.content, {
                model: model,
                m: model,
            });
        });
    }
    all(models, template) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create template function
            return this.eval(template.content, {
                models: models,
                m: models,
            });
        });
    }
    /** Run eval */
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