import { Repo } from '../Repo';
import { UserDataModel, UserAttributes, UserCreationAttributes } from "./UserDataModel";

export interface IUserRepo extends Repo<UserAttributes> {
    getUserById(id: string): Promise<UserAttributes>;
    addUser(user: UserAttributes): Promise<UserAttributes>;
}

export class UserRepo implements IUserRepo {
    getUserById(id: string): Promise<UserAttributes> {
        throw new Error("Method not implemented.");
    }
    addUser(user: UserCreationAttributes): Promise<UserAttributes> { 
        return UserDataModel.create(user)
    }
    exists(t: UserAttributes): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(t: UserAttributes): Promise<any> {
        throw new Error("Method not implemented.");
    }
    save(t: UserAttributes): Promise<any> {
        throw new Error("Method not implemented.");
    }
}