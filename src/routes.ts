import * as Hapi from 'hapi';
import * as Joi from 'joi';
import * as Boom from 'boom';

const SECOND = 1000;
const MINUTE = 60 * SECOND;

const generateSchema = Joi.object({}).required();

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
		handler: (request: Hapi.Request) => {}
	}
];
