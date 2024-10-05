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
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_payment_stripe_id', { unique: true })
  @Column({ unique: true })
  stripePaymentId: string;

  @Column('decimal')
  amount: number;

  @Column({ length: 10 })
  currency: string;

  @ManyToOne(() => User, (user) => user.payments, {
    onDelete: 'SET NULL',
  })
  user: User;
}
