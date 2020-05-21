import { IGenerator, ITemplate } from "../interfaces";
export declare class JavascriptGenerator implements IGenerator {
    constructor();
    one(model: any, template: ITemplate): Promise<string>;
    all(models: any[], template: ITemplate): Promise<string>;
    /** Run eval */
    private eval;
}
