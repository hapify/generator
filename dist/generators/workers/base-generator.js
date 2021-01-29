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
exports.BaseGenerator = void 0;
class BaseGenerator {
    one(model, template) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.eval(template.content, {
                    model: model,
                    m: model,
                });
            }
            catch (error) {
                throw this.appendFileName(error, template);
            }
        });
    }
    all(models, template) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.eval(template.content, {
                    models: models,
                    m: models,
                });
            }
            catch (error) {
                throw this.appendFileName(error, template);
            }
        });
    }
    /** Append file name to error details if applicable */
    appendFileName(error, template) {
        if (typeof error.lineNumber !== 'undefined') {
            // Append file name
            error.details += `\nFile: ${template.path}`;
        }
        return error;
    }
}
exports.BaseGenerator = BaseGenerator;
//# sourceMappingURL=base-generator.js.map