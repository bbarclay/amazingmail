import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ConnectedAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: string;

  @Column()
  externalId: string;

  @Column('json')
  accountDetails: Record<string, any>;

  @ManyToOne(() => User, user => user.connectedAccounts)
  user: User;
}
