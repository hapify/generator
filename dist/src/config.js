"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const KILOBYTE = 1024;
const MEGABYTE = 1024 * KILOBYTE;
exports.Config = {
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