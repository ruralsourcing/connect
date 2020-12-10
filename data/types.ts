export interface IDataContext<T> {
    getAll(): Promise<T[]>;
    get(id: string): Promise<T>;
    post(item: T): Promise<T>;
    delete(id: string): void;
    put(item: T): Promise<T>;
}