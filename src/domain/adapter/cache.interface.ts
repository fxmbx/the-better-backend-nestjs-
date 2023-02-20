export interface ICacheService {
  get<T>(key: string): Promise<T>;
  set<T>(key: string, value: T, option?: number): Promise<void>;
  delete(key: string): Promise<void>;
}
