import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_team_name', { unique: true })
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.teams, {
    onDelete: 'CASCADE',
  })
  users: User[];
}
