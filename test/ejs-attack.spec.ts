import { expect, fail } from '@hapi/code';
import { compile } from 'ejs';
import 'mocha';
import {HapifyVM} from "@hapify/vm";

const run = (script: string, context: any) => {
	const template = compile(`<% ${script} %>`);
	console.log(template.toString())
	const contextKeys = Object.keys(context);
	const contextInjectedObject = `{${contextKeys.join(', ')}}`;
	const templateRunner = `
const template = compile(\`<% \${script} %>\`);
return template(${contextInjectedObject});
	`;
	return new HapifyVM().run(templateRunner, { ...context, script, compile });
};

describe('possible attacks', () => {
	it('process accesses', async () => {
		const script = 'process.exit();';
		expect(() => run(script, {})).to.throw('process is not defined');
	});
	it('require accesses 1', async () => {
		const script = 'require("http");';
		expect(() => run(script, {})).to.throw('require is not defined');
	});
	it('require accesses 2', async () => {
		const script = 'models.constructor.constructor("return process.mainModule.require")()("http")';
		expect(() => run(script, { models: {} })).to.throw('Code generation from strings disallowed for this context');
	});
	it('global values', async () => {
		const script = 'return JSON.stringify(Object.keys(global));';
		const result = JSON.parse(run(script, {}));
		expect(result).to.equal(['VMError', 'Buffer']);
	});
	it('process deep accesses', async () => {
		const script = 'models.constructor.constructor("return { process }")().exit()';
		expect(() => run(script, { models: {} })).to.throw('Code generation from strings disallowed for this context');
	});
	it('process deep accesses with this', async () => {
		const script = 'this.constructor.constructor("return { process }")().exit()';
		expect(() => run(script, {})).to.throw('Code generation from strings disallowed for this context');
	});

	it('alter console 1', async () => {
		const script = 'console = undefined; return "";';
		run(script, {});
		expect(console).to.not.be.undefined();
	});
	it('alter console 2', async () => {
		const script = 'console.log = function() { return "trojan" }; return "";';
		run(script, {});
		expect(console.log()).to.not.be.a.string();
	});

	it('return fake string', async () => {
		const script = 'return { toString: function() { /* Bad function */ } };';
		expect(() => run(script, {})).to.throw('Must return a string');
	});

	it('throw evil error 1', async () => {
		const script = 'throw { message: { toString: function() { /* Bad function */ } } };';
		expect(() => run(script, {})).to.throw('Invalid error');
	});
	it('throw evil error 2', async () => {
		const script = 'throw { stack: { toString: function() { /* Bad function */ } } };';
		try {
			run(script, {});
			fail('Should throw an error');
		} catch (e) {
			expect(e.name).to.equal('VmIntegrityError');
			expect(e.code).to.equal(6004);
			expect(e.message).to.equal('Invalid error');
		}
	});
});
