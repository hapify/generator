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
const Joi = __importStar(require("joi"));
const Boom = __importStar(require("boom"));
const services_1 = require("./services");
const typedi_1 = require("typedi");
const Generator = typedi_1.Container.get(services_1.GeneratorService);
//================================================================================
//	SCHEMAS
//================================================================================
const accesses = [services_1.Access.ADMIN, services_1.Access.OWNER, services_1.Access.AUTHENTICATED, services_1.Access.GUEST];
const modelSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    fields: Joi.array()
        .items(Joi.object({
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
    }))
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
    })
});
const engines = [services_1.TemplateEngine.Hpf, services_1.TemplateEngine.JavaScript];
const inputs = [services_1.TemplateInput.One, services_1.TemplateInput.All];
const templateSchema = Joi.object({
    name: Joi.string().required(),
    path: Joi.string().required(),
    engine: Joi.string()
        .valid(engines)
        .required(),
    input: Joi.string()
        .valid(inputs)
        .required(),
    content: Joi.string().required()
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
exports.Routes = [
    {
        method: 'POST',
        path: '/generate',
        config: {
            validate: { payload: generateSchema },
            description: 'Route to generate file(s) from template(s) and model(s)',
            tags: ['generate']
        },
        handler: (request) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Generator.run(request.payload.templates, request.payload.models, request.payload.ids);
            }
            catch (error) {
                throw Boom.boomify(error, { statusCode: 422 });
            }
        })
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
        handler: (request) => __awaiter(this, void 0, void 0, function* () {
            return yield Generator.path(request.payload.path, request.payload.model);
        })
    }
];
//# sourceMappingURL=routes.js.map