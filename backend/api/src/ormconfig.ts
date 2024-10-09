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

// Disable SSL certificate validation for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = process.env.POSTGRES_URL || 'postgres://postgres.dhqexsiedzedcbghkdzc:368doXSAQW2vGQlt@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x';

const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: connectionString,
  entities: [User, Team, Payment, ApiKey, ConnectedAccount, Domain, Subscription],
  synchronize: false,
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: false,
  logging: true,
  ssl: {
    rejectUnauthorized: false
  },
};

export default ormconfig;

export const AppDataSource = new DataSource({
  ...ormconfig,
  migrations: ['src/migrations/**/*.ts'],
} as any);
