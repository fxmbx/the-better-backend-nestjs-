export interface IQueueInterface {
  publish(topic: string, messgae: any): Promise<void>;
}
