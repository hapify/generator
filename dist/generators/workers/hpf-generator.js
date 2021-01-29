"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HpfGenerator = void 0;
const syntax_1 = require("@hapify/syntax");
const config_1 = require("../../config");
const base_generator_1 = require("./base-generator");
const HpfOptions = { timeout: config_1.Config.Generator.timeout };
class HpfGenerator extends base_generator_1.BaseGenerator {
    eval(content, context) {
        return syntax_1.HapifySyntax.run(content, context.m, HpfOptions);
    }
}
exports.HpfGenerator = HpfGenerator;
//# sourceMappingURL=hpf-generator.js.map