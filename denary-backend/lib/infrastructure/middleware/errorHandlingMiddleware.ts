import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import * as httpStatusCodes from "http-status-codes";
import { ApplicationError, ImportanceLevel } from "./../models/errors/applicationError";
import { HttpError } from "./../models/errors/httpError";
import { NotImplementedError } from "./../models/errors/notImplementedError";
import { SystemError } from "./../models/errors/systemError";
import { ResponseViewModel } from "./../models/responseViewModel";

export const catchHttpErrors: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        const response = ResponseViewModel.getResponseViewModelFromHttpError(err);
        return res.status(err.status).json(response.getJson());
    } else {
        next(err);
    }
};

export const catchSystemError: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const response = ResponseViewModel.getResponseViewModelFromError(err);
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(response.getJson());
};

async function saveErrorToDatabase(error: Error) {
    throw new NotImplementedError();
}
