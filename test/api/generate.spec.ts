import { expect } from '@hapi/code';
import 'mocha';
import * as Fs from 'fs';
import { Generator, TimeoutError } from '../../src';

const path = (file: string): string => {
	return `${process.cwd()}/test/api/files/${file}`;
};
const get = (file: string): string => {
	return Fs.readFileSync(path(file), { encoding: 'utf8' });
};

const models: any[] = JSON.parse(get('models.json'));
const templates: any[] = [
	{
		path: 'src/routes/{kebab}/create.js',
		engine: 'hpf',
		input: 'one',
		content: get('templates/model/create.js.hpf'),
	},
	{
		path: 'src/routes/index.js',
		engine: 'hpf',
		input: 'all',
		content: get('templates/index.js.hpf'),
	},
	{
		path: 'src/list.json',
		engine: 'js',
		input: 'all',
		content: get('templates/list.json.js'),
	},
];

describe('generate', () => {
	it('generate files', async () => {
		const response = await Generator.run(templates, models);
		expect(response).to.be.an.array();

		// Test length
		expect(response.length).to.equal(models.length + 2);

		// Test all returned files
		for (const output of response) {
			expect(output.path).to.be.a.string();
			expect(output.content).to.be.a.string();
		}

		// Test index file
		const indexFile = response.find((f: any) => f.path === 'src/routes/index.js');
		expect(indexFile).to.exists();
		expect(indexFile.content).to.equal(get('output/index.js'));

		// Test user create
		const userFile = response.find((f: any) => f.path === 'src/routes/user/create.js');
		expect(userFile).to.exists();
		expect(userFile.content).to.equal(get('output/user/create.js'));

		// Test bookmark create
		const bookmarkFile = response.find((f: any) => f.path === 'src/routes/bookmark/create.js');
		expect(bookmarkFile).to.exists();
		expect(bookmarkFile.content).to.equal(get('output/bookmark/create.js'));

		// Test model list
		const listFile = response.find((f: any) => f.path === 'src/list.json');
		expect(listFile).to.exists();
		expect(listFile.content).to.equal(get('output/list.json').trim());
	}).slow(1000);

	it('generate one file for one model', async () => {
		const response = await Generator.run([templates[0]], models, ['0cf80d75-abcd-f8c7-41f6-ed41c6425aa1']);
		expect(response).to.be.an.array();

		// Test length
		expect(response.length).to.equal(1);

		// Test bookmark create
		expect(response[0].path).to.be.a.string();
		expect(response[0].content).to.be.a.string();
		expect(response[0].content).to.equal(get('output/bookmark/create.js'));
	});

	it('generate files without fields', async () => {
		const response = await Generator.run(
			[
				{
					path: 'src/routes/{kebab}/no-field.js',
					engine: 'hpf',
					input: 'one',
					content: '<<@ F f>><<f a-a>><<@>>END',
				},
			],
			models.map((m) => Object.assign({}, m, { fields: [] })),
			['0cf80d75-abcd-f8c7-41f6-ed41c6425aa1']
		);
		expect(response).to.be.an.array();

		// Test length
		expect(response.length).to.equal(1);

		// Test bookmark create
		expect(response[0].path).to.be.a.string();
		expect(response[0].content).to.be.a.string();
		expect(response[0].content).to.equal('END');
	});

	it('generate with empty template', async () => {
		const response = await Generator.run(
			[
				{
					path: 'src/routes/{kebab}/create.js',
					engine: 'hpf',
					input: 'one',
					content: '',
				},
			],
			models,
			['0cf80d75-abcd-f8c7-41f6-ed41c6425aa1']
		);
		expect(response).to.be.an.array();

		// Test length
		expect(response.length).to.equal(1);

		// Test bookmark create
		expect(response[0].path).to.be.a.string();
		expect(response[0].content).to.be.a.string();
		expect(response[0].content).to.equal('');
	});

	it('generate with malformed models', async () => {
		const error: any = await expect(
			Generator.run(
				templates,
				models.map((m) => {
					const clone = Object.assign({}, m);
					delete clone.accesses;
					return clone;
				})
			)
		).to.reject();
		expect(error.code).to.equal(1004);
	});

	it('generate with broken hpf template', async () => {
		const error: any = await expect(Generator.run([Object.assign({}, templates[0], { content: get('templates/error.js.hpf') })], models)).to.reject(
			'S is not defined'
		);
		expect(error.code).to.equal(1004);
	});

	it('generate with broken js template', async () => {
		const error: any = await expect(Generator.run([Object.assign({}, templates[2], { content: get('templates/error.js.js') })], models)).to.reject(
			'unknown is not defined'
		);
		expect(error.code).to.equal(2004);
	});

	it('generate with timeout hpf template', async () => {
		const error: any = await expect(Generator.run([Object.assign({}, templates[1], { content: '<<< while(true) {} >>>' })], models)).to.reject(
			'Template processing timed out (1000ms)'
		);
		expect(error.code).to.equal(1005);
	}).slow(4000);

	it('generate with timeout js template', async () => {
		const error: any = await expect(Generator.run([Object.assign({}, templates[2], { content: 'while(true) {}' })], models)).to.reject(
			'Template processing timed out (1000ms)'
		);
		expect(error.code).to.equal(2005);
	}).slow(4000);

	it('globals are undefined', async () => {
		await expect(
			Generator.run(
				[
					{
						path: 'src/globals.js',
						engine: 'js',
						input: 'all',
						content: get('templates/globals.js.js'),
					},
				],
				models
			)
		).to.not.reject();
	});
});
