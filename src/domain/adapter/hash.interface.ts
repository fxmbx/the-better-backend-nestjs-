export interface IBcryptService {
  hashData(date: string): Promise<string>;
  compareHash(hash: string, rawString: string): Promise<boolean>;
}
