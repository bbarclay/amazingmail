import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Team } from './entities/team.entity';
import { Payment } from './entities/payment.entity';
import { ApiKey } from './entities/api-key.entity';
import { ConnectedAccount } from './entities/connected-account.entity';
import { Domain } from './entities/domain.entity';
import { Subscription } from './entities/subscription.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'myappuser',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'myappdb',
  entities: [User, Team, Payment, ApiKey, ConnectedAccount, Domain, Subscription],
  synchronize: false, // Use migrations instead
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: false,
  logging: true,
  cache: true,
  extra: {
    max: 10,
  },
};

export default ormconfig;

export const AppDataSource = new DataSource({
  ...ormconfig,
  migrations: ['src/migrations/**/*.ts'],
} as any);
