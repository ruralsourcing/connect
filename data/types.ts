export interface IDataContext<T> {
    getAll(): Promise<T[]>;
    get(id: string): Promise<T>;
    post(item: T): void;
    delete(id: string): void;
    put(item: T): void;
}