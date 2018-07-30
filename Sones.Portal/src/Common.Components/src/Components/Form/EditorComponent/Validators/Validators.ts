
const ErrorMessagesFormat: any = {
    Required: "Ce champ est obligatoire.",
    Length: "La valeur doit être de {0} caractères.",
    MaxLength: "La valeur ne doit pas dépasser {0} caractères.",
    MinLength: "La valeur doit contenir au moins {0} caractères.",
    Regex: "Le format de la valeur n'est pas valide.",
    MinValue: "La valeur doit être inférieur ou égale à {0}.",
    MaxsValue: "La valeur doit être supérieur ou égale à {0}.",
    IsInteger: "La valeur doit être un entier.",
    IsNumber: "La valeur doit être un nombre."
};

/**
 * Returns a validator that checks for null and whitespace
 * @param errorMessage Required error message to display
 */
export function required(): (value?: any | null) => string {
    return (value?: any): string => {
        if (value === undefined) { return ErrorMessagesFormat.Required; }
        if (typeof (value) === "boolean" && value === false) {
            return ErrorMessagesFormat.Required;
        }
        if (value instanceof Array && value.length === 0) {
            return ErrorMessagesFormat.Required;
        }
        if (value === null || value === undefined || value === "") {
            return ErrorMessagesFormat.Required;
        }
        return "";
    };
}

/**
 * Returns a validator that checks the length of a string and ensures its equal to a value. If input null return -1
 * @param desiredLength The length of the string
 * @param formatError a callback which takes the length and formats an appropriate error message for validation failed
 */
export function length(desiredLength: Number): (value?: string | null) => string {
    return (value?: string | null): string => {
        if (value === null || value === undefined || value.length !== desiredLength) {
            return String.format(ErrorMessagesFormat.Length, desiredLength);
        }
        return "";
    };
}

/**
 * Returns a validator that checks the length of a string and ensures its greater than a value (inclusive)
 * @param lengthBound The min length of the string
 * @param formatError a callback which takes the values Length and formats an appropriate error message for validation failed
 */
export function minLength(lengthBound: number): (value?: string | null) => string {
    return (value?: string | null): string => {
        if (value === null || value === undefined || value.length < lengthBound) {
            return String.format(ErrorMessagesFormat.MinLength, lengthBound);
        }
        return "";
    };
}

/**
 * Returns a validator that checks the length of a string and ensures its less than a value (inclusive)
 * @param lengthBound The max length of the string
 * @param formatError a callback which takes the values length and formats an appropriate error message for validation failed
 */
export function maxLength(lengthBound: Number): (value?: string | null) => string {
    return (value?: string | null): string => {
        if (value === null || value === undefined || value.length > lengthBound) {
            return String.format(ErrorMessagesFormat.MaxLength, lengthBound);
        }
        return "";
    };
}

/**
 * Returns a validator that calls the passed in regular expression aganist the string using exec()
 * @param expression The regular expression to use.
 * @param errorMessage Required error message to display
 */
export function regex(expression: RegExp): (value?: string | null) => string {
    return (value?: string | null): string => {
        if (value) {
            let match: RegExpExecArray | null = expression.exec(value);
            if (match === null || match === undefined) {
                return ErrorMessagesFormat.Regex;
            }
        }
        return "";
    };
}

/**
 * Returns a validator that checks if a number is greater than the provided bound
 * @param bound The bound
 * @param formatError a callback which takes the length and formats an appropriate error message for validation failed
 */
export function minValue(bound: Number): (value?: string | null) => string {
    return (value?: string | null): string => {
        if (value !== null && value !== undefined && !isNaN(parseFloat(value))) {
            let intValue: number = Number(value);
            if (!isNaN(intValue) && intValue < bound) {
                return String.format(ErrorMessagesFormat.MinValue, bound);
            }
        }
        return "";
    };
}

/**
 * Returns a validator that checks if a number is less than the provided bound
 * @param bound The bound
 * @param formatError a callback which takes the length and formats an appropriate error message for validation failed
 */
export function maxValue(bound: Number): (value?: string | null) => string {
    return (value?: string | null): string => {
        if (value !== null && value !== undefined && !isNaN(parseFloat(value))) {
            let intValue: number = Number(value);
            if (!isNaN(intValue) && intValue > bound) {
                return String.format(ErrorMessagesFormat.MaxLength, bound);
            }
        }
        return "";
    };
}

/**
 * Returns a validator that checks if a number is an integer
 * @param errorMessage Required error message to display
 */
export function isInteger(): (value?: string | null) => string {
    return (value?: string | null): string => {
        if (value) {
            if (Number(value) % 1 !== 0) {
                return ErrorMessagesFormat.IsInteger;
            }
        }
        return "";
    };
}

/**
 * Returns a validator that ensures the value is a number
 * @param errorMessage Required error message to display
 */
export function isNumber(): (value?: string | null) => string {
    return (value?: string | null): string => {
        if (value) {
            if (isNaN(Number(value))) {
                return ErrorMessagesFormat.IsNumber;
            }
        }
        return "";
    };
}
