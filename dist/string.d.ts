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
export declare function StringVariants(value: string): IStringVariants;
export {};
