import async = require("async");
import * as brcypt from "bcrypt-nodejs";
import { NextFunction, Request, Response } from "express";
import * as JWT from "jsonwebtoken";
import { ApplicationRequest } from "types/request";
import { catProd } from "../../../../logingConfig";
import { blokUser, getFailedAttempts, getLastSuccesLoginTime, unBlokUser } from "../../../application/comon/usersCommon";
import { AuthorizationTokens } from "../../../domain/entity/authorization_tokens";
import { ApplicationError } from "../../../infrastructure/models/errors/applicationError";
import { LoginEvents } from "./../../../domain/entity/loginEvents";
import { DbContext } from "./../../../infrastructure/database/dbContext";
import { HttpError } from "./../../../infrastructure/models/errors/httpError";
import { myToString } from "./../../comon/commonTool";
import { ILoginRequest } from "./types/loginRequest";
import { ILoginResponse, IUserPermission } from "./types/loginResponse";

const config = process.env;
const TOKEN_EXPIRATION_TIME_IN_HOURS = 24 * 7;
const blockAccountAfter = 10; // attempts

export default async (req: ApplicationRequest, res: Response, next: NextFunction) => {
    const body = req.body as ILoginRequest;
    const moduleDescription = "login attempt for: " + body.login;
    async.parallel({
        permResult: (callback) => loginToSystem(req).then((permResult) => callback(null, permResult)).catch((error) => callback(error, null)),
    }, async (error, results: { permResult: ILoginResponse }) => {
        if (error) {
            return next(HttpError.extendedMessageError(400, (error.message), moduleDescription, "Login/Password"));
        } else {
            if (results instanceof ApplicationError) {
                return next(results);
            } else {
                return res.status(200).send({
                    response: results.permResult,
                    status: res.status,
                    message: "Login response.",
                });
            }
        }
    });
};

export function loginToSystem(req: ApplicationRequest): Promise<ILoginResponse | ApplicationError> {
    return new Promise<ILoginResponse | ApplicationError>(async (resolve, reject) => {
        const finalResponse: ILoginResponse = {} as any;
        try {
            const body = req.body as ILoginRequest;
            const loginStatus = new LoginEvents();
            loginStatus.login = body.login;
            loginStatus.password = body.password;
            loginStatus.browserinfo = req.rawHeaders.toString();
            loginStatus.succes = 0;
            // const userA = await DbContext.UserRepository.findOne({where: {login: body.login}, relations: ["password", "status"]});
            // unBlokUser(userA);
            // loginStatus.succes = 1;
            // await DbContext.LoginEventsRepository.save(loginStatus);
            const user = await DbContext.uersRepository.findOne({ where: { login: body.login }, relations: ["userPassword", "userStatus"] });
            if (!user) { return resolve(HttpError.extendedMessageError(401, ("Wrong login or password"), "Login/Password")); }
            async.parallel({
                attemptNo: (callback) => getFailedAttempts(body.login).then((user) => callback(null, user)).catch((error) => callback(error, null)),
            }, async (error, resultsVerify: { attemptNo: any }) => {
                if (error) { return reject(error); }
                catProd.info(() => "It is attempt no: " + resultsVerify.attemptNo + " for: " + body.login);

                if (!user.userPassword) { throw new Error("Password for user not set."); }

                const userDontExistsOrWrongPassword = !user || !brcypt.compareSync(body.password, user.userPassword.passwordMd5);
                if (userDontExistsOrWrongPassword) {
                    await DbContext.loginEventsRepository.save(loginStatus);
                    if (resultsVerify.attemptNo > blockAccountAfter) {
                        catProd.info(() => "Account will be blocked, due to no wrong attempt to log in. " + body.login);
                        if (user) { blokUser(user); }
                        await DbContext.loginEventsRepository.save(loginStatus);
                        return resolve(HttpError.extendedMessageError(401, ("Due to too many wrong attempts to log in to the Echo system, your account has been blocked"),
                            "Login/Password",
                            ("AttemptNumber: " + (++resultsVerify.attemptNo))));
                    }
                    return resolve(HttpError.extendedMessageError(401, ("Wrong login or password"),
                        "Login/Password",
                        ("AttemptNumber: " + (++resultsVerify.attemptNo))));
                }
                if (user.userStatus.wordFullName !== "Active") {
                    await DbContext.loginEventsRepository.save(loginStatus);
                    return resolve(HttpError.extendedMessageError(401, ("Your's acount is dissabled"), "Login/Password"));
                }

                // We have a suuces login
                const authorizationToken = new AuthorizationTokens();
                const durationInSeconds = 60 * 60 * TOKEN_EXPIRATION_TIME_IN_HOURS;
                const token = JWT.sign({
                    exp: Math.floor(Date.now() / 1000) + durationInSeconds,
                    data: {
                        id: user.id,
                        email: user.email,
                    },
                }, config.SECRET_KEY || "secret_key");

                authorizationToken.token = token;
                authorizationToken.users = user;
                authorizationToken.duration = durationInSeconds * 1000;
                authorizationToken.expirationDate = new Date((Date.now() + durationInSeconds * 1000));

                await DbContext.authorizationTokensRepository.save(authorizationToken);
                loginStatus.succes = 1;
                const lastSuccesLogin = (await getLastSuccesLoginTime(body.login)) as string;
                await DbContext.loginEventsRepository.save(loginStatus);
                const userProfileInformation = await DbContext.uersRepository.findOne({ where: { id: user.id }, relations: ["userStatus", "userPassword", "userPermissions", "userPermissions.permission"] });

                // const userHavePermissions =  userProfileInformation.userPassword && userProfileInformation.userPermissions.length !== 0;
                // if (!userHavePermissions) {
                //     await DbContext.loginEventsRepository.save(loginStatus);
                //     return next(HttpError.extendedMessageError(401, ("Your account does not have assigned rights. Please ask Admin"), "Login/Password"));
                //     }

                finalResponse.userPermissions = [] as any;

                finalResponse.tokenDurationInSeconds = durationInSeconds;
                finalResponse.token = token;
                finalResponse.firstTimeLogin = (lastSuccesLogin === "It's your first time in the echo System");
                finalResponse.attemptNumber = resultsVerify.attemptNo;
                finalResponse.lasstSuccessloginAt = lastSuccesLogin;
                finalResponse.userId = myToString(userProfileInformation.id);
                finalResponse.userFirstname = userProfileInformation.firstname;
                finalResponse.userSurname = userProfileInformation.surname;
                finalResponse.userEmail = userProfileInformation.email;
                finalResponse.phoneNumber = userProfileInformation.phoneNumber;

                for (const permLine of userProfileInformation.userPermissions) {
                    const perm: IUserPermission = {} as any;
                    perm.permissionId = myToString(permLine.id);
                    perm.permissionName = permLine.permission.wordFullName;
                    finalResponse.userPermissions.push(perm);
                }
                resolve(finalResponse);
            });
        } catch (error) {
            reject(error);
        }
    });
}
