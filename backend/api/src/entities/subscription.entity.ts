import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  planName: string;

  @Column()
  status: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToOne(() => User, user => user.subscriptions)
  user: User;
}
