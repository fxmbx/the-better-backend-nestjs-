import { UserRoleEnum } from '../enum/user.role.enum';

export class UserM {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  role?: UserRoleEnum;
  hash_refresh_token?: string;
  last_login?: Date;
}

export class UserMWithPassword extends UserM {
  password: string;
}
