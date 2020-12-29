import express, { NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

let client = jwksClient({
  jwksUri: `${process.env.B2C_AUTHORITY}/${process.env.B2C_LOGIN_POLICY}/discovery/v2.0/keys`,
});

export const authCheck = (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token === undefined) res.sendStatus(401);
    else {
      const decodedToken = jwt.decode(token) as {
        [key: string]: any;
      };
      console.log(decodedToken);

      client.getSigningKey(decodedToken.kid, (err, key) => {
        if (err != null) {
          console.log("err:" + err);
        } else {
          const signingKey = key.getPublicKey();
          console.log("signingKey:" + signingKey);
          try {
            const decoded: any = jwt.verify(token, signingKey, {
              algorithms: ["RS256"],
            });
            console.log(
              "decoded with signature verification: " + JSON.stringify(decoded)
            );
            next();
          } catch (ex) {
            console.log(ex);
            res.sendStatus(401);
          }
        }
      });
    }
  } catch (ex) {
    console.log(ex);
  }
};
