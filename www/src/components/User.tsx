import { useAuth } from "../context/AuthenticationContext";
import { Typography, Button } from "antd";

const { Text } = Typography;

const User = (): JSX.Element => {
  const auth = useAuth();

  return (
    <>
      <Text>
        {auth.user}
        {!auth.user && (
          <Button
            type="link"
            onClick={() => {
              auth.signin();
            }}
          >
            Login
          </Button>
        )}
        {auth.user && (
          <Button
            type="link"
            onClick={() => {
              auth.signout();
            }}
          >
            Logout
          </Button>
        )}
      </Text>
    </>
  );
};

export default User;
