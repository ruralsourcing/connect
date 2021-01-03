import { User } from "@prisma/client";
import express, { NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { IUserDataContext } from "../data/UserDataContext";

let client = jwksClient({
  jwksUri: `${process.env.B2C_AUTHORITY}/${process.env.B2C_LOGIN_POLICY}/discovery/v2.0/keys`,
});

export class AuthContext {
  private context: IUserDataContext;

  constructor(context: IUserDataContext) {
    this.context = context;
  }

  private getUser = async (token: any): Promise<User> => {
    const email = token.emails.length > 0 && token.emails[0];
    let user = await this.context.getByEmail(email);
    if (!user) {
      user = await this.context.createUser(email);
    }
    return user;
  };

  middleware = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token === undefined) next();
      else {
        client.getSigningKey(process.env.JWT_KID || "", async (err, key) => {
          if (err != null) {
            console.log("err:" + err);
          } else {
            const signingKey = key.getPublicKey();
            try {
              const decoded: any = jwt.verify(token, signingKey, {
                algorithms: ["RS256"],
              });
              res.locals.user = await this.getUser(decoded);
              next();
            } catch (ex) {
              console.log(ex);
              next();
            }
          }
        });
      }
    } catch (ex) {
      console.log(ex);
    }
  };
}
