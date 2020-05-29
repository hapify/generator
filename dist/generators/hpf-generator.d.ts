import { ExplicitModel, GeneratorWorker, Template } from '../interfaces';
export declare class HpfGenerator implements GeneratorWorker {
    constructor();
    one(model: ExplicitModel, template: Template): Promise<string>;
    all(models: ExplicitModel[], template: Template): Promise<string>;
    /**
     * Cleanup code before process
     */
    private preProcess;
    /**
     * Cleanup code after process
     */
    private postProcess;
}
