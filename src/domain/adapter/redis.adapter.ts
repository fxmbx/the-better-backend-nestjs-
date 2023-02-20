export interface IRedisIoAdapter {
  createIOServer(port: number): any;
}
