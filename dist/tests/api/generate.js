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
const Fs = __importStar(require("fs"));
const path = (file) => {
    return `${process.cwd()}/tests/api/files/${file}`;
};
const get = (file) => {
    return Fs.readFileSync(path(file), { encoding: 'utf8' });
};
const models = JSON.parse(get('models.json'));
const templates = [
    {
        name: 'Routes - Create',
        path: 'src/routes/{model.hyphen}/create.js',
        engine: 'hpf',
        input: 'one',
        content: get('templates/model/create.js.hpf')
    },
    {
        name: 'Routes - Index All',
        path: 'src/routes/index.js',
        engine: 'hpf',
        input: 'all',
        content: get('templates/index.js.hpf')
    }
];
lab.test('generate files', () => __awaiter(this, void 0, void 0, function* () {
    const response = yield Api.post('/generate', {
        templates: templates,
        models: models
    });
    code_1.expect(response.statusCode).to.equal(200);
    code_1.expect(response.body).to.be.an.array();
    // Test length
    code_1.expect(response.body.length).to.equal(models.length + 1);
    // Test all returned files
    for (const output of response.body) {
        code_1.expect(output.path).to.be.a.string();
        code_1.expect(output.content).to.be.a.string();
    }
    // Test index file
    const indexFile = response.body.find((f) => f.path === 'src/routes/index.js');
    code_1.expect(indexFile).to.exists();
    code_1.expect(indexFile.content).to.equal(get('output/index.js'));
    // Test user create
    const userFile = response.body.find((f) => f.path === 'src/routes/user/create.js');
    code_1.expect(userFile).to.exists();
    code_1.expect(userFile.content).to.equal(get('output/user/create.js'));
    // Test bookmark create
    const bookmarkFile = response.body.find((f) => f.path === 'src/routes/bookmark/create.js');
    code_1.expect(bookmarkFile).to.exists();
    code_1.expect(bookmarkFile.content).to.equal(get('output/bookmark/create.js'));
}));
lab.test('generate one file for one model', () => __awaiter(this, void 0, void 0, function* () {
    const response = yield Api.post('/generate', {
        templates: [templates[0]],
        models: models,
        ids: ['0cf80d75-abcd-f8c7-41f6-ed41c6425aa1']
    });
    code_1.expect(response.statusCode).to.equal(200);
    code_1.expect(response.body).to.be.an.array();
    // Test length
    code_1.expect(response.body.length).to.equal(1);
    // Test bookmark create
    code_1.expect(response.body[0].path).to.be.a.string();
    code_1.expect(response.body[0].content).to.be.a.string();
    code_1.expect(response.body[0].content).to.equal(get('output/bookmark/create.js'));
}));
lab.test('generate without models', () => __awaiter(this, void 0, void 0, function* () {
    const response = yield Api.post('/generate', {
        templates: templates
    });
    code_1.expect(response.statusCode).to.equal(400);
    code_1.expect(response.body.error).to.equal('Bad Request');
    code_1.expect(response.body.message).to.be.a.string();
    code_1.expect(response.body.statusCode).to.equal(400);
}));
lab.test('generate with malformed models', () => __awaiter(this, void 0, void 0, function* () {
    const response = yield Api.post('/generate', {
        templates: templates,
        models: models.map(m => {
            const clone = Object.assign({}, m);
            delete clone.accesses;
            return clone;
        })
    });
    code_1.expect(response.statusCode).to.equal(400);
    code_1.expect(response.body.error).to.equal('Bad Request');
    code_1.expect(response.body.message).to.be.a.string();
    code_1.expect(response.body.statusCode).to.equal(400);
}));
lab.test('generate with broken template', () => __awaiter(this, void 0, void 0, function* () {
    const response = yield Api.post('/generate', {
        templates: [Object.assign({}, templates[0], { content: get('templates/error.js.hpf') })],
        models: models
    });
    code_1.expect(response.statusCode).to.equal(422);
    code_1.expect(response.body.error).to.equal('Unprocessable Entity');
    code_1.expect(response.body.message).to.be.a.string();
    code_1.expect(response.body.statusCode).to.equal(422);
}));
//# sourceMappingURL=generate.js.map