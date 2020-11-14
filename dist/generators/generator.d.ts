import { GeneratorResult, Model, Template } from '../interfaces';
export declare class Generator {
    private hpfGeneratorService;
    private javaScriptGeneratorService;
    constructor();
    /**
     * Run generation process for one model
     * "forIds": A list of models ids to restrict generation to
     * Throws an error if the template needs a model and no model is passed
     */
    run(templates: Template[], models: Model[], forIds?: string[]): Promise<GeneratorResult[]>;
    /** Only process the path */
    path(path: string, modelName?: string): string;
    /** Ensure error has a code and returns it */
    private formatError;
    /**
     * Run generation process for one model and one template
     * Throws an error if the template rendering engine is unknown
     */
    private one;
    /**
     * Run generation process for all models and one template
     * Throws an error if the template rendering engine is unknown
     */
    private all;
    /** Convert the model to an object containing all its properties */
    private explicitModel;
    /** Convert the model to an object containing all its properties unless references and dependencies */
    private explicitDeepModel;
    /** Convert the model used for a reference. Get model description (first level) and remove non referencing fields */
    private explicitReferenceModel;
    /** Return all dependent models as deep models */
    private explicitDependencies;
    /** Map entity fields to target models */
    private explicitReferences;
    /** Get models using this model */
    private explicitReferencedIn;
    /** Extract and process fields from model */
    private explicitFields;
    /** Extract and process accesses from model */
    private explicitAccesses;
    /** Compute models properties from fields */
    private explicitProperties;
    /** Convert all the models to an array of objects containing all its properties */
    private explicitAllModels;
}
