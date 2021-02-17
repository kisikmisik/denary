import { Users } from './../../domain/entity/users';
import * as async from "async";
import { NextFunction, Request, RequestHandler, Response } from "express";
import * as JWT from "jsonwebtoken";
import { getHeapStatistics } from "v8";
import { catProd } from "../../../logingConfig";
import { DictionaryTool } from "../../application/comon/dictionaryTool";
import { ApplicationRequest } from "./../../types/request";
import { DbContext } from "./../database/dbContext";
import { HttpError } from "./../models/errors/httpError";

const config = process.env;

export const authorize: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const authorizationToken = req.headers["x-access-token"] || req.query["x-access-token"];
    // console.log(req.body);
    catProd.info(() => ("Avaiable heap: " + ((getHeapStatistics().total_available_size - getHeapStatistics().used_heap_size) / 1000).toLocaleString() + " k"));
    catProd.info(() => "Authorizing request for: " + req.method + ": " + req.originalUrl);
    // console.log(getHeapSpaceStatistics());

    async.parallel({
        token: (callback) => checkAuthorizationToken(authorizationToken).then((token) => callback(null, token)).catch((error) => callback(error, null)),
        user: (callback) => checkUserPermissions(authorizationToken).then((user) => callback(null, user)).catch((error) => callback(error, null)),
    }, async (error, results: {token: string, user: Users}) => {

        if (!error) {
            const permissions = results.user.userPermissions.map((permission) => {
                return { id: permission.id, name: permission.permission.wordFullName };
            });
            const appRequest = req as ApplicationRequest;
            appRequest.userId = results.user.id;
            appRequest.permissions = permissions;
            next();
        } else {
            return next(error);
        }
    });
};

function checkAuthorizationToken(authorizationToken: any) {
    return new Promise(async (resolve, reject) => {
        await DictionaryTool.initGeneralDictionary();
        let authToken: string | object;
        try {
            authToken = JWT.verify(authorizationToken, config.SECRET_KEY || "secret_key");
            resolve(authToken);
        } catch (error) {
            const authorizationError = HttpError.singleMessageError(401, null);
            if (error.name === "TokenExpiredError") {
                authorizationError.message = "Access token expired";
            } else {
                authorizationError.message = "Access Denied";
            }
            reject(authorizationError);
        }
    });
}


function checkUserPermissions(authorizationToken: any): Promise<Users> {
    return new Promise(async (resolve, reject) => {
        await DictionaryTool.initGeneralDictionary();
        DbContext.AuthorizationTokensRepository.findOne({ where: { token: authorizationToken }, relations: ["users", "users.userPermissions", "users.userPermissions.permission"] })
        .then((authToken) => {
            const isUserExists = authToken && authToken.users;
            if (!isUserExists) {
                throw HttpError.singleMessageError(401, "User don't exists / token error");
            }
            return authToken.users;
        })
        .then((user) => {
            const userHavePermissions =  user.userPermissions && user.userPermissions.length !== 0;
            if (!userHavePermissions) {
                // console.log(userHavePermissions + " token: " + authorizationToken);
                throw HttpError.singleMessageError(401, "User don't exists / token error");
            }
            resolve(user);
        })
        .catch((error) => {
            console.log(error);
            reject(error);
        });
    });
}
