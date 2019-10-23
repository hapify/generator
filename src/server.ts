import * as Hapi from 'hapi';
import { IConfig } from './config';
import { Routes } from './routes';
import * as Boom from 'boom';
import { InternalError, RequestError, RouteError } from './services/Errors';

export async function init(config: IConfig): Promise<Hapi.Server> {
	const server = new Hapi.Server(config.Server);

	if (config.Server.app && config.Server.app.routePrefix) {
		server.realm.modifiers.route.prefix = config.Server.app.routePrefix;
	}

	// Register Hapi Plugins
	const plugins = [{ plugin: require('good'), options: config.Good }];
	await server.register(plugins);
	server.log(['booting'], 'All plugins registered successfully.');

	// Append error sender
	server.ext('onPreResponse', (request, h) => {
		/** @type {Boom<any>} */
		const response = request.response as Boom;
		if (!response.isBoom) {
			return h.continue;
		}

		// Get status code
		const status = response.output.statusCode;
		const payload = response.output.payload as any;

		// Already formatted errors
		// Copy data in case of badData
		if (status === 422 && response.data) {
			payload.data = response.data;
			return h.continue;
		}

		// Un-formatted errors
		// Wrap generic errors into boom
		let error: InternalError | RequestError;
		if (response.isServer) {
			error = new InternalError(response.message);
		} else if (status === 400) {
			error = new RequestError(response.message);
		} else {
			error = new RouteError(response.message);
		}
		// Add data to boom
		payload.data = {
			type: error.name,
			code: error.code
		};

		return h.continue;
	});

	// Register Routes
	server.route(Routes);

	// Display available routes
	const table = server.table();
	const routes = table.map(route => `${route.method.toUpperCase()} ${route.path}`).join('\n');
	server.log(['booting'], `Loaded ${table.length} routes:\n${routes}`);

	return server;
}
