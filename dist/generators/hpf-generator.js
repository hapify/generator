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
const hapify_syntax_1 = require("hapify-syntax");
const config_1 = require("../config");
const HpfOptions = { timeout: config_1.Config.Generator.timeout };
class HpfGenerator {
    constructor() { }
    one(model, template) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create template function
            const cleanedContent = yield this._preProcess(template.content);
            const content = hapify_syntax_1.HapifySyntax.run(cleanedContent, model, HpfOptions);
            return yield this._postProcess(content);
        });
    }
    all(models, template) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create template function
            const cleanedContent = yield this._preProcess(template.content);
            const content = hapify_syntax_1.HapifySyntax.run(cleanedContent, models, HpfOptions);
            return yield this._postProcess(content);
        });
    }
    /**
     * Cleanup code before process
     */
    _preProcess(template) {
        return __awaiter(this, void 0, void 0, function* () {
            const indentConditions = /^ +<<(\?|@|#)([\s\S]*?)>>/gm;
            return template.replace(indentConditions, '<<$1$2>>');
        });
    }
    /**
     * Cleanup code after process
     */
    _postProcess(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const doubleLine = /\r?\n\r?\n/g;
            while (code.match(doubleLine)) {
                code = code.replace(doubleLine, '\n');
            }
            const doubleLineWithSpace = /\r?\n *\r?\n/g;
            code = code.replace(doubleLineWithSpace, '\n\n');
            code = code.replace(doubleLineWithSpace, '\n\n');
            return code;
        });
    }
}
exports.HpfGenerator = HpfGenerator;
//# sourceMappingURL=hpf-generator.js.map