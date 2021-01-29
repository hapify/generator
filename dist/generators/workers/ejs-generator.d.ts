import { GenerationContext } from '../../interfaces';
import { BaseGenerator } from './base-generator';
export declare class EJSGenerator extends BaseGenerator {
    protected eval(content: string, context: GenerationContext): string;
}
