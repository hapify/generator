"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const generateSchema = Joi.object({}).required();
/* Cannot use Hapi.ServerRoute[], wrong interface */
exports.Routes = [
    {
        method: 'POST',
        path: '/generate',
        config: {
            validate: { payload: generateSchema },
            description: 'Route to generate file(s) from template(s) and model(s)',
            tags: ['generate']
        },
        handler: (request) => { }
    }
];
//# sourceMappingURL=routes.js.map