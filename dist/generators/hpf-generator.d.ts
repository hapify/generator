import { IGenerator, ITemplate } from "../interfaces";
export declare class HpfGenerator implements IGenerator {
    constructor();
    one(model: any, template: ITemplate): Promise<string>;
    all(models: any[], template: ITemplate): Promise<string>;
    /**
     * Cleanup code before process
     */
    private _preProcess;
    /**
     * Cleanup code after process
     */
    private _postProcess;
}
