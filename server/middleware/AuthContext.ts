import { User } from "@prisma/client";
import express, { NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { IUserManager } from "../lib/UserManager/UserManager";

let client = jwksClient({
  jwksUri: `${process.env.B2C_AUTHORITY}/${process.env.B2C_LOGIN_POLICY}/discovery/v2.0/keys`,
});

export class AuthContext {
  private manager: IUserManager;
  private test: number = 10;

  constructor(manager: IUserManager) {
    this.manager = manager;
    console.log("[manager]", this.manager);
  }

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
              // set user in 
              let user;
              user = await this.manager.getByEmail(decoded.emails[0]);
              if(!user) {
                user = await this.manager.create({
                  email: decoded.emails[0],
                })
              }
              res.locals.user = user;
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

// export const AuthContext = (
//   req: express.Request,
//   res: express.Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (token === undefined) next();
//     else {
//       //console.log("[KID]", process.env.JWT_KID)
//       client.getSigningKey(process.env.JWT_KID || "", (err, key) => {
//         if (err != null) {
//           console.log("err:" + err);
//         } else {
//           const signingKey = key.getPublicKey();
//           //console.log("signingKey:" + signingKey);
//           try {
//             const decoded: any = jwt.verify(token, signingKey, {
//               algorithms: ["RS256"],
//             });
//             //console.log("[DECODED]", decoded);
//             req.app.set("user", decoded);
//             next();
//           } catch (ex) {
//             console.log(ex);
//             //res.sendStatus(403);
//             next();
//           }
//         }
//       });
//     }
//   } catch (ex) {
//     console.log(ex);
//   }
// };
