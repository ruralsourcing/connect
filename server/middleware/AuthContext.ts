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

  getUser = async (token: any): Promise<User | null> => {
    return new Promise(async (resolve, reject) => {
      try {
        //console.log("[GET USER TOKEN]", token);
        if (!token) return null;
        const email = token.emails.length > 0 && token.emails[0];
        let user = await this.context.getByEmail(email);
        if (!user) {
          user = await this.context.createUser(email);
        }
        resolve(user);
      } catch (ex) {
        reject(ex);
      }
    });
  };

  decode = (token: string): Promise<string | object> => {
    return new Promise((resolve, reject) => {
      //console.log(process.env.JWT_KID)
      client.getSigningKey(process.env.JWT_KID || "", async (err, key) => {
        if (err != null) {
          console.log("err:" + err);
        } else {
          const signingKey = key.getPublicKey();
          try {
            const decoded: any = jwt.verify(token, signingKey, {
              algorithms: ["RS256"],
            });
            resolve(decoded);
          } catch (ex) {
            console.log("ERROR PROCESSING TOKEN", ex.message, token);
            reject(ex);
          }
        }
      });
    });
  };

  middleware = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const token = req?.headers?.authorization?.split(" ")[1];
      let user;
      if (token) {
        const decoded = await this.decode(token);
        user = await this.getUser(decoded);
        //console.info("[USER]", user);
        res.locals.user = user;
      }
      next();
    } catch (ex) {
      console.log("[ERROR IN AUTH HANDLER]", ex.message);
      next();
    }
  };
}
