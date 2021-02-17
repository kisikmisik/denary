import { NextFunction, Request, Response } from "express";
import * as httpStatusCodes from "http-status-codes";
import { HttpError } from "./../models/errors/httpError";
import { ResponseViewModel } from "./../models/responseViewModel";

export default (req: Request, res: Response, next: NextFunction) => {
    const error = HttpError.singleMessageError(httpStatusCodes.NOT_FOUND, "Resource don't exists");

    next(error);
};
