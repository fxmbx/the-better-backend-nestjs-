import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  IPaginationMeta,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { UserM, UserMWithPassword } from 'src/domain/model/user.model';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';
import { FindOptionsWhere, FindManyOptions, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async insert(data: UserMWithPassword): Promise<UserM> {
    const user = this.userRepository.create(data);
    const result = await this.userRepository.insert(user);
    console.log(result.generatedMaps[0]);
    return result.generatedMaps[0] as UserM;
  }

  async findById(id: number): Promise<UserM> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['campaigns'],
    });
    if (!user) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return user as UserM;
  }
  async getUserByID(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ id: id });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getUserByUsername(username: string): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ username: username });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateLastLogin(username: string): Promise<void> {
    await this.userRepository.update(
      {
        username: username,
      },
      { last_login: () => 'CURRENT_TIMESTAMP' },
    );
  }
  async updateRefreshToken(
    username: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userRepository.update(
      {
        username: username,
      },
      { hash_refresh_token: refreshToken },
    );
  }
  async paginate?(
    option: IPaginationOptions<IPaginationMeta>,
    searchOptions?: FindOptionsWhere<UserM> | FindManyOptions<UserM>,
  ): Promise<Pagination<UserM, IPaginationMeta>> {
    return await paginate(this.userRepository, option, searchOptions);
  }
}
