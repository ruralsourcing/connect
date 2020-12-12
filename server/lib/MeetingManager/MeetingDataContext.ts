import { Meeting } from "./Meeting";
import { IDataContext } from "../../data/types";
import axios from "axios";

const baseUrl = process.env.API_BASE_URL;
export default class MeetingDataContext implements IDataContext<Meeting> {
  async getAll(): Promise<Meeting[]> {
    return axios
      .get<Meeting[]>("/api/meetings")
      .then((d) => d.data)
      .catch((e) => {
        console.log(e);
        return [];
      });
  }
  async get(uuid: string): Promise<Meeting> {
    return axios
      .request<Meeting>({
        url: `/api/meetings/?uuid=${encodeURIComponent(uuid)}`,
      })
      .then((d) => d.data)
      .catch((e) => {
        console.log(e);
        return {} as Meeting;
      });
  }
  async post(item: Meeting): Promise<Meeting> {
    return await axios.request<Meeting, Meeting>({
      url: "/api/meetings",
      method: "post",
      data: item,
    });
  }
  async delete(id: string): Promise<void> {
    await axios.delete(`/api/meetings/${id}`);
  }
  async put(item: Meeting): Promise<Meeting> {
    return await axios.request<Meeting, Meeting>({
      url: `/api/meetings/${item.id}`,
      data: item,
      method: "put"
    });
  }
}
