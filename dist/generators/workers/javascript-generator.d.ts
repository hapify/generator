import { GenerationContext } from '../../interfaces';
import { BaseGenerator } from './base-generator';
export declare class JavascriptGenerator extends BaseGenerator {
    protected eval(content: string, context: GenerationContext): string;
}
