import { GeneratorWorker, Template } from '../interfaces';
export declare class HpfGenerator implements GeneratorWorker {
    constructor();
    one(model: any, template: Template): Promise<string>;
    all(models: any[], template: Template): Promise<string>;
    /**
     * Cleanup code before process
     */
    private _preProcess;
    /**
     * Cleanup code after process
     */
    private _postProcess;
}
