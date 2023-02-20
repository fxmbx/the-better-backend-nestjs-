import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './base.entity';

@Entity('cats')
export class Cats extends AbstractEntity {
  @Column({ type: 'varchar', nullable: false, unique: false })
  name: string;

  @Column({ type: 'integer', nullable: false })
  age: number;

  @Column({ type: 'varchar', nullable: false })
  breed: string;
}
