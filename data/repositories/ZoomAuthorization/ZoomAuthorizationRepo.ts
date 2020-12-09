import { Repo } from "../Repo";
import {
  ZoomAuthorizationAttributes,
  ZoomAuthorizationCreationAttributes,
  ZoomAuthorizationDataModel,
} from "./ZoomAuthorizationDataModel";

export interface IZoomAuthorizationRepo
  extends Repo<ZoomAuthorizationAttributes> {
  addAuthorization(
    user: ZoomAuthorizationCreationAttributes
  ): Promise<ZoomAuthorizationAttributes>;
}

export class ZoomAuthorizationRepo implements IZoomAuthorizationRepo {
  addAuthorization(auth: ZoomAuthorizationCreationAttributes): Promise<ZoomAuthorizationAttributes> {
    return ZoomAuthorizationDataModel.create(auth);
  }
  exists(t: ZoomAuthorizationAttributes): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(t: ZoomAuthorizationAttributes): Promise<any> {
    throw new Error("Method not implemented.");
  }
  save(t: ZoomAuthorizationAttributes): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
