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
	},
	{
		name: 'Models - List',
		path: 'src/list.json',
		engine: 'js',
		input: 'all',
		content: get('templates/list.json.js')
	}
];

lab.test('generate files', async () => {
	const response = await Api.post('/generate', {
		templates: templates,
		models: models
	});
	expect(response.statusCode).to.equal(200);
	expect(response.body).to.be.an.object();
	expect(response.body.duration).to.be.a.number();
	expect(response.body.duration).to.be.at.least(0);
	expect(response.body.results).to.be.an.array();

	// Test length
	expect(response.body.results.length).to.equal(models.length + 2);

	// Test all returned files
	for (const output of response.body.results) {
		expect(output.path).to.be.a.string();
		expect(output.content).to.be.a.string();
	}

	// Test index file
	const indexFile = response.body.results.find((f: any) => f.path === 'src/routes/index.js');
	expect(indexFile).to.exists();
	expect(indexFile.content).to.equal(get('output/index.js'));

	// Test user create
	const userFile = response.body.results.find((f: any) => f.path === 'src/routes/user/create.js');
	expect(userFile).to.exists();
	expect(userFile.content).to.equal(get('output/user/create.js'));

	// Test bookmark create
	const bookmarkFile = response.body.results.find((f: any) => f.path === 'src/routes/bookmark/create.js');
	expect(bookmarkFile).to.exists();
	expect(bookmarkFile.content).to.equal(get('output/bookmark/create.js'));

	// Test model list
	const listFile = response.body.results.find((f: any) => f.path === 'src/list.json');
	expect(listFile).to.exists();
	expect(listFile.content).to.equal(get('output/list.json').trim());
});

lab.test('generate one file for one model', async () => {
	const response = await Api.post('/generate', {
		templates: [templates[0]],
		models: models,
		ids: ['0cf80d75-abcd-f8c7-41f6-ed41c6425aa1']
	});
	expect(response.statusCode).to.equal(200);
	expect(response.body).to.be.an.object();
	expect(response.body.duration).to.be.a.number();
	expect(response.body.duration).to.be.at.least(0);
	expect(response.body.results).to.be.an.array();

	// Test length
	expect(response.body.results.length).to.equal(1);

	// Test bookmark create
	expect(response.body.results[0].path).to.be.a.string();
	expect(response.body.results[0].content).to.be.a.string();
	expect(response.body.results[0].content).to.equal(get('output/bookmark/create.js'));
});

lab.test('generate without models', async () => {
	const response = await Api.post('/generate', {
		templates: templates
	});
	expect(response.statusCode).to.equal(400);
	expect(response.body.error).to.equal('Bad Request');
	expect(response.body.message).to.be.a.string();
	expect(response.body.statusCode).to.equal(400);
	expect(response.body.data).to.be.an.object();
	expect(response.body.data.type).to.be.a.string();
	expect(response.body.data.code).to.be.a.number();
});

lab.test('generate files without fields', async () => {
  const response = await Api.post('/generate', {
    templates: [{
      name: 'No field',
      path: 'src/routes/{model.hyphen}/no-field.js',
      engine: 'hpf',
      input: 'one',
      content: '<<@ F f>><<f a-a>><<@>>END'
    }],
    ids: ['0cf80d75-abcd-f8c7-41f6-ed41c6425aa1'],
    models: models.map(m => Object.assign({}, m, { fields: [] }))
  });
  expect(response.statusCode).to.equal(200);
  expect(response.body).to.be.an.object();
  expect(response.body.duration).to.be.a.number();
  expect(response.body.duration).to.be.at.least(0);
  expect(response.body.results).to.be.an.array();

  // Test length
  expect(response.body.results.length).to.equal(1);

  // Test bookmark create
  expect(response.body.results[0].path).to.be.a.string();
  expect(response.body.results[0].content).to.be.a.string();
  expect(response.body.results[0].content).to.equal('END');
});

lab.test('generate with empty template', async () => {
	const response = await Api.post('/generate', {
		templates: [
			{
				name: 'Routes - Create',
				path: 'src/routes/{model.hyphen}/create.js',
				engine: 'hpf',
				input: 'one',
				content: ''
			}
		],
		models: models,
		ids: ['0cf80d75-abcd-f8c7-41f6-ed41c6425aa1']
	});
	expect(response.statusCode).to.equal(200);
	expect(response.body).to.be.an.object();
	expect(response.body.duration).to.be.a.number();
	expect(response.body.duration).to.be.at.least(0);
	expect(response.body.results).to.be.an.array();

	// Test length
	expect(response.body.results.length).to.equal(1);

	// Test bookmark create
	expect(response.body.results[0].path).to.be.a.string();
	expect(response.body.results[0].content).to.be.a.string();
	expect(response.body.results[0].content).to.equal('');
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
	expect(response.body.data).to.be.an.object();
	expect(response.body.data.type).to.be.a.string();
	expect(response.body.data.code).to.be.a.number();
});

lab.test('generate with broken hpf template', async () => {
	const response = await Api.post('/generate', {
		templates: [Object.assign({}, templates[0], { content: get('templates/error.js.hpf') })],
		models: models
	});
	expect(response.statusCode).to.equal(422);
	expect(response.body.error).to.equal('Unprocessable Entity');
	expect(response.body.message).to.be.a.string();
	expect(response.body.statusCode).to.equal(422);
	expect(response.body.data).to.be.an.object();
	expect(response.body.data.duration).to.be.a.number();
	expect(response.body.data.duration).to.be.at.least(0);
	expect(response.body.data.type).to.be.a.string();
	expect(response.body.data.code).to.be.a.number();
	expect(response.body.data.details).to.be.a.string();
	expect(response.body.data.lineNumber).to.be.a.number();
	expect(response.body.data.columnNumber).to.be.a.number();
});

lab.test('generate with broken js template', async () => {
	const response = await Api.post('/generate', {
		templates: [Object.assign({}, templates[2], { content: get('templates/error.js.js') })],
		models: models
	});
	expect(response.statusCode).to.equal(422);
	expect(response.body.error).to.equal('Unprocessable Entity');
	expect(response.body.message).to.be.a.string();
	expect(response.body.statusCode).to.equal(422);
	expect(response.body.data).to.be.an.object();
	expect(response.body.data.duration).to.be.a.number();
	expect(response.body.data.duration).to.be.at.least(0);
	expect(response.body.data.type).to.be.a.string();
	expect(response.body.data.code).to.be.a.number();
	expect(response.body.data.details).to.be.a.string();
	expect(response.body.data.lineNumber).to.be.a.number();
	expect(response.body.data.columnNumber).to.be.a.number();
});

lab.test('generate with timeout hpf template', async () => {
	const response = await Api.post('/generate', {
		templates: [Object.assign({}, templates[1], { content: '<<< while(true) {} >>>' })],
		models: models
	});
	expect(response.statusCode).to.equal(422);
	expect(response.body.error).to.equal('Unprocessable Entity');
	expect(response.body.message).to.be.a.string();
	expect(response.body.statusCode).to.equal(422);
	expect(response.body.data).to.be.an.object();
	expect(response.body.data.duration).to.be.a.number();
	expect(response.body.data.duration).to.be.at.least(0);
	expect(response.body.data.type).to.be.a.string();
	expect(response.body.data.code).to.be.a.number();
	expect(response.body.data.details).to.be.undefined();
	expect(response.body.data.lineNumber).to.be.undefined();
	expect(response.body.data.columnNumber).to.be.undefined();
});

lab.test('generate with timeout js template', async () => {
	const response = await Api.post('/generate', {
		templates: [Object.assign({}, templates[2], { content: 'while(true) {}' })],
		models: models
	});
	expect(response.statusCode).to.equal(422);
	expect(response.body.error).to.equal('Unprocessable Entity');
	expect(response.body.message).to.be.a.string();
	expect(response.body.statusCode).to.equal(422);
	expect(response.body.data).to.be.an.object();
	expect(response.body.data.duration).to.be.a.number();
	expect(response.body.data.duration).to.be.at.least(0);
	expect(response.body.data.type).to.be.a.string();
	expect(response.body.data.code).to.be.a.number();
	expect(response.body.data.details).to.be.undefined();
	expect(response.body.data.lineNumber).to.be.undefined();
	expect(response.body.data.columnNumber).to.be.undefined();
});
