import { HapifyVM } from '@hapify/vm';
import { Config } from '../config';
import { TimeoutError, EvaluationError } from '../errors';
import {JavascriptGenerator} from "./javascript-generator";
import { compile } from 'ejs';
import {GenerationContext, MultipleModelsGenerationContext} from "../interfaces";

export class EJSGenerator extends JavascriptGenerator {

	/** Run eval */
	protected eval(content: string, context: GenerationContext): string {
		try {
			const template = compile(content);
			const templateRunner = typeof (context as MultipleModelsGenerationContext).models === "undefined" ?
				'return template({m, model});' :
				'return template({m, models});';
			return new HapifyVM({ timeout: Config.Generator.timeout }).run(templateRunner, { ...context, template });
		} catch (error) {
			if (error.code === 6003) {
				throw new TimeoutError(`Template processing timed out (${Config.Generator.timeout}ms)`);
			}
			if (error.code === 6002) {
				// Clone error
				const evalError = new EvaluationError(error.message);
				evalError.details = `Error: ${evalError.message}. Line: ${error.lineNumber}, Column: ${error.columnNumber}`;
				evalError.lineNumber = error.lineNumber;
				evalError.columnNumber = error.columnNumber;
				throw evalError;
			}
			throw error;
		}
	}
}
