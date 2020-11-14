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
exports.HpfGenerator = void 0;
const syntax_1 = require("@hapify/syntax");
const config_1 = require("../config");
const HpfOptions = { timeout: config_1.Config.Generator.timeout };
class HpfGenerator {
    constructor() { }
    one(model, template) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return syntax_1.HapifySyntax.run(template.content, model, HpfOptions);
            }
            catch (error) {
                throw this.appendFileName(error, template);
            }
        });
    }
    all(models, template) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return syntax_1.HapifySyntax.run(template.content, models, HpfOptions);
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
            error.details += `, File: ${template.path}`;
        }
        return error;
    }
}
exports.HpfGenerator = HpfGenerator;
//# sourceMappingURL=hpf-generator.js.map