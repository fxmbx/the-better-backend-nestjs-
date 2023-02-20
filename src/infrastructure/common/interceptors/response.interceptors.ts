import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IPaginationMeta } from 'nestjs-typeorm-paginate';
import { map, Observable } from 'rxjs';

export class ResponseFormat<T> {
  @ApiProperty()
  status: boolean;
  @ApiProperty()
  metadata?: IPaginationMeta;
  @ApiProperty()
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: true,
        data: data?.data,
        metadata: data?.metadata,
      })),
    );
  }
}
