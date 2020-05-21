export declare class FieldType {
    static Boolean: string;
    static Number: string;
    static String: string;
    static DateTime: string;
    static Entity: string;
    static Object: string;
    static File: string;
}
export declare class FieldSubType {
    static Boolean: {};
    static Number: {
        Integer: string;
        Float: string;
        Latitude: string;
        Longitude: string;
    };
    static String: {
        Email: string;
        Password: string;
        Url: string;
        Text: string;
        RichText: string;
    };
    static DateTime: {
        Date: string;
        Time: string;
    };
    static Entity: {};
    static Object: {};
    static File: {
        Image: string;
        Video: string;
        Audio: string;
        Document: string;
    };
}
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
export declare class Access {
    static GUEST: string;
    static AUTHENTICATED: string;
    static OWNER: string;
    static ADMIN: string;
    /**
     * Returns the list of permissions ordered by restriction
     */
    static list(): string[];
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
export interface IGenerator {
    /**
     * Run generation process for one model
     */
    one(model: any, template: ITemplate): Promise<string>;
    /**
     * Run generation process for all models
     */
    all(models: any[], template: ITemplate): Promise<string>;
}
export interface IGeneratorResult {
    /** The file path */
    path: string;
    /** The file content */
    content: string;
}
export declare class TemplateEngine {
    static Hpf: string;
    static JavaScript: string;
}
export declare class TemplateInput {
    static One: string;
    static All: string;
}
export interface NumberedError extends Error {
    code: number;
}
