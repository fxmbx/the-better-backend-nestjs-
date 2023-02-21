import { IBcryptService } from 'src/domain/adapter/hash.interface';
import {
  IJwtService,
  IJwtServicePayload,
} from 'src/domain/adapter/jwt.interface';
import { IQueueInterface } from 'src/domain/adapter/queue.interface';
import { ILogger } from 'src/domain/logger/logger.interface';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';

export class LoginUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtTokenService: IJwtService,
    private readonly userRepository: IUserRepository,
    private readonly bcryptService: IBcryptService,
    private readonly rabbitMqProvide: IQueueInterface,
  ) {}

  async getCookieWithJwtToken(username: string) {
    this.logger.log(
      'LoginUseCases execute',
      `The user ${username} have been logged.`,
    );
    const user = await this.userRepository.getUserByUsername(username);
    const payload: IJwtServicePayload = {
      username: username,
      userId: user.id,
      role: user.role,
    };
    const secret = 'secret-1';
    const expiresIn = '1800s';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
  }

  async getCookieWithJwtRefreshToken(username: string) {
    this.logger.log(
      'LoginUseCases execute',
      `The user ${username} have been logged.`,
    );
    const user = await this.userRepository.getUserByUsername(username);
    const payload: IJwtServicePayload = {
      username: username,
      userId: user.id,
      role: user.role,
    };
    const secret = 'secret-2';
    const expiresIn = '86400s';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    await this.setCurrentRefreshToken(token, username);
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}}`;
    return cookie;
  }

  async validateUserForLocalStragtegy(username: string, pass: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return null;
    }
    const match = await this.bcryptService.compareHash(user.password, pass);
    if (user && match) {
      await this.updateLoginTime(user.username);
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserForJWTStragtegy(username: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return null;
    }
    return user;
  }

  async updateLoginTime(username: string) {
    await this.userRepository.updateLastLogin(username);

    await this.rabbitMqProvide.publish('last_login', {
      username: username,
      action: 'last login',
      time: Date.now(),
    });
  }

  async setCurrentRefreshToken(refreshToken: string, username: string) {
    const currentHashedRefreshToken = await this.bcryptService.hashData(
      refreshToken,
    );
    await this.userRepository.updateRefreshToken(
      username,
      currentHashedRefreshToken,
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, username: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return null;
    }

    const isRefreshTokenMatching = await this.bcryptService.compareHash(
      user.hash_refresh_token,
      refreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }
}
