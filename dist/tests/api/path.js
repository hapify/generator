"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("code");
const Lab = __importStar(require("lab"));
const lab = (exports.lab = Lab.script());
const Api = __importStar(require("../inc/api"));
lab.test('convert path with name', () => __awaiter(this, void 0, void 0, function* () {
    const response = yield Api.post('/path', {
        path: '/this/is/a/{model.hyphen}/test',
        name: 'You video'
    });
    code_1.expect(response.statusCode).to.equal(200);
    code_1.expect(response.body.result).to.equal('/this/is/a/you-video/test');
}));
//# sourceMappingURL=path.js.map