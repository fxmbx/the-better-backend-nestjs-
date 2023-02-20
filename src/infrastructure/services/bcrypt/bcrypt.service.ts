import { Injectable } from '@nestjs/common';
import { IBcryptService } from 'src/domain/adapter/hash.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements IBcryptService {
  async hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, bcrypt.genSaltSync(10));
  }
  async compareHash(hash: string, rawString: string): Promise<boolean> {
    return await bcrypt.compare(rawString, hash);
  }
}
