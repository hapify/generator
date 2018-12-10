import { expect } from 'code';
import * as Lab from 'lab';
const lab = (exports.lab = Lab.script());
import * as Api from '../inc/api';
import * as Fs from 'fs';

const path = (file: string): string => {
	return `${process.cwd()}/tests/api/files/${file}`;
};
const get = (file: string): string => {
	return Fs.readFileSync(path(file), { encoding: 'utf8' });
};

const models: any[] = JSON.parse(get('models.json'));
const templates: any[] = [
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

lab.test('generate files', async () => {
	const response = await Api.post('/generate', {
		templates: templates,
		models: models
	});
	expect(response.statusCode).to.equal(200);
	expect(response.body).to.be.an.array();

	// Test length
	expect(response.body.length).to.equal(models.length + 1);

	// Test all returned files
	for (const output of response.body) {
		expect(output.path).to.be.a.string();
		expect(output.content).to.be.a.string();
	}

	// Test index file
	const indexFile = response.body.find((f: any) => f.path === 'src/routes/index.js');
	expect(indexFile).to.exists();
	expect(indexFile.content).to.equal(get('output/index.js'));

	// Test user create
	const userFile = response.body.find((f: any) => f.path === 'src/routes/user/create.js');
	expect(userFile).to.exists();
	expect(userFile.content).to.equal(get('output/user/create.js'));

	// Test bookmark create
	const bookmarkFile = response.body.find((f: any) => f.path === 'src/routes/bookmark/create.js');
	expect(bookmarkFile).to.exists();
	expect(bookmarkFile.content).to.equal(get('output/bookmark/create.js'));
});

lab.test('generate one file for one model', async () => {
	const response = await Api.post('/generate', {
		templates: [templates[0]],
		models: models,
		ids: ['0cf80d75-abcd-f8c7-41f6-ed41c6425aa1']
	});
	expect(response.statusCode).to.equal(200);
	expect(response.body).to.be.an.array();

	// Test length
	expect(response.body.length).to.equal(1);

	// Test bookmark create
	expect(response.body[0].path).to.be.a.string();
	expect(response.body[0].content).to.be.a.string();
	expect(response.body[0].content).to.equal(get('output/bookmark/create.js'));
});

lab.test('generate without models', async () => {
	const response = await Api.post('/generate', {
		templates: templates
	});
	expect(response.statusCode).to.equal(400);
	expect(response.body.error).to.equal('Bad Request');
	expect(response.body.message).to.be.a.string();
	expect(response.body.statusCode).to.equal(400);
});

lab.test('generate with malformed models', async () => {
	const response = await Api.post('/generate', {
		templates: templates,
		models: models.map(m => {
			const clone = Object.assign({}, m);
			delete clone.accesses;
			return clone;
		})
	});
	expect(response.statusCode).to.equal(400);
	expect(response.body.error).to.equal('Bad Request');
	expect(response.body.message).to.be.a.string();
	expect(response.body.statusCode).to.equal(400);
});

lab.test('generate with broken template', async () => {
	const response = await Api.post('/generate', {
		templates: [Object.assign({}, templates[0], { content: get('templates/error.js.hpf') })],
		models: models
	});
	expect(response.statusCode).to.equal(422);
	expect(response.body.error).to.equal('Unprocessable Entity');
	expect(response.body.message).to.be.a.string();
	expect(response.body.statusCode).to.equal(422);
});
