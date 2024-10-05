import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { Team } from './team.entity';
import { ApiKey } from './api-key.entity';
import { Payment } from './payment.entity';
import { BaseEntity } from './base.entity';

@Entity()
@Index(['email', 'resetPasswordToken'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_user_email', { unique: true })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ nullable: true })
  resetPasswordExpires?: Date;

  @ManyToMany(() => Team, (team) => team.users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  teams: Team[];

  @OneToMany(() => ApiKey, (apiKey) => apiKey.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  apiKeys: ApiKey[];

  @OneToMany(() => Payment, (payment) => payment.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  payments: Payment[];
}
