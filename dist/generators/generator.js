"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const string_1 = require("../string");
const hpf_generator_1 = require("./hpf-generator");
const javascript_generator_1 = require("./javascript-generator");
const errors_1 = require("../errors");
const CACHE_ENABLED = true;
class Generator {
    constructor() {
        this.hpfGeneratorService = new hpf_generator_1.HpfGenerator();
        this.javaScriptGeneratorService = new javascript_generator_1.JavascriptGenerator();
    }
    /**
     * Run generation process for one model
     * "forIds": A list of models ids to restrict generation to
     * Throws an error if the template needs a model and no model is passed
     */
    run(templates, models, forIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create results stack
                const output = [];
                // Create a new cache context
                const cache = {};
                // For each template, run sub process
                for (const template of templates) {
                    if (template.input === 'one') {
                        for (const model of models) {
                            if (forIds && !forIds.find((id) => id === model.id)) {
                                continue;
                            }
                            output.push(yield this.one(template, models, model, cache));
                        }
                    }
                    else {
                        output.push(yield this.all(template, models, cache));
                    }
                }
                return output;
            }
            catch (error) {
                throw this.formatError(error);
            }
        });
    }
    /** Only process the path */
    path(path, modelName) {
        try {
            // Quick exit
            if (!modelName) {
                return path;
            }
            const variants = string_1.StringVariants(modelName);
            const keys = Object.keys(variants);
            for (const key of keys) {
                path = path.replace(new RegExp(`{${key}}`, 'g'), variants[key]);
            }
            return path;
        }
        catch (error) {
            throw this.formatError(error);
        }
    }
    /** Ensure error has a code and returns it */
    formatError(error) {
        // Error is already formatted ?
        if (typeof error.code === 'undefined') {
            const newError = new errors_1.InternalError(error.message);
            newError.stack = error.stack;
            return newError;
        }
        return error;
    }
    /**
     * Run generation process for one model and one template
     * Throws an error if the template rendering engine is unknown
     */
    one(template, models, model, cache) {
        return __awaiter(this, void 0, void 0, function* () {
            // Compute path
            const path = this.path(template.path, model.name);
            // Get full model description
            const input = this.explicitModel(models, model, cache);
            // Compute content
            let content;
            if (template.engine === 'hpf') {
                content = yield this.hpfGeneratorService.one(input, template);
            }
            else if (template.engine === 'js') {
                content = yield this.javaScriptGeneratorService.one(input, template);
            }
            else {
                throw new Error('Unknown engine');
            }
            return {
                content,
                path,
            };
        });
    }
    /**
     * Run generation process for all models and one template
     * Throws an error if the template rendering engine is unknown
     */
    all(template, models, cache) {
        return __awaiter(this, void 0, void 0, function* () {
            // Compute path
            const path = this.path(template.path);
            // Get full models description
            const input = this.explicitAllModels(models, cache);
            // Compute content
            let content;
            if (template.engine === 'hpf') {
                content = yield this.hpfGeneratorService.all(input, template);
            }
            else if (template.engine === 'js') {
                content = yield this.javaScriptGeneratorService.all(input, template);
            }
            else {
                throw new Error('Unknown engine');
            }
            return {
                content,
                path,
            };
        });
    }
    /** Convert the model to an object containing all its properties */
    explicitModel(models, model, cache, depth = 0) {
        // Return cache value if any
        if (CACHE_ENABLED && depth === 0 && cache[model.id]) {
            return cache[model.id];
        }
        const deepFields = this.explicitFields(model);
        const accesses = this.explicitAccesses(model);
        const references = this.explicitReferences(models, deepFields.list);
        const fields = Object.assign(deepFields, {
            references,
            r: references,
        });
        const dependencies = this.explicitDependencies(model, fields.references);
        const referencedIn = this.explicitReferencedIn(models, model);
        const properties = Object.assign(this.explicitProperties(deepFields), {
            hasDependencies: dependencies.list.length > 0,
            isReferenced: referencedIn.length > 0,
        });
        // Create explicit model
        const m = {
            id: model.id,
            name: model.name,
            names: string_1.StringVariants(model.name),
            fields,
            f: fields,
            properties,
            p: properties,
            accesses,
            a: accesses,
            dependencies,
            d: dependencies,
            referencedIn,
            ri: referencedIn,
        };
        // Store cache
        if (CACHE_ENABLED && depth === 0) {
            cache[model.id] = m;
        }
        return m;
    }
    /** Convert the model to an object containing all its properties unless references and dependencies */
    explicitDeepModel(model) {
        const fields = this.explicitFields(model);
        const properties = this.explicitProperties(fields);
        const accesses = this.explicitAccesses(model);
        return {
            id: model.id,
            name: model.name,
            names: string_1.StringVariants(model.name),
            fields,
            f: fields,
            properties,
            p: properties,
            accesses,
            a: accesses,
        };
    }
    /** Convert the model used for a reference. Get model description (first level) and remove non referencing fields */
    explicitReferenceModel(model, filter) {
        const fields = this.explicitFields(model);
        const properties = this.explicitProperties(fields);
        const accesses = this.explicitAccesses(model);
        const filteredFields = fields.list.filter(filter);
        filteredFields.f = filteredFields.filter;
        return {
            id: model.id,
            name: model.name,
            names: string_1.StringVariants(model.name),
            fields: filteredFields,
            f: filteredFields,
            properties,
            p: properties,
            accesses,
            a: accesses,
        };
    }
    /** Return all dependent models as deep models */
    explicitDependencies(model, references) {
        // Create method to reduce references to dependencies
        // A custom filter can be passed
        // If the second argument is false, keep the self dependency
        const dependencies = (filter = (f) => !!f, excludeSelf = true) => {
            const duplicates = {};
            return (references
                // Apply custom filter
                .filter(filter)
                // Remove self
                .filter((ref) => (excludeSelf ? ref.model.id !== model.id : true))
                // Remove duplicates
                .filter((ref) => {
                if (duplicates[ref.reference] === true) {
                    return false;
                }
                duplicates[ref.reference] = true;
                return true;
            })
                // Extract models
                .map((ref) => ref.model));
        };
        // A boolean to determine if the model has a self dependency
        const selfDependency = references.some((ref) => ref.model.id === model.id);
        const allDependencies = dependencies();
        return {
            list: allDependencies,
            l: allDependencies,
            filter: dependencies,
            f: dependencies,
            self: selfDependency,
            s: selfDependency,
        };
    }
    /** Map entity fields to target models */
    explicitReferences(models, fields) {
        // Get reference fields
        // Then explicit the reference. If no reference is found returns null (it will be filtered after)
        const references = fields
            .filter((f) => f.type === 'entity' && f.reference)
            .map((field) => {
            const reference = models.find((m) => m.id === field.reference);
            // Nothing found
            if (!reference) {
                return null;
            }
            // Add reference to object
            const subField = this.explicitDeepModel(reference);
            field.model = subField;
            field.m = subField;
            return field;
        })
            .filter((f) => !!f);
        // Add to object
        references.f = references.filter;
        return references;
    }
    /** Get models using this model */
    explicitReferencedIn(models, model) {
        // Filter referencing models
        const extractReferencingFields = (f) => f.type === 'entity' && f.reference === model.id;
        const referencedIn = models
            .filter((m) => m.fields.some(extractReferencingFields))
            .map((m) => this.explicitReferenceModel(m, extractReferencingFields));
        referencedIn.f = referencedIn.filter;
        return referencedIn;
    }
    /** Extract and process fields from model */
    explicitFields(model) {
        // Get and format fields
        const fields = model.fields.map((f) => {
            const explicitField = Object.assign({
                names: string_1.StringVariants(f.name),
            }, f);
            return explicitField;
        });
        // Create explicit field groups
        const primary = fields.find((f) => f.primary);
        const unique = fields.filter((f) => f.unique);
        const label = fields.filter((f) => f.label);
        const searchableLabel = fields.filter((f) => f.label && f.searchable);
        const nullable = fields.filter((f) => f.nullable);
        const multiple = fields.filter((f) => f.multiple);
        const embedded = fields.filter((f) => f.embedded);
        const searchable = fields.filter((f) => f.searchable);
        const sortable = fields.filter((f) => f.sortable);
        const hidden = fields.filter((f) => f.hidden);
        const internal = fields.filter((f) => f.internal);
        const restricted = fields.filter((f) => f.restricted);
        const ownership = fields.filter((f) => f.ownership);
        // Create filter function
        const filter = (callback = null) => {
            return typeof callback === 'function' ? fields.filter(callback) : fields;
        };
        return {
            list: fields,
            l: fields,
            filter,
            f: filter,
            primary,
            pr: primary,
            unique,
            un: unique,
            label,
            lb: label,
            nullable,
            nu: nullable,
            multiple,
            ml: multiple,
            embedded,
            em: embedded,
            searchable,
            se: searchable,
            sortable,
            so: sortable,
            hidden,
            hd: hidden,
            internal,
            in: internal,
            restricted,
            rs: restricted,
            ownership,
            os: ownership,
            searchableLabel,
            sl: searchableLabel,
        };
    }
    /** Extract and process accesses from model */
    explicitAccesses(model) {
        // Compute accesses sub-object for each action
        // For each action, add a boolean for each access that denote if the access type is granted
        const accesses = [];
        const ordered = ['admin', 'owner', 'auth', 'guest'];
        const indexes = {
            admin: ordered.indexOf('admin'),
            owner: ordered.indexOf('owner'),
            auth: ordered.indexOf('auth'),
            guest: ordered.indexOf('guest'),
        };
        const actions = Object.keys(model.accesses);
        for (const action of actions) {
            const accessIndex = ordered.indexOf(model.accesses[action]);
            const description = {
                action: action,
                admin: accessIndex === indexes.admin,
                owner: accessIndex === indexes.owner,
                auth: accessIndex === indexes.auth,
                guest: accessIndex === indexes.guest,
                gteAdmin: accessIndex >= indexes.admin,
                gteOwner: accessIndex >= indexes.owner,
                gteAuth: accessIndex >= indexes.auth,
                gteGuest: accessIndex >= indexes.guest,
                lteAdmin: accessIndex <= indexes.admin,
                lteOwner: accessIndex <= indexes.owner,
                lteAuth: accessIndex <= indexes.auth,
                lteGuest: accessIndex <= indexes.guest,
            };
            accesses.push(description);
        }
        // Get admin actions
        const admin = accesses.filter((a) => a.admin);
        // Get owner actions
        const owner = accesses.filter((a) => a.owner);
        // Get auth actions
        const auth = accesses.filter((a) => a.auth);
        // Get guest actions
        const guest = accesses.filter((a) => a.guest);
        // Get actions
        const actionCreate = accesses.find((a) => a.action === 'create');
        const actionRead = accesses.find((a) => a.action === 'read');
        const actionUpdate = accesses.find((a) => a.action === 'update');
        const actionRemove = accesses.find((a) => a.action === 'remove');
        const actionSearch = accesses.find((a) => a.action === 'search');
        const actionCount = accesses.find((a) => a.action === 'count');
        // Pre-computed properties
        const accessProperties = {
            onlyAdmin: admin.length === accesses.length,
            onlyOwner: owner.length === accesses.length,
            onlyAuth: auth.length === accesses.length,
            onlyGuest: guest.length === accesses.length,
            maxAdmin: admin.length > 0 && owner.length === 0 && auth.length === 0 && guest.length === 0,
            maxOwner: owner.length > 0 && auth.length === 0 && guest.length === 0,
            maxAuth: auth.length > 0 && guest.length === 0,
            maxGuest: guest.length > 0,
            noAdmin: admin.length === 0,
            noOwner: owner.length === 0,
            noAuth: auth.length === 0,
            noGuest: guest.length === 0,
            hasAdmin: admin.length > 0,
            hasOwner: owner.length > 0,
            hasAuth: auth.length > 0,
            hasGuest: guest.length > 0,
        };
        // Create filter function
        const filterAccess = (func = null) => {
            return typeof func === 'function' ? accesses.filter(func) : accesses;
        };
        return {
            list: accesses,
            l: accesses,
            filter: filterAccess,
            f: filterAccess,
            properties: accessProperties,
            p: accessProperties,
            // By access
            admin,
            ad: admin,
            owner,
            ow: owner,
            auth,
            au: auth,
            guest,
            gs: guest,
            // By actions
            create: actionCreate,
            c: actionCreate,
            read: actionRead,
            r: actionRead,
            update: actionUpdate,
            u: actionUpdate,
            remove: actionRemove,
            d: actionRemove,
            search: actionSearch,
            s: actionSearch,
            count: actionCount,
            n: actionCount,
        };
    }
    /** Compute models properties from fields */
    explicitProperties(fields) {
        return {
            fieldsCount: fields.list.length,
            hasPrimary: !!fields.primary,
            hasUnique: fields.unique.length > 0,
            hasLabel: fields.label.length > 0,
            hasNullable: fields.nullable.length > 0,
            hasMultiple: fields.multiple.length > 0,
            hasEmbedded: fields.embedded.length > 0,
            hasSearchable: fields.searchable.length > 0,
            hasSortable: fields.sortable.length > 0,
            hasHidden: fields.hidden.length > 0,
            hasInternal: fields.internal.length > 0,
            hasRestricted: fields.restricted.length > 0,
            hasOwnership: fields.ownership.length > 0,
            hasSearchableLabel: fields.searchableLabel.length > 0,
            mainlyHidden: fields.list.length < 2 * fields.hidden.length,
            mainlyInternal: fields.list.length < 2 * fields.internal.length,
            isGeolocated: fields.list.filter((f) => f.type === 'number' && f.subtype === 'latitude').length > 0 &&
                fields.list.filter((f) => f.type === 'number' && f.subtype === 'longitude').length > 0,
            isGeoSearchable: fields.list.filter((f) => f.type === 'number' && f.subtype === 'latitude' && f.searchable).length > 0 &&
                fields.list.filter((f) => f.type === 'number' && f.subtype === 'longitude' && f.searchable).length > 0,
        };
    }
    /** Convert all the models to an array of objects containing all its properties */
    explicitAllModels(models, cache) {
        return models.map((mod) => this.explicitModel(models, mod, cache));
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map