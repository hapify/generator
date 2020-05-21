// ==================================================================
//  Fields
// ==================================================================
export type FieldType = 'boolean' | 'number' | 'string' | 'datetime' | 'entity' | 'object' | 'file';
export type FieldSubType =
	| 'integer'
	| 'float'
	| 'latitude'
	| 'longitude'
	| 'email'
	| 'password'
	| 'url'
	| 'text'
	| 'rich'
	| 'date'
	| 'time'
	| 'image'
	| 'video'
	| 'audio'
	| 'document';

// ==================================================================
//  Model
// ==================================================================
export interface Field {
	/** The field's name */
	name: string;
	/** The field's type */
	type: FieldType;
	/** The field's subtype */
	subtype: FieldSubType | null;
	/** The field's reference if the type is entity. The GUID string of the targeted model */
	reference: string | null;
	/** Should be used as a primary key or not */
	primary: boolean;
	/** Should be used as a unique key or not */
	unique: boolean;
	/** Should be used as a label or not */
	label: boolean;
	/** Denotes if the field can be empty or not */
	nullable: boolean;
	/** Denotes if the field is an array of values */
	multiple: boolean;
	/** Indicate whether the field is embedded (should be always exposed explicitly) */
	embedded: boolean;
	/** Indicate whether the field is searchable or not */
	searchable: boolean;
	/** Indicate whether the field is sortable or not */
	sortable: boolean;
	/** Indicate whether the field is hidden (should not be exposed) */
	hidden: boolean;
	/** Indicate whether the field is for an internal use only (should not be defined by an user) */
	internal: boolean;
	/** Indicate whether the field is restricted to authorized roles (should only be defined by an admin) */
	restricted: boolean;
	/** Indicate that this field defines the owner of the entity */
	ownership: boolean;
}

/**
 * Possible values for actions' access:
 *  - admin (Denotes if the access is restricted to the admins)
 *  - owner (Denotes if the access is restricted to the owner of the resource)
 *  - authenticated (Denotes if the access is restricted to authenticated users)
 *  - guest (Denotes if the access is not restricted)
 */
export type Access = 'admin' | 'owner' | 'auth' | 'guest';

/** Define the access for each available action */
export interface Accesses {
	create: Access;
	read: Access;
	update: Access;
	remove: Access;
	search: Access;
	count: Access;
}
/** Possible actions */
export type Action = keyof Accesses;
/** Define the restriction for an action */
export interface ActionAccesses {
	action: Action;
	admin: boolean;
	owner: boolean;
	auth: boolean;
	guest: boolean;

	gteAdmin: boolean;
	gteOwner: boolean;
	gteAuth: boolean;
	gteGuest: boolean;

	lteAdmin: boolean;
	lteOwner: boolean;
	lteAuth: boolean;
	lteGuest: boolean;
}

export interface Model {
	/** The model's unique id */
	id: string;
	/** The model's name */
	name: string;
	/** The fields of the model */
	fields: Field[];
	/** The model privacy access */
	accesses: Accesses;
}
export type Engine = 'hpf' | 'js';
export type Input = 'one' | 'all';
export interface Template {
	/** The template's path */
	path: string;
	/** The template's type */
	engine: Engine;
	/** Denotes if the template has to to be ran for one or all models */
	input: Input;
	/** The template's content */
	content: string;
}

// ==================================================================
//  Generator
// ==================================================================
export interface GeneratorWorker {
	/** Run generation process for one model */
	one(model: any, template: Template): Promise<string>;
	/** Run generation process for all models */
	all(models: any[], template: Template): Promise<string>;
}
export interface GeneratorResult {
	/** The file path */
	path: string;
	/** The file content */
	content: string;
}

// ==================================================================
//  Errors
// ==================================================================
export interface NumberedError extends Error {
	code: number;
}
