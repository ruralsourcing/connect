import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthenticationContext";

const User = (): JSX.Element => {
  const auth = useAuth();
  const [login, setLogin] = useState();

  // move to auth context
  useEffect(() => {
    fetch('/login').then((r) => r.json()).then(d => setLogin(d.url))
  }, [])

  return (auth?.user && <div style={{
    wordBreak: 'break-all'
  }}>{auth.user}</div>) || <a href={login}>Login</a>;
};

export default User;
