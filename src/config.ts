const SECOND = 1000;
const MINUTE = 60 * SECOND;

const KILOBYTE = 1024;
const MEGABYTE = 1024 * KILOBYTE;

const EnableLogging = (process.env.ENABLE_LOGGING || 'true') === 'true';

export interface IConfig {
	Good: any;
	Generator: any;
	Server: any;
}
export const Config: IConfig = {
	Server: {
		port: Number(process.env.PORT || 9000),
		load: {
			maxHeapUsedBytes: Number(process.env.HEAP_SIZE || 256 * MEGABYTE),
			maxRssBytes: Number(process.env.RSS_SIZE || 288 * MEGABYTE),
			maxEventLoopDelay: 10 * SECOND,
			sampleInterval: SECOND,
			concurrent: Number(process.env.CONCURRENT || 20)
		},
		routes: {
			json: { space: 4 },
			response: { emptyStatusCode: 204 },
			timeout: {
				server: 2 * MINUTE,
				socket: 2 * MINUTE + SECOND
			},
			payload: {
				timeout: 20 * SECOND,
				allow: ['application/json']
			},
			cors: {
				origin: ['*']
			},
			validate: {
				failAction: function(request: any, h: any, error: any) {
					if (error) {
						if (error.details && error.details.length) {
							error.output.payload.message = error.details.map((d: any) => `${d.message} (${d.path.join('.')})`).join('. ');
							delete error.output.payload.validation;
						}
						return error;
					}
					return h.continue;
				}
			}
		},
		debug: { request: ['error'] },
		app: {
			routePrefix: ''
		}
	},
	Generator: {
		timeout: 1000
	},
	Good: {
		ops: false,
		reporters: EnableLogging
			? {
					console: [
						{
							module: 'good-squeeze',
							name: 'Squeeze',
							args: [
								{
									log: '*',
									response: '*',
									request: '*',
									error: '*'
								}
							]
						},
						{
							module: 'good-console',
							args: [
								{
									format: 'YYYY-MM-DD HH:mm:ss:SSS',
									utc: true,
									color: true
								}
							]
						},
						'stdout'
					]
			  }
			: {}
	}
};
