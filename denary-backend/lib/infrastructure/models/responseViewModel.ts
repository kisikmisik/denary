import { ApplicationError } from "./errors/applicationError";
import { HttpError } from "./errors/httpError";
import { SystemError } from "./errors/systemError";

export class ResponseViewModel {

    /**
     * @static
     * @description Creates new (error) response view model based on thrown HttpError
     * @param {HttpError} error http error to parse
     * @returns {ResponseViewModel} returns complete response view model class
     * @memberof ResponseViewModel
     */
    public static getResponseViewModelFromHttpError(error: HttpError): ResponseViewModel {
        const isManyErrors = error.isMultipleErrors;
        const responseStatus = isManyErrors ? ResponseStatuses.MULTIPLE_ERRORS : ResponseStatuses.SINGLE_ERROR;
        const responseViewModel = new ResponseViewModel(responseStatus);
        responseViewModel.errors = error.getValidationErrors();

        return responseViewModel;
    }

    /**
     * @static
     * @description Creates new (error) response view model based on thrown System errors
     * @param {SystemError | ApplicationError | Error} error error to parse
     * @returns {ResponseViewModel} returns complete response view model class
     * @memberof ResponseViewModel
     */
    public static getResponseViewModelFromError(error: SystemError | ApplicationError | Error): ResponseViewModel {
        const responseViewModel = new ResponseViewModel(ResponseStatuses.SINGLE_ERROR);
        responseViewModel.errors = [{field: "general", message: "Server couldn't process request"}];
        return responseViewModel;
    }

    /**
     * @static
     * @description Creates new (error) response view model based message and field
     * @param {string} message error message
     * @param {string} field error field
     * @returns {ResponseViewModel} returns complete response view model class
     * @memberof ResponseViewModel
     */
    public static getResponseViewModelWithMessage(message: string, field: string): ResponseViewModel {
        const responseViewModel = new ResponseViewModel(ResponseStatuses.SINGLE_ERROR);
        responseViewModel.errors.push({field, message});
        return responseViewModel;
    }

    /**
     * @static
     * @description Creates new (accept) response view model
     * @returns {ResponseViewModel} returns complete response view model class
     * @memberof ResponseViewModel
     */
    public static getResponseAcceptViewModel(): ResponseViewModel {
        const responseViewModel = new ResponseViewModel(ResponseStatuses.SUCCESS);
        return responseViewModel;
    }

    public status: ResponseStatuses;
    public errors: Array<{field: string, message: string}>;

    constructor(status: ResponseStatuses) {
        this.status = status;
        this.errors = [];
    }

    /**
     * @description Creates new JSON object based on ResponseViewModel class
     *
     * @returns {{status: string, errors: Array<{status: string, message: string}>}} ready json object with status and errors array (can by empty)
     * @memberof ResponseViewModel
     */
    public getJson() {
        return {status: this.status, errors: this.errors};
    }
}

export enum ResponseStatuses { SUCCESS, SINGLE_ERROR, MULTIPLE_ERRORS }
