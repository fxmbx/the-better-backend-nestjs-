export interface IFormatExceptionMessage {
  message: string;
  status: boolean;
}

export interface IException {
  badRequestException(data: IFormatExceptionMessage): void;
  internalServerErrorException(data?: IFormatExceptionMessage): void;
  forbiddenException(data?: IFormatExceptionMessage): void;
  unauthorizedException(data?: IFormatExceptionMessage): void;
  notFoundException(data?: IFormatExceptionMessage): void;
}
