import * as brcypt from "bcrypt-nodejs";
import { NextFunction, Request, Response } from "express";
import { changeUserPassword } from "../../../application/comon/usersCommon";
import { DbContext } from "../../../infrastructure/database/dbContext";
import { HttpError } from "../../../infrastructure/models/errors/httpError";
import { IPasswordRequest } from "./types/password.request";

export default async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body as IPasswordRequest;
  const user = await DbContext.uersRepository.findOne({where: { login: body.login }, relations: ["password"]});
  // weryfikacja danych wejciowych
  if (!user) {
      return next(HttpError.singleMessageError(401, "There is no such user: ", body.login));
  }

  // hasło na start, co by był jeden serwis
  const badOldPassword = !(body.passwordOld === "emptyPassword") && !brcypt.compareSync(body.passwordOld, user.userPassword.passwordMd5);
  if (badOldPassword) {
      return next(HttpError.singleMessageError(401, "Incorrect password (Old)"));
  }

  const passwordsAllreadyUsed = await DbContext.passwordsRepository.find({where: { user: user.id }});

  for (const password of passwordsAllreadyUsed) {
    if (brcypt.compareSync(body.passwordNew, password.passwordMd5)) {
      return next(HttpError.singleMessageError(401, "Password has already been used"));
    }
  }

  changeUserPassword(user, body.passwordNew);
  return res.json({
    status: 201,
    message: "Password has been changed",
  });
};
