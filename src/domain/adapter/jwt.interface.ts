export interface IJwtServicePayload {
  username: string;
  userId: number;
  role: string;
}

export interface IJwtService {
  checkToken(token: string): Promise<any>;
  createToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string;
}
