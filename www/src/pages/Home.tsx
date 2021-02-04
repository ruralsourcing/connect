import { Typography } from '@material-ui/core';
import User from "../components/User";
import { useAuth } from "../context/AuthenticationContext";

const Home = () => {
  const auth = useAuth();

  return (
    <>
    <Typography variant={"h2"}>Home</Typography>
  </>
  )
};

export default Home;
