//import { google } from "googleapis";

import { useEffect, useState } from "react";
import { AuthContext, UserProfile } from "./types";
import axios from "axios";

console.log(process.env);

function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log("Query variable %s not found", variable);
}

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );

export const useProvideAuth = (): AuthContext => {
  const [user, setUser] = useState<string>();
  const [profile, setProfile] = useState<UserProfile>();

  useEffect(() => {
    const code = getQueryVariable("code");
    console.log(code);
    if (code) {
      fetch("/login", { method: "POST", body: code }).then((response) => {
        console.log(response);
      });

      axios
        .post("/login", {
          code: code,
        })
        .then((res) => {
          console.log(res.data);
          setUser(res.data.id_token);
          window.history.replaceState({}, document.title, "/");
        });
    }
  }, []);

  //   oauth2Client.on("tokens", (tokens) => {
  //     if (tokens.refresh_token) {
  //       // store the refresh_token in my database!
  //       console.log(tokens.refresh_token);
  //     }
  //     console.log(tokens.access_token);
  //   });

  //   const url = () => {
  //     return oauth2Client.generateAuthUrl({
  //       access_type: "offline",
  //       scope: "",
  //     });
  //   };

  const getToken = async (): Promise<any> => {
    //   let u = url();
    //   console.log(u);
    //   let token = await oauth2Client.getAccessToken();
    //   console.log(token);
    return "";
  };
  // signin and acquire a token silently with POPUP flow. Fall back in case of failure with silent acquisition to popup
  const signin = async (): Promise<void> => {};
  const signout = (): void => {};
  return {
    user,
    profile,
    signin,
    signout,
    getToken,
  };
};
