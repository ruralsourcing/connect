import { Meeting } from "../lib/MeetingManager/Meeting";
import { IDataContext } from "./types";
import axios from "axios";

const baseUrl = process.env.API_BASE_URL
export default class MeetingContext implements IDataContext<Meeting> {
    
  getAll(): Promise<Meeting[]> {
    return axios.get<Meeting[]>("/api/meetings", {
        baseURL: baseUrl
    }).then(d => d.data).catch(e => {
        console.log(e);
        return [];
    });
  }
  get(id: string): Promise<Meeting> {
    return axios.get<Meeting>(`/api/meetings/${id}`).then(d => d.data);
  }
  post(item: Meeting): void {
    throw new Error("Method not implemented.");
  }
  delete(id: string): void {
    throw new Error("Method not implemented.");
  }
  put(item: Meeting): void {
    throw new Error("Method not implemented.");
  }
}
