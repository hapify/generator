import { ExplicitModel, GeneratorWorker, Template } from '../interfaces';
export declare class JavascriptGenerator implements GeneratorWorker {
    constructor();
    one(model: ExplicitModel, template: Template): Promise<string>;
    all(models: ExplicitModel[], template: Template): Promise<string>;
    /** Run eval */
    private eval;
}
