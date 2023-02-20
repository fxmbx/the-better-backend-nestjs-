import { HttpException, HttpStatus } from '@nestjs/common';
import { IBcryptService } from 'src/domain/adapter/hash.interface';
import { IUseCaseResponse } from 'src/domain/adapter/use.case.response.interface';
import { ILogger } from 'src/domain/logger/logger.interface';
import { UserMWithPassword } from 'src/domain/model/user.model';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';

export class RegisterUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: IUserRepository,
    private readonly bcrypt: IBcryptService,
  ) {}

  async createUserUseCase(data: UserMWithPassword): Promise<IUseCaseResponse> {
    const userExist = await this.userRepository.getUserByUsername(
      data.username,
    );
    if (userExist) {
      this.logger.warn('createUserUseCase execute', 'UserName exist');

      throw new HttpException('User Name Taken', HttpStatus.CONFLICT);
    }
    data.password = await this.bcrypt.hashData(data.password);
    const result = await this.userRepository.insert(data);
    this.logger.log('createUserUseCase execute', 'New User inserted');
    return {
      data: {
        message: 'user created',
        data: result,
      },
    };
  }
}
