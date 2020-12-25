import { Button, DatePicker, version } from "antd";
import "antd/dist/antd.css";

const Home = () => (
  <>
    <h1>Home JHellko</h1>
    <p>antd version: {version}</p>
    <DatePicker />
    <Button type="primary" style={{ marginLeft: 8 }}>
      Primary Button
    </Button>
  </>
);

export default Home;
