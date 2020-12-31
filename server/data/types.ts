export interface IDataContext<T, U> {
    getAll(): Promise<T[]>;
    get(id: string): Promise<T | null>;
    post(item: U): Promise<T>;
    delete(id: string): void;
    put(item: T): Promise<T>;
}