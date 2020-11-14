import { ExplicitModel, GeneratorWorker, Template } from '../interfaces';
export declare class JavascriptGenerator implements GeneratorWorker {
    constructor();
    one(model: ExplicitModel, template: Template): Promise<string>;
    all(models: ExplicitModel[], template: Template): Promise<string>;
    /** Append file name to error details if applicable */
    private appendFileName;
    /** Run eval */
    private eval;
}
