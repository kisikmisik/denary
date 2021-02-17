import * as httpStatusCodes from "http-status-codes";
import { ValidationErrorItem } from "joi";
import { ValidationError } from "./../../../types/validationError";
import { ApplicationError, ImportanceLevel } from "./applicationError";
import { SystemError } from "./systemError";
import { ValidationErrorParser } from "./validationErrorParser";

export const httpCodesArray: number[] = Object.keys(httpStatusCodes).map((key) => httpStatusCodes[key]);

export class HttpError extends ApplicationError {

    /**
     *
     *
     * @static
     * @param {number} status status from http-status-code package
     * @param {string} message message for error
     * @param {string} [field="general"] field which is linked to error
     * @param {ImportanceLevel} [importanceLevel] importance level of error
     * @returns { HttpError } instance of HTTP error
     * @memberof HttpError
     */
    public static singleMessageError(status: number, message: string, field: string = "general",  importanceLevel?: ImportanceLevel): HttpError {
        const error: HttpError = new HttpError(status, message, importanceLevel);
        error.field = field;
        error.message = message;
        // error.fielda = "@22";
        return error;
    }

    /**
     *
     *
     * @static
     * @param {number} status status from http-status-code package
     * @param {string} message message for error
     * @param {string} [field="general"] field which is linked to error
     * @param {extendedMessage} [extendedMessage] extended message and informatin for user
     * @returns { HttpError } instance of HTTP error
     * @memberof HttpError
     */
    public static extendedMessageError(status: number, message: string, field: string = "",  extendedMessage?: string ): HttpError {
        const error: HttpError = new HttpError(status, message);
        if (field !== "") { error.field = field; }
        error.message = message;
        error.extendedMessage = extendedMessage;
        return error;
    }

    /**
     *
     *
     * @static
     * @param {number} status status from http-status-code package
     * @param {ValidationError[]} validationErrors validation errors with fields names
     * @param {ImportanceLevel} [importanceLevel] importance level of error
     * @returns { HttpError } instance of HTTP error
     * @memberof HttpError
     */
    public static validationError(status: number, validationErrors: ValidationError[], importanceLevel?: ImportanceLevel): HttpError {
        const error: HttpError = new HttpError(status);
        error.importanceLevel = importanceLevel;
        validationErrors = validationErrors;

        return error;
    }

    /**
     * @description Create ready http error from joi validation errors
     *
     * @static
     * @param {number} [status=400] status from http-status-code package
     * @param {ValidationError[]} validationErrors validation errors with fields names
     * @param {ImportanceLevel} [importanceLevel] importance level of error
     * @returns { HttpError } instance of HTTP error
     * @memberof HttpError
     */
    public static joiValidationError(status: number = 400, joiValidationErrors: ValidationErrorItem[], importanceLevel?: ImportanceLevel): HttpError {
        const parsedErrors = joiValidationErrors.map( (error) => ValidationErrorParser.createValidationErrorFromJoi(error));
        const error: HttpError = new HttpError(status);
        error.importanceLevel = importanceLevel;
        error.validationErrors = parsedErrors;

        return error;
    }

    public status: number;
    public field: string;
    public extendedMessage: string;
    public validationErrors: ValidationError[];
    get isMultipleErrors(): boolean {
        return this.validationErrors.length !== 0;
    }

    constructor(status: number, message ?: string, importanceLevel ?: ImportanceLevel) {
            super(message, importanceLevel);
            this.status = checkStatusCode(status);
            this.validationErrors = [];
        }

    public getValidationErrors(): ValidationError[] {
        if (this.isMultipleErrors) {
            return this.validationErrors;
        } else {
            return [{field: this.field, message: this.message, extendedMessage: this.extendedMessage}];
        }
    }
}

/**
 * @description Check that status code is valid, if no logs an error about un-supported status code
 *
 * @param {number} statusCode status code
 * @returns {number} returns status code
 */
function checkStatusCode(statusCode: number): number {
    const isStatusCodeValid: boolean = httpCodesArray.every((status) => status === statusCode);

    if (isStatusCodeValid) {
        console.error(new SystemError("Invalid status code", ImportanceLevel.LOW_MEDIUM));
    }

    return statusCode;
}
