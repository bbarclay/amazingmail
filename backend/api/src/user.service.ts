
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { ApiKey } from './entities/api-key.entity';
import { ConnectedAccount } from './entities/connected-account.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiKeyDto } from './dto/api-key.dto';
import { ConnectedAccountDto } from './dto/connected-account.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>,
    @InjectRepository(ConnectedAccount)
    private connectedAccountRepository: Repository<ConnectedAccount>,
  ) {}

  async updateProfile(updateProfileDto: UpdateProfileDto): Promise<User> {
const user = await this.userRepository.findOne({ where: { id: updateProfileDto.id } });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updateProfileDto);
    return this.userRepository.save(user);
  }

  async createApiKey(apiKeyDto: ApiKeyDto): Promise<ApiKey> {
    const apiKey = this.apiKeyRepository.create(apiKeyDto);
    return this.apiKeyRepository.save(apiKey);
  }

  async addConnectedAccount(connectedAccountDto: ConnectedAccountDto): Promise<ConnectedAccount> {
    const account = this.connectedAccountRepository.create(connectedAccountDto);
    return this.connectedAccountRepository.save(account);
  }

  async deleteAccount(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

async getUserById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async getConnectedAccounts(userId: string): Promise<ConnectedAccount[]> {
return this.connectedAccountRepository.find({ where: { user: { id: userId } } });
  }

}
