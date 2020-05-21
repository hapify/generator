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
    /**
     * Only process the path
     */
    path(path: string, modelName?: string): string;
    /**
     * Run generation process for one model and one template
     * Throws an error if the template rendering engine is unknown
     */
    private _one;
    /**
     * Run generation process for all models and one template
     * Throws an error if the template rendering engine is unknown
     */
    private _all;
    /**
     * Convert the model to an object containing all its properties
     * @todo Use caching for this method
     */
    private _explicitModel;
    /**
     * Convert all the models to an array of objects containing all its properties
     */
    private _explicitAllModels;
}
