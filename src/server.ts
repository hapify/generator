import * as Hapi from 'hapi';
import { IConfig } from './config';
import { Routes } from './routes';
import * as Boom from 'boom';

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

		const is4xx = response.output.statusCode >= 400 && response.output.statusCode < 500;
		if (is4xx && response.data) {
			(response.output.payload as any).data = response.data;
		}

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
