import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { User } from './user.entity';

@Entity('campaign')
export class Campaign extends AbstractEntity {
  @Column({
    type: 'varchar',
    unique: true,
    name: 'titie',
    length: '50',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    unique: true,
    name: 'description',
    length: '255',
    nullable: false,
  })
  description: string;

  @Column({ type: 'varchar', unique: true, name: 'file_url', nullable: false })
  file_url: string;

  @ManyToOne(() => User, (user) => user.campaigns)
  owner: User;
}
