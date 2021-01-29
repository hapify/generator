import { expect } from '@hapi/code';
import 'mocha';
import { Generator } from '../src';
import {Model} from "../src/interfaces";
import * as Fs from "fs";

const path = (file: string): string => {
	return `${process.cwd()}/test/files/${file}`;
};
const get = (file: string): string => {
	return Fs.readFileSync(path(file), { encoding: 'utf8' });
};
const models: Model[] = JSON.parse(get('models.json'));

describe('dump', () => {
	it('one model', async () => {
		const response = Generator.dump(models, models[0].id);
		expect(response).to.be.a.string();
	});

	it('all models', async () => {
		const response = Generator.dump(models);
		expect(response).to.be.a.string();
	});
});
