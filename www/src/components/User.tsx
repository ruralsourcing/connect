import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthenticationContext";

const User = (): JSX.Element => {
  const auth = useAuth();

  return (
    <>
      <label>{auth.user}</label>
      <button
        type="button"
        onClick={() => {
          auth.signin();
        }}
      >
        Login
      </button>
    </>
  );
};

export default User;
