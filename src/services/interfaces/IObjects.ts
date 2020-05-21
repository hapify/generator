export interface IField {
	/** The field's name */
	name: string;
	/** The field's type */
	type: string;
	/** The field's subtype */
	subtype: string | null;
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
export class Access {
	static GUEST = 'guest';
	static AUTHENTICATED = 'auth';
	static OWNER = 'owner';
	static ADMIN = 'admin';
	/**
	 * Returns the list of permissions ordered by restriction
	 */
	static list(): string[] {
		return [Access.ADMIN, Access.OWNER, Access.AUTHENTICATED, Access.GUEST];
	}
}

/** Define the access for each available action */
export interface IAccesses {
	create: string;
	read: string;
	update: string;
	remove: string;
	search: string;
	count: string;
	[s: string]: string;
}

export interface IModel {
	/** The model's unique id */
	id: string;
	/** The model's name */
	name: string;
	/** The fields of the model */
	fields: IField[];
	/** The model privacy access */
	accesses: IAccesses;
}

export interface ITemplate {
	/** The template's path */
	path: string;
	/** The template's type */
	engine: string;
	/** Denotes if the template has to to be ran for one or all models */
	input: string;
	/** The template's content */
	content: string;
}
