import * as Hapi from 'hapi';
import { IConfig } from './config';
import { Routes } from './routes';

export async function init(config: IConfig): Promise<Hapi.Server> {
	const server = new Hapi.Server(config.Server);

	if (config.Server.app && config.Server.app.routePrefix) {
		server.realm.modifiers.route.prefix = config.Server.app.routePrefix;
	}

	// Register Hapi Plugins
	const plugins = { plugin: require('good'), options: config.Good };
	await server.register(plugins);
	server.log(['booting'], 'All plugins registered successfully.');

	// Register Routes
	server.route(Routes);

	// Display available routes
	const table = server.table();
	const routes = table.map(route => `${route.method.toUpperCase()} ${route.path}`).join('\n');
	server.log(['booting'], `Loaded ${table.length} routes:\n${routes}`);

	return server;
}
