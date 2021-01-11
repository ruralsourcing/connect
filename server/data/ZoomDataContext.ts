import { ZoomAuth } from "@prisma/client";
import { IDataContext } from "./types";


export interface IZoomDataContext extends IDataContext<ZoomAuth> {}

export default class ZoomDataContext implements IZoomDataContext {
    getAll(): Promise<ZoomAuth[]> {
        throw new Error("Method not implemented.");
    }
    get(id: string): Promise<ZoomAuth | null> {
        throw new Error("Method not implemented.");
    }
    post(item: ZoomAuth): Promise<ZoomAuth> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<ZoomAuth> {
        throw new Error("Method not implemented.");
    }
    put(item: ZoomAuth): Promise<ZoomAuth> {
        throw new Error("Method not implemented.");
    }
    
}