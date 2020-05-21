import { GeneratorWorker, Template } from '../interfaces';
export declare class JavascriptGenerator implements GeneratorWorker {
    constructor();
    one(model: any, template: Template): Promise<string>;
    all(models: any[], template: Template): Promise<string>;
    /** Run eval */
    private eval;
}
