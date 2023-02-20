import { UserRoleEnum } from 'src/domain/enum/user.role.enum';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { Campaign } from './campaign.entity';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ type: 'varchar', name: 'first_name', length: 255 })
  first_name: string;

  @Column({ type: 'varchar', name: 'last_name', length: 255 })
  last_name: string;

  @Column({
    type: 'varchar',
    name: 'username',
    length: 255,
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({ type: 'varchar', name: 'password' })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.REGULARUSER,
  })
  role: UserRoleEnum;

  @Column({ nullable: true })
  last_login?: Date;

  @Column('varchar', { nullable: true })
  hash_refresh_token: string;

  @OneToMany(() => Campaign, (campaign) => campaign.owner)
  @JoinColumn()
  campaigns: Campaign[];

  // @BeforeInsert()
  // async hashPassword() {
  //   this.password = await this.hash.hashData(this.password);
  // }
}
