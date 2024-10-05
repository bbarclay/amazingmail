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
