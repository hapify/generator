"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SECOND = 1000;
const MINUTE = 60 * SECOND;
exports.Config = {
    Server: {
        port: process.env.PORT || 9000,
        routes: {
            json: { space: 4 },
            response: { emptyStatusCode: 204 },
            timeout: {
                server: 5 * MINUTE,
                socket: 5 * MINUTE + SECOND
            },
            payload: {
                timeout: 20 * SECOND,
                allow: ['application/json']
            },
            cors: {
                origin: ['*']
            },
            validate: {
                options: { abortEarly: false },
                failAction: (request, h, error) => {
                    if (error) {
                        request.log(['error', 'validation'], error.toString());
                        throw error;
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
    Good: {
        ops: false,
        reporters: {
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
    }
};
//# sourceMappingURL=config.js.map