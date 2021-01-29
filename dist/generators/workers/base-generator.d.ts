import { ExplicitModel, GenerationContext, GeneratorWorker, Template } from '../../interfaces';
export declare abstract class BaseGenerator implements GeneratorWorker {
    one(model: ExplicitModel, template: Template): Promise<string>;
    all(models: ExplicitModel[], template: Template): Promise<string>;
    /** Append file name to error details if applicable */
    protected appendFileName(error: Error, template: Template): Error;
    protected abstract eval(content: string, context: GenerationContext): string;
}
