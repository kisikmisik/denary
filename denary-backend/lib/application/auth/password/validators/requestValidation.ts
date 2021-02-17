import { NextFunction, Request, RequestHandler, Response } from "express";
import * as joi from "joi";
import { HttpError } from "../../../../infrastructure/models/errors/httpError";

const joiChangePasswordSchema = joi.object().keys({
    login: joi.string().required(),
    passwordOld: joi.string().required(),
    passwordNew: joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{10,}$/),
});

export default (req: Request, res: Response, next: NextFunction) => {
    const results = joi.validate(req.body, joiChangePasswordSchema, {
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
