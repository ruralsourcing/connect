import { User } from "./User";
import { IDataContext } from "../../data/types";
import axios from "axios";

export default class UserDataContext implements IDataContext<User> {
  async getAll(): Promise<User[]> {
    return axios
      .get<User[]>("/api/users?")
      .then((d) => d.data)
      .catch((e) => {
        console.log(e);
        return [];
      });
  }
  async get(id: string): Promise<User> {
    return axios
      .get<User>(`/api/users/${id}?_embed=skills&_expand=session`)
      .then((d) => d.data)
      .catch((e) => {
        console.log(e);
        return {} as User;
      });
  }
  async post(item: User): Promise<User> {
    return await axios.request<User>({
      url: "/api/users",
      method: "post",
      data: item,
    }).then(response => {
        return response.data
    })
  }
  async delete(id: string): Promise<void> {
    await axios.delete(`/api/users/${id}`);
  }
  async put(item: User): Promise<User> {
    return await axios.request({
      url: `/api/users/${item.id}`,
      data: item,
      method: "put",
    });
  }
}
