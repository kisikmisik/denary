import { ValidationErrorItem } from "joi";
import { ValidationError } from "types/validationError";

export class ValidationErrorParser {
    public static createValidationErrorFromJoi(joiError: ValidationErrorItem): ValidationError {
        const key = joiError.context && joiError.context.key ? joiError.context.key : "general";
        const info =  "general";
        return { field: key, message: joiError.message, extendedMessage: info };
    }
}
