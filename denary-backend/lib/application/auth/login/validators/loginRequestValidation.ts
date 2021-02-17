import { NextFunction, Request, RequestHandler, Response } from "express";
import * as joi from "joi";
import { HttpError } from "../../../../infrastructure/models/errors/httpError";

const joiLoginSchema = joi.object().keys({
    login: joi.string().required(),
    password: joi.string().required(),
    rememberMe: joi.boolean(),
});

export default (req: Request, res: Response, next: NextFunction) => {
    const results = joi.validate(req.body, joiLoginSchema, {
        abortEarly: false,
        allowUnknown: false,
    });

    if (results.error) {
        const error = HttpError.joiValidationError(400, results.error.details);
        next(error);
    } else {
        next();
    }
};
