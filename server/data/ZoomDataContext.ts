import { PrismaClient, ZoomAuth } from "@prisma/client";
import axios, { AxiosRequestConfig } from "axios";
import { IDataContext } from "./types";

export interface IZoomDataContext extends IDataContext<ZoomAuth> {
  getForUser(userId: number): Promise<ZoomAuth | null>;
  addToken(tokenInput: ZoomCodeInput): Promise<ZoomAuth | null>;
}

export interface ZoomCodeInput {
  code: string;
  state: string;
  userId: number;
  token?: string;
}

console.log("[ENVIRONMENT FOR ZOOM]", process.env)

export default class ZoomDataContext implements IZoomDataContext {
  client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }
  post(item: ZoomAuth): Promise<ZoomAuth> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<ZoomAuth[]> {
    throw new Error("Method not implemented.");
  }
  get(id: string): Promise<ZoomAuth | null> {
    throw new Error("Method not implemented.");
  }

/*
TODO: Add token if not added
TODO: Store refresh and expiration
TODO: Refresh if expired or near expiration
TODO: Get token (refresh if needed)
server_1    | data: {
server_1    |    access_token: 'eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiIxYjJmZTVlYy1hMzkwLTQzNDctOTFjNC0yNWZkZGUyYTVkZTYifQ.eyJ2ZXIiOjcsImF1aWQiOiI1NGZmOTdhNWMyYTE0OTBjODhlZGNiNWY3NmQ0OTc0NSIsImNvZGUiOiJKWVFJUFRYN0pvX2V5eFhmbnVwUXZXTmpYSmNOb0Q3WGciLCJpc3MiOiJ6bTpjaWQ6c0l2TTFfRGtTWFc2VXdXSlhQVHZfQSIsImdubyI6MCwidHlwZSI6MCwidGlkIjowLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJleXhYZm51cFF2V05qWEpjTm9EN1hnIiwibmJmIjoxNjEwOTQ1Mjg3LCJleHAiOjE2MTA5NDg4ODcsImlhdCI6MTYxMDk0NTI4NywiYWlkIjoidV96UmVSbWhSWWlLY0U2dzdhQVpoZyIsImp0aSI6ImMwZTBkMTBkLWU0MzMtNDdkMC1iNjZmLWZiNmUwOWMzZmE0MyJ9.E_n0-JqCd8Aiok00bWFMsLwG87VLBTD_BJd9dDp8jI3t9FXb7QiwPLwfTgeCj2RSXFqogj4n7xYmXEwwtbhNaw',
server_1    |    token_type: 'bearer',
server_1    |    refresh_token: 'eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiIzYzY5NjNiNS0yNzNiLTRlYTAtYTRkMi04ZDFiNTk3MTYwYjIifQ.eyJ2ZXIiOjcsImF1aWQiOiI1NGZmOTdhNWMyYTE0OTBjODhlZGNiNWY3NmQ0OTc0NSIsImNvZGUiOiJKWVFJUFRYN0pvX2V5eFhmbnVwUXZXTmpYSmNOb0Q3WGciLCJpc3MiOiJ6bTpjaWQ6c0l2TTFfRGtTWFc2VXdXSlhQVHZfQSIsImdubyI6MCwidHlwZSI6MSwidGlkIjowLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJleXhYZm51cFF2V05qWEpjTm9EN1hnIiwibmJmIjoxNjEwOTQ1Mjg3LCJleHAiOjIwODM5ODUyODcsImlhdCI6MTYxMDk0NTI4NywiYWlkIjoidV96UmVSbWhSWWlLY0U2dzdhQVpoZyIsImp0aSI6IjQxOTZhMjMyLWM2YmEtNDdhYy04NTQzLTIwNTY0NDQ1ZGY2ZiJ9.ybg4cdzKhCSEeJj4YE78LwQqVllazOnFqJ_gln-HCkEzmMHVNH81TTGZHC4zOTErxBzlOw_yufhvtdy5djGIyg',
server_1    |    expires_in: 3599,
server_1    |    scope: 'meeting:read:admin meeting:write:admin'
server_1    | }
*/
  async addToken(item: ZoomCodeInput): Promise<ZoomAuth | null> {
    let userData;
    userData = JSON.parse(
      Buffer.from(item.state as string, "base64").toString("utf-8")
    );
    console.log("[USER DATA]", userData);

    let response = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        code: item.code,
        redirect_uri: process.env.ZOOM_REDIRECT_URI,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    } as AxiosRequestConfig);
    console.log("[ZOOM AUTH RESPONSE]", response);
    item.token = response.data?.access_token;
    if (item.token) {
      return this.client.zoomAuth.create({
        data: {
          token: item.token,
          user: {
            connect: {
              id: item.userId,
            },
          },
        },
      });
    }
    return null;
    //   let token = jwt_decode<any>(response.data.access_token);
    //   if (userData) {
    //     session.addAuthorization(
    //       userData.teamId,
    //       userData.userId,
    //       response.data.access_token,
    //       token.uid
    //     );
    //     res.json(session.session(userData.teamId, userData.userId));
    //   } else {
    //     res.sendStatus(200);
    //   }
    // } else {
    //   res.send(500);
    // }
    // return this.client.zoomAuth.create({
    //   data: item,
    // });
  }
  delete(id: string): Promise<ZoomAuth> {
    throw new Error("Method not implemented.");
  }
  put(item: ZoomAuth): Promise<ZoomAuth> {
    throw new Error("Method not implemented.");
  }

  getForUser(userId: number): Promise<ZoomAuth | null> {
    return this.client.zoomAuth.findUnique({
      where: {
        userId: userId,
      },
    });
  }
}
