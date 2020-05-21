import { StringVariants } from '../string';
import { HpfGenerator } from './hpf-generator';
import { JavascriptGenerator } from './javascript-generator';
import { IGeneratorResult, IModel, ITemplate, TemplateInput, TemplateEngine, IField, FieldType, FieldSubType, Access } from '../interfaces';

/** Define the restriction for an action */
interface IActionAccesses {
	[s: string]: boolean | string;
}
/** Define the cache structure */
interface ICache {
	[s: string]: any;
}

const CACHE_ENABLED = true;

export class Generator {
	private hpfGeneratorService = new HpfGenerator();
	private javaScriptGeneratorService = new JavascriptGenerator();

	constructor() {}

	/**
	 * Run generation process for one model
	 * "forIds": A list of models ids to restrict generation to
	 * Throws an error if the template needs a model and no model is passed
	 */
	async run(templates: ITemplate[], models: IModel[], forIds?: string[]): Promise<IGeneratorResult[]> {
		// Create results stack
		const output: IGeneratorResult[] = [];
		// Create a new cache context
		const cache: ICache = {};
		// For each template, run sub process
		for (const template of templates) {
			if (template.input === TemplateInput.One) {
				for (const model of models) {
					if (forIds && !forIds.find((id) => id === model.id)) {
						continue;
					}
					output.push(await this._one(template, models, model, cache));
				}
			} else {
				output.push(await this._all(template, models, cache));
			}
		}
		return output;
	}

	/**
	 * Only process the path
	 */
	path(path: string, modelName?: string): string {
		// Quick exit
		if (!modelName) {
			return path;
		}

		const variants = StringVariants(modelName);
		const keys = Object.keys(variants);
		for (const key of keys) {
			path = path.replace(new RegExp(`{${key}}`, 'g'), variants[key]);
		}

		return path;
	}

	/**
	 * Run generation process for one model and one template
	 * Throws an error if the template rendering engine is unknown
	 */
	private async _one(template: ITemplate, models: IModel[], model: IModel, cache: ICache): Promise<IGeneratorResult> {
		// Compute path
		const path = this.path(template.path, model.name);
		// Get full model description
		const input = this._explicitModel(models, model, cache);

		// Compute content
		let content;
		if (template.engine === TemplateEngine.Hpf) {
			content = await this.hpfGeneratorService.one(input, template);
		} else if (template.engine === TemplateEngine.JavaScript) {
			content = await this.javaScriptGeneratorService.one(input, template);
		} else {
			throw new Error('Unknown engine');
		}

		return {
			content,
			path,
		};
	}

	/**
	 * Run generation process for all models and one template
	 * Throws an error if the template rendering engine is unknown
	 */
	private async _all(template: ITemplate, models: IModel[], cache: ICache): Promise<IGeneratorResult> {
		// Compute path
		const path = this.path(template.path);
		// Get full models description
		const input = this._explicitAllModels(models, cache);

		// Compute content
		let content;
		if (template.engine === TemplateEngine.Hpf) {
			content = await this.hpfGeneratorService.all(input, template);
		} else if (template.engine === TemplateEngine.JavaScript) {
			content = await this.javaScriptGeneratorService.all(input, template);
		} else {
			throw new Error('Unknown engine');
		}

		return {
			content,
			path,
		};
	}

	/**
	 * Convert the model to an object containing all its properties
	 * @todo Use caching for this method
	 */
	private _explicitModel(models: IModel[], model: IModel, cache: ICache, depth = 0): any {
		// Return cache value if any
		if (CACHE_ENABLED && depth === 0 && cache[model.id]) {
			return cache[model.id];
		}

		// Create object
		const m: any = Object.assign({}, model);

		// Convert names
		(<any>m).names = StringVariants(m.name);

		// Get and format fields
		const fields = m.fields.map((f: IField) => {
			(<any>f).names = StringVariants(f.name);
			return f;
		});

		// Get primary field
		const primary = fields.find((f: IField) => f.primary);

		// Get unique fields
		const unique = fields.filter((f: IField) => f.unique);

		// Get label fields
		const label = fields.filter((f: IField) => f.label);

		// Get label and searchable fields
		const searchableLabel = fields.filter((f: IField) => f.label && f.searchable);

		// Get nullable fields
		const nullable = fields.filter((f: IField) => f.nullable);

		// Get multiple fields
		const multiple = fields.filter((f: IField) => f.multiple);

		// Get embedded fields
		const embedded = fields.filter((f: IField) => f.embedded);

		// Get searchable fields
		const searchable = fields.filter((f: IField) => f.searchable);

		// Get sortable fields
		const sortable = fields.filter((f: IField) => f.sortable);

		// Get hidden fields
		const hidden = fields.filter((f: IField) => f.hidden);

		// Get internal fields
		const internal = fields.filter((f: IField) => f.internal);

		// Get restricted fields
		const restricted = fields.filter((f: IField) => f.restricted);

		// Get ownership fields
		const ownership = fields.filter((f: IField) => f.ownership);

		// Create filter function
		const filter = (func: (f: IField) => boolean = null) => {
			return typeof func === 'function' ? fields.filter(func) : fields;
		};

		// Set fields to model
		m.fields = {
			list: fields,
			l: fields,
			f: filter,
			filter,
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

		// Pre-compute properties
		m.properties = {
			fieldsCount: fields.length,
			hasPrimary: !!primary,
			hasUnique: unique.length > 0,
			hasLabel: label.length > 0,
			hasNullable: nullable.length > 0,
			hasMultiple: multiple.length > 0,
			hasEmbedded: embedded.length > 0,
			hasSearchable: searchable.length > 0,
			hasSortable: sortable.length > 0,
			hasHidden: hidden.length > 0,
			hasInternal: internal.length > 0,
			hasRestricted: restricted.length > 0,
			hasOwnership: ownership.length > 0,
			hasSearchableLabel: searchableLabel.length > 0,
			mainlyHidden: fields.length < 2 * hidden.length,
			mainlyInternal: fields.length < 2 * internal.length,
			isGeolocated:
				fields.filter((f: IField) => f.type === FieldType.Number && f.subtype === FieldSubType.Number.Latitude).length > 0 &&
				fields.filter((f: IField) => f.type === FieldType.Number && f.subtype === FieldSubType.Number.Longitude).length > 0,
			isGeoSearchable:
				fields.filter((f: IField) => f.type === FieldType.Number && f.subtype === FieldSubType.Number.Latitude && f.searchable).length > 0 &&
				fields.filter((f: IField) => f.type === FieldType.Number && f.subtype === FieldSubType.Number.Longitude && f.searchable).length > 0,
		};

		// ==========================================
		// ACCESSES
		// ==========================================
		// Compute accesses sub-object for each action
		// For each action, add a boolean for each access that denote if the access type is granted
		const accesses: IActionAccesses[] = [];
		const ordered = Access.list();
		const indexes = {
			admin: ordered.indexOf(Access.ADMIN),
			owner: ordered.indexOf(Access.OWNER),
			auth: ordered.indexOf(Access.AUTHENTICATED),
			guest: ordered.indexOf(Access.GUEST),
		};
		for (const action in model.accesses) {
			const accessIndex = ordered.indexOf(model.accesses[action]);
			const description: IActionAccesses = {
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
		const admin = accesses.filter((a: IActionAccesses) => a.admin);

		// Get owner actions
		const owner = accesses.filter((a: IActionAccesses) => a.owner);

		// Get auth actions
		const auth = accesses.filter((a: IActionAccesses) => a.auth);

		// Get guest actions
		const guest = accesses.filter((a: IActionAccesses) => a.guest);

		// Get actions
		const actionCreate = accesses.find((a: IActionAccesses) => a.action === 'create');
		const actionRead = accesses.find((a: IActionAccesses) => a.action === 'read');
		const actionUpdate = accesses.find((a: IActionAccesses) => a.action === 'update');
		const actionRemove = accesses.find((a: IActionAccesses) => a.action === 'remove');
		const actionSearch = accesses.find((a: IActionAccesses) => a.action === 'search');
		const actionCount = accesses.find((a: IActionAccesses) => a.action === 'count');

		// Pre-computed properties
		const propertiesAccess = {
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
		const filterAccess = (func: (a: IActionAccesses) => boolean = null) => {
			return typeof func === 'function' ? accesses.filter(func) : accesses;
		};
		m.accesses = {
			list: accesses,
			l: accesses,
			filter: filterAccess,
			f: filterAccess,
			properties: propertiesAccess,
			p: propertiesAccess,
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

		// Add references and dependencies on first level
		if (depth === 0) {
			// ==========================================
			// REFERENCES
			// ==========================================
			// Get reference fields
			// Then explicit the reference. If no reference is found returns null (it will be filtered after)
			const references = fields
				.filter((f: IField) => f.type === FieldType.Entity && f.reference)
				.map((field: any) => {
					const reference = models.find((m: IModel) => m.id === field.reference);

					// Nothing found
					if (!reference) {
						return null;
					}
					// Add reference to object
					const subField = this._explicitModel(models, reference, cache, depth + 1);
					field.model = subField;
					field.m = subField;

					return field;
				})
				.filter((f: any) => f);

			// Add to object
			m.fields.references = references;
			m.fields.references.f = m.fields.references.filter;
			m.fields.r = references;
			m.fields.r.f = m.fields.r.filter;

			// ==========================================
			// DEPENDENCIES
			// ==========================================
			// Create method to reduce references to dependencies
			// A custom filter can be passed
			// If the second argument is false, keep the self dependency
			const dependencies = (customFilter = (f: any) => f, removeSelf: boolean = true) => {
				const duplicates: any = {};
				return (
					references
						// Apply custom filter
						.filter(customFilter)
						// Remove self
						.filter((ref: any) => (removeSelf ? ref.model.id !== model.id : true))
						// Remove duplicates
						.filter((ref: any) => {
							if (duplicates[ref.reference] === true) {
								return false;
							}
							duplicates[ref.reference] = true;
							return true;
						})
						// Extract models
						.map((ref: any) => ref.model)
				);
			};

			// A boolean to determine if the model has a self dependency
			const selfDependency = !!references.find((ref: any) => ref.model.id === model.id);

			const allDependencies = dependencies();
			m.dependencies = {
				list: allDependencies,
				l: allDependencies,
				filter: dependencies,
				f: dependencies,
				self: selfDependency,
				s: selfDependency,
			};
			m.d = m.dependencies;
			m.properties.hasDependencies = allDependencies.length > 0;

			// ==========================================
			// REFERENCED IN
			// ==========================================
			// Filter referencing models
			const extractReferencingFields = (f: IField) => f.type === FieldType.Entity && f.reference === model.id;
			const referencedIn = models
				.filter((m: IModel) => !!m.fields.find(extractReferencingFields))
				.map((m: IModel) => {
					// Get model description (first level) and remove non referencing fields
					const explicited = this._explicitModel(models, m, cache, depth + 1);
					explicited.fields = explicited.fields.list.filter(extractReferencingFields);
					explicited.fields.f = explicited.fields.filter;
					explicited.f = explicited.fields;
					return explicited;
				});
			// Get all results
			m.referencedIn = referencedIn;
			m.referencedIn.f = m.referencedIn.filter;
			m.ri = referencedIn;
			m.properties.isReferenced = referencedIn.length > 0;
		}

		// Add short name
		m.f = m.fields;
		m.p = m.properties;
		m.a = m.accesses;

		// Store cache
		if (CACHE_ENABLED && depth === 0) {
			cache[model.id] = m;
		}

		return m;
	}

	/**
	 * Convert all the models to an array of objects containing all its properties
	 */
	private _explicitAllModels(models: IModel[], cache: ICache): any[] {
		return models.map((mod: IModel) => this._explicitModel(models, mod, cache));
	}
}
