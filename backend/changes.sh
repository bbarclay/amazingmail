#!/bin/bash
# --------------------------------------------------------------
# Script: setup-enterprise-database.sh
# Description: Sets up the necessary modules, controllers,
#              services, entities, and migrations for an
#              enterprise-grade SaaS platform using NestJS,
#              PostgreSQL, and Stripe, incorporating best practices
#              for scalability, security, and maintainability.
# --------------------------------------------------------------

# Exit immediately if a command exits with a non-zero status
set -e

# Function to display messages
function echo_msg() {
  echo -e "\n==> $1\n"
}

# Navigate to the NestJS project directory
echo_msg "Navigating to the NestJS project directory..."
cd api

# Install necessary dependencies
echo_msg "Installing necessary dependencies..."
npm install --save @nestjs/typeorm typeorm pg
npm install --save @nestjs/jwt passport-jwt passport
npm install --save bcrypt
npm install --save class-validator class-transformer class-sanitizer
npm install --save stripe
npm install --save dotenv @nestjs/config
npm install --save @nestjs/passport
npm install --save helmet
npm install --save @nestjs/throttler
npm install --save @nestjs/mongoose mongoose
npm install --save @nestjs/platform-express
npm install --save @nestjs/core
npm install --save winston nest-winston
npm install --save @nestjs/terminus
npm install --save @nestjs/serve-static serve-static
npm install --save-dev @types/bcrypt @types/passport-jwt @types/express-rate-limit
npm install --save-dev jest @nestjs/testing @types/supertest supertest ts-jest

# Define the list of modules to create
MODULES=("auth" "users" "teams" "payments" "api-keys")

# Loop through each module and generate it along with its controller and service
for MODULE in "${MODULES[@]}"; do
  echo_msg "Generating module: $MODULE"
  nest generate module "$MODULE" --no-interactive

  echo_msg "Generating controller for: $MODULE"
  nest generate controller "$MODULE" --no-interactive

  echo_msg "Generating service for: $MODULE"
  nest generate service "$MODULE" --no-interactive
done

# Create a directory for entities if it doesn't exist
echo_msg "Creating 'entities' directory..."
mkdir -p src/entities

# Create the BaseEntity with shared properties
echo_msg "Creating BaseEntity..."
cat <<EOF > src/entities/base.entity.ts
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
EOF

# Create the User entity with composite index and cascading rules
echo_msg "Creating User entity..."
cat <<EOF > src/entities/user.entity.ts
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
EOF

# Create the Team entity with cascading rules
echo_msg "Creating Team entity..."
cat <<EOF > src/entities/team.entity.ts
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
EOF

# Create the Payment entity with cascading rules
echo_msg "Creating Payment entity..."
cat <<EOF > src/entities/payment.entity.ts
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
EOF

# Create the ApiKey entity with cascading rules
echo_msg "Creating ApiKey entity..."
cat <<EOF > src/entities/api-key.entity.ts
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
EOF

# Create TypeORM configuration file with connection pool options and caching
echo_msg "Creating TypeORM configuration file..."
cat <<EOF > src/ormconfig.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Team } from './entities/team.entity';
import { Payment } from './entities/payment.entity';
import { ApiKey } from './entities/api-key.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'myappuser',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'myappdb',
  entities: [User, Team, Payment, ApiKey],
  synchronize: false, // Use migrations instead
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: false,
  logging: true,
  cache: true,
  extra: {
    max: 10, // connection pool size
  },
};

export = ormconfig;
EOF

# Update app.module.ts to use the new ormconfig
echo_msg "Updating app.module.ts..."
cat <<EOF > src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { PaymentsModule } from './payments/payments.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    UsersModule,
    TeamsModule,
    PaymentsModule,
    ApiKeysModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
EOF

# Create logging interceptor
echo_msg "Creating logging interceptor..."
mkdir -p src/common/interceptors
cat <<EOF > src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        this.logger.info(\`\${request.method} \${request.url}\`, {
          timestamp: new Date().toISOString(),
          responseTime: \`\${Date.now() - now}ms\`,
          statusCode: response.statusCode,
        });
      }),
    );
  }
}
EOF

# Create global exception filter
echo_msg "Creating global exception filter..."
mkdir -p src/common/filters
cat <<EOF > src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
    }

    this.logger.error(\`Status: \${statusCode} Error: \${message}\`);

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
EOF

# Create DTO base class to reduce redundancy
echo_msg "Creating base DTO class..."
mkdir -p src/common/dto
cat <<EOF > src/common/dto/base-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class BaseUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
EOF

# Create DTOs for registration and login using base class
echo_msg "Creating DTOs for registration and login..."
mkdir -p src/auth/dto

# Register DTO
cat <<EOF > src/auth/dto/register.dto.ts
import { BaseUserDto } from '../../common/dto/base-user.dto';

export class RegisterDto extends BaseUserDto {}
EOF

# Login DTO
cat <<EOF > src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
EOF

# Create Auth Controller with API versioning and rate limiting
echo_msg "Updating Auth controller with registration and login endpoints..."
cat <<EOF > src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('v1/auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle(5, 60)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Throttle(10, 60)
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { access_token: token };
  }

  @Put('password-reset')
  async resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    return this.authService.resetPassword(passwordResetDto);
  }
}
EOF

# Create Auth Service with input sanitization and error handling
echo_msg "Updating Auth service with registration and login logic..."
cat <<EOF > src/auth/auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetDto } from './dto/password-reset.dto';
import { plainToClass } from 'class-transformer';
import { sanitize } from 'class-sanitizer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const sanitizedDto = plainToClass(RegisterDto, registerDto);
    sanitize(sanitizedDto);
    const { email, password } = sanitizedDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<string | null> {
    const sanitizedDto = plainToClass(LoginDto, loginDto);
    sanitize(sanitizedDto);
    const { email, password } = sanitizedDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email, sub: user.id };
      return this.jwtService.sign(payload);
    }
    return null;
  }

  async resetPassword(passwordResetDto: PasswordResetDto): Promise<void> {
    const sanitizedDto = plainToClass(PasswordResetDto, passwordResetDto);
    sanitize(sanitizedDto);
    const { email, newPassword } = sanitizedDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await this.usersRepository.save(user);
      // Optionally, send a confirmation email here
    } else {
      throw new BadRequestException('User not found');
    }
  }
}
EOF

# Create Password Reset DTO
echo_msg "Creating Password Reset DTO..."
cat <<EOF > src/auth/dto/password-reset.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { sanitize } from 'class-sanitizer';

export class PasswordResetDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
EOF

# Create Stripe Payments setup with API versioning
echo_msg "Setting up Stripe Payments integration..."
mkdir -p src/payments/dto

# Create Payment DTO
cat <<EOF > src/payments/dto/create-payment.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  stripePaymentId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;
}
EOF

# Update Payments Controller with create and get endpoints
echo_msg "Updating Payments controller..."
cat <<EOF > src/payments/payments.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/payments')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async findAll(@Request() req) {
    return this.paymentsService.findAll(req.user.userId);
  }

  @Post()
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req,
  ) {
    return this.paymentsService.create(createPaymentDto, req.user.userId);
  }
}
EOF

# Update Payments Service with create and findAll methods
echo_msg "Updating Payments service..."
cat <<EOF > src/payments/payments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(userId: string): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      loadEagerRelations: false,
    });
  }

  async create(
    createPaymentDto: CreatePaymentDto,
    userId: string,
  ): Promise<Payment> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const payment = this.paymentsRepository.create({
      ...createPaymentDto,
      user,
    });
    return this.paymentsRepository.save(payment);
  }
}
EOF

# Create API Key Management setup with API versioning
echo_msg "Setting up API Key Management..."
mkdir -p src/api-keys/dto

# Create API Key DTO
cat <<EOF > src/api-keys/dto/create-api-key.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateApiKeyDto {
  @IsNotEmpty()
  @IsString()
  description: string;
}
EOF

# Update API Keys Controller with create and get endpoints
echo_msg "Updating API Keys controller..."
cat <<EOF > src/api-keys/api-keys.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/api-keys')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get()
  async findAll(@Request() req) {
    return this.apiKeysService.findAll(req.user.userId);
  }

  @Post()
  async create(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @Request() req,
  ) {
    return this.apiKeysService.create(createApiKeyDto, req.user.userId);
  }
}
EOF

# Update API Keys Service with create and findAll methods
echo_msg "Updating API Keys service..."
cat <<EOF > src/api-keys/api-keys.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../entities/api-key.entity';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { User } from '../entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeysRepository: Repository<ApiKey>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(userId: string): Promise<ApiKey[]> {
    return this.apiKeysRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      loadEagerRelations: false,
    });
  }

  async create(
    createApiKeyDto: CreateApiKeyDto,
    userId: string,
  ): Promise<ApiKey> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const apiKey = this.apiKeysRepository.create({
      ...createApiKeyDto,
      key: this.generateApiKey(),
      user,
    });
    return this.apiKeysRepository.save(apiKey);
  }

  private generateApiKey(): string {
    return 'key_' + crypto.randomBytes(32).toString('hex');
  }
}
EOF

# Setup Team Management endpoints with API versioning
echo_msg "Setting up Team Management endpoints..."
mkdir -p src/teams/dto

# Create Team DTO
cat <<EOF > src/teams/dto/create-team.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
EOF

# Update Teams Controller with create and get endpoints
echo_msg "Updating Teams controller..."
cat <<EOF > src/teams/teams.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/teams')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll(@Request() req) {
    return this.teamsService.findAll(req.user.userId);
  }

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    return this.teamsService.create(createTeamDto, req.user.userId);
  }
}
EOF

# Update Teams Service with create and findAll methods
echo_msg "Updating Teams service..."
cat <<EOF > src/teams/teams.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(userId: string): Promise<Team[]> {
    return this.teamsRepository
      .createQueryBuilder('team')
      .innerJoin('team.users', 'user', 'user.id = :userId', { userId })
      .getMany();
  }

  async create(
    createTeamDto: CreateTeamDto,
    userId: string,
  ): Promise<Team> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    const team = this.teamsRepository.create({
      name: createTeamDto.name,
      users: [user],
    });
    return this.teamsRepository.save(team);
  }
}
EOF

# Organize migrations into folders
echo_msg "Organizing migrations into folders..."
mkdir -p src/migrations/initial
mkdir -p src/migrations/version_1

# Compile TypeScript files before generating migrations
echo_msg "Compiling TypeScript files..."
npm run build

# Generate initial TypeORM migration
echo_msg "Generating initial TypeORM migration..."
npx typeorm -d dist/ormconfig.js migration:generate src/migrations/initial/InitialSchema -o

# Run the migrations with rollback capabilities
echo_msg "Running migrations..."
npx typeorm -d dist/ormconfig.js migration:run

# Create .env.example file
echo_msg "Creating .env.example file..."
cat <<EOF > .env.example
# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=myappuser
DB_PASSWORD=password
DB_DATABASE=myappdb

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
EOF

echo_msg "Please copy '.env.example' to '.env' and update it with your actual credentials."

# Create basic Dockerfile
echo_msg "Creating Dockerfile..."
cat <<EOF > Dockerfile
# Use the official NestJS image as base
FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --only=production

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD [ "node", "dist/main.js" ]
EOF

# Create docker-compose.yml
echo_msg "Creating docker-compose.yml..."
cat <<EOF > docker-compose.yml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - db
  db:
    image: postgres:13
    environment:
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: \${DB_DATABASE}
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
EOF

echo_msg "Enterprise project setup is complete! 🎉"