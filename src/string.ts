import * as Case from 'case';

interface IStringVariants {
	raw: string;
	kebab: string;
	snake: string;
	header: string;
	constant: string;
	capital: string;
	lower: string;
	upper: string;
	compact: string;
	pascal: string;
	camel: string;
	[key: string]: string;
}

/** Convert a string to camel case, pascal case, etc... */
export function StringVariants(value: string): IStringVariants {
	return {
		raw: value,
		kebab: Case.kebab(value),
		snake: Case.snake(value),
		header: Case.header(value),
		constant: Case.constant(value),
		big: Case.constant(value).replace(/_/g, '-'),
		capital: Case.capital(value),
		lower: Case.lower(value),
		upper: Case.upper(value),
		compact: Case.snake(value).replace(/_/g, ''),
		pascal: Case.pascal(value),
		camel: Case.camel(value),
	};
}
