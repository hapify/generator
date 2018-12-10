import { expect } from 'code';
import * as Lab from 'lab';
const lab = (exports.lab = Lab.script());
import * as Api from '../inc/api';

lab.test('convert path with name', async() => {
  const response = await Api.post('/path', {
    path: '/this/is/a/{model.hyphen}/test',
    name: 'You video'
  });
  expect(response.statusCode).to.equal(200);
  expect(response.body.result).to.equal('/this/is/a/you-video/test');
});
