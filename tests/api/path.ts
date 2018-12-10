import { expect } from 'code';
import * as Lab from 'lab';
const lab = (exports.lab = Lab.script());
import * as Api from '../inc/api';

lab.test('convert path with name', async () => {
	const response = await Api.post('/path', {
		path: '/this/is/a/{model.hyphen}/test',
		model: 'You video'
	});
	expect(response.statusCode).to.equal(200);
	expect(response.body.result).to.equal('/this/is/a/you-video/test');
});

lab.test('convert path without name', async () => {
	const response = await Api.post('/path', {
		path: '/this/is/a/test'
	});
	expect(response.statusCode).to.equal(200);
	expect(response.body.result).to.equal('/this/is/a/test');
});

lab.test('convert path without name', async () => {
	const response = await Api.post('/path', {
		paths: '/this/is/a/test'
	});
	expect(response.statusCode).to.equal(400);
	expect(response.body.error).to.equal('Bad Request');
	expect(response.body.message).to.be.a.string();
	expect(response.body.statusCode).to.equal(400);
});
