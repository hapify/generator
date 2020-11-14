import { HapifySyntax } from '@hapify/syntax';
import { Config } from '../config';
import { ExplicitModel, GeneratorWorker, Template } from '../interfaces';

const HpfOptions = { timeout: Config.Generator.timeout };

export class HpfGenerator implements GeneratorWorker {
	constructor() {}

	async one(model: ExplicitModel, template: Template): Promise<string> {
		return HapifySyntax.run(template.content, model, HpfOptions);
	}

	async all(models: ExplicitModel[], template: Template): Promise<string> {
		return HapifySyntax.run(template.content, models, HpfOptions);
	}
}
