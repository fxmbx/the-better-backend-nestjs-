import { User } from 'src/infrastructure/entities/user.entity';
import { UserM, UserMWithPassword } from '../model/user.model';

export interface IUserRepository {
  getUserByUsername(username: string): Promise<User>;
  updateLastLogin(username: string): Promise<void>;
  updateRefreshToken(username: string, refreshToken: string): Promise<void>;
  insert(data: UserMWithPassword): Promise<UserM>;
}
