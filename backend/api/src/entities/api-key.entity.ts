import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class ApiKey extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_api_key_key', { unique: true })
  @Column({ unique: true })
  key: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.apiKeys, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ default: true })
  active: boolean;
}
