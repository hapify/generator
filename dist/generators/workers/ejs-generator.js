"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EJSGenerator = void 0;
const config_1 = require("../../config");
const ejs_1 = require("@hapify/ejs");
const base_generator_1 = require("./base-generator");
const HpfOptions = { timeout: config_1.Config.Generator.timeout };
class EJSGenerator extends base_generator_1.BaseGenerator {
    eval(content, context) {
        return new ejs_1.HapifyEJS(HpfOptions).run(content, context);
    }
}
exports.EJSGenerator = EJSGenerator;
//# sourceMappingURL=ejs-generator.js.map