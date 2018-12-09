"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hapi = __importStar(require("hapi"));
const routes_1 = require("./routes");
function init(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new Hapi.Server(config.Server);
        if (config.Server.app && config.Server.app.routePrefix) {
            server.realm.modifiers.route.prefix = config.Server.app.routePrefix;
        }
        // Register Hapi Plugins
        const plugins = { plugin: require('good'), options: config.Good };
        yield server.register(plugins);
        server.log(['booting'], 'All plugins registered successfully.');
        // Register Routes
        server.route(routes_1.Routes);
        // Display available routes
        const table = server.table();
        const routes = table.map(route => `${route.method.toUpperCase()} ${route.path}`).join('\n');
        server.log(['booting'], `Loaded ${table.length} routes:\n${routes}`);
        return server;
    });
}
exports.init = init;
//# sourceMappingURL=server.js.map