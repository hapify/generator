import * as Hapi from 'hapi';
import * as Joi from 'joi';
import Boom from 'boom';
import { Access, TemplateEngine, TemplateInput, GeneratorService } from './services';
import { Container } from 'typedi';
import { IModel, ITemplate } from './services/interfaces';

const Generator = Container.get(GeneratorService);

//================================================================================
//	SCHEMAS
//================================================================================
const accesses = [Access.ADMIN, Access.OWNER, Access.AUTHENTICATED, Access.GUEST];
const modelSchema = Joi.object({
	id: Joi.string().required(),
	name: Joi.string().required(),
	fields: Joi.array()
		.items(
			Joi.object({
				name: Joi.string().required(),
				type: Joi.string().required(),
				subtype: Joi.string()
					.required()
					.allow(null),
				reference: Joi.string()
					.required()
					.allow(null),
				primary: Joi.boolean().required(),
				unique: Joi.boolean().required(),
				label: Joi.boolean().required(),
				nullable: Joi.boolean().required(),
				multiple: Joi.boolean().required(),
				important: Joi.boolean().required(),
				searchable: Joi.boolean().required(),
				sortable: Joi.boolean().required(),
				isPrivate: Joi.boolean().required(),
				internal: Joi.boolean().required(),
				restricted: Joi.boolean().required(),
				ownership: Joi.boolean().required()
			})
		)
		.required()
		.min(1),
	accesses: Joi.object({
		create: Joi.string()
			.valid(accesses)
			.required(),
		read: Joi.string()
			.valid(accesses)
			.required(),
		update: Joi.string()
			.valid(accesses)
			.required(),
		remove: Joi.string()
			.valid(accesses)
			.required(),
		search: Joi.string()
			.valid(accesses)
			.required(),
		count: Joi.string()
			.valid(accesses)
			.required()
	}).required()
});
const engines = [TemplateEngine.Hpf, TemplateEngine.JavaScript];
const inputs = [TemplateInput.One, TemplateInput.All];
const templateSchema = Joi.object({
	name: Joi.string().required(),
	path: Joi.string().required(),
	engine: Joi.string()
		.valid(engines)
		.required(),
	input: Joi.string()
		.valid(inputs)
		.required(),
	content: Joi.string().allow('').required()
});

const generateSchema = Joi.object({
	models: Joi.array()
		.items(modelSchema)
		.min(1)
		.required(),
	templates: Joi.array()
		.items(templateSchema)
		.min(1)
		.required(),
	ids: Joi.array()
		.items(Joi.string())
		.single()
}).required();

//================================================================================
//	ROUTES
//================================================================================

/* Cannot use Hapi.ServerRoute[], wrong interface */
export const Routes: any[] = [
	{
		method: 'POST',
		path: '/generate',
		config: {
			validate: { payload: generateSchema },
			description: 'Route to generate file(s) from template(s) and model(s)',
			tags: ['generate']
		},
		handler: async (request: any): Promise<Hapi.ResponseValue> => {
			try {
				return await Generator.run(<ITemplate[]>request.payload.templates, <IModel[]>request.payload.models, <string[]>request.payload.ids);
			} catch (error) {
				throw Boom.badData(error.message, {
					type: error.constructor.name,
					stack: error.stack,
					lineNumber: error.lineNumber,
					columnNumber: error.columnNumber
				});
			}
		}
	},
	{
		method: 'POST',
		path: '/path',
		config: {
			validate: {
				payload: Joi.object({
					path: Joi.string().required(),
					model: Joi.string()
				}).required()
			},
			description: 'Route to get path for one template',
			tags: ['path']
		},
		handler: async (request: any): Promise<Hapi.ResponseValue> => {
			return {
				result: await Generator.path(<string>request.payload.path, <string>request.payload.model)
			};
		}
	}
];
