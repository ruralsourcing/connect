import { Meeting } from "../lib/MeetingManager/Meeting";
import { IDataContext } from "./types";
import axios from "axios";

const baseUrl = process.env.API_BASE_URL;
export default class MeetingContext implements IDataContext<Meeting> {
  async getAll(): Promise<Meeting[]> {
    return axios
      .get<Meeting[]>("/api/meetings", {
        baseURL: baseUrl,
      })
      .then((d) => d.data)
      .catch((e) => {
        console.log(e);
        return [];
      });
  }
  async get(uuid: string): Promise<Meeting> {
    return axios
      .get<Meeting>(`/api/meetings/?uuid=${encodeURIComponent(uuid)}`)
      .then((d) => d.data)
      .catch((e) => {
        console.log(e);
        return {} as Meeting;
      });
  }
  async post(item: Meeting): Promise<void> {
    await axios.post<Meeting>("/api/meetings", item, {
      baseURL: baseUrl,
    });
  }
  async delete(uuid: string): Promise<void> {
    
    await axios.delete(`/api/meetings/?uuid=${encodeURIComponent(uuid)}`, {
      baseURL: baseUrl,
    });
  }
  async put(item: Meeting): Promise<void> {
    await axios.put(`/api/meetings/${item.id}`, item, {
      baseURL: baseUrl,
    });
  }
}
