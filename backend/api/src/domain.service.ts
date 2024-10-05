
import { Injectable } from '@nestjs/common';
import { Domain } from './entities/domain.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

@Injectable()
export class DomainService {
  constructor(
    @InjectRepository(Domain)
    private domainRepository: Repository<Domain>,
  ) {}

  async createDomain(createDomainDto: CreateDomainDto): Promise<Domain> {
    const domain = this.domainRepository.create(createDomainDto);
    return this.domainRepository.save(domain);
  }

  async getDomains(): Promise<Domain[]> {
    return this.domainRepository.find();
  }

  async updateDomain(id: string, updateDomainDto: UpdateDomainDto): Promise<Domain> {
    await this.domainRepository.update(id, updateDomainDto);
    return this.domainRepository.findOne(id);
  }

  async deleteDomain(id: string): Promise<void> {
    await this.domainRepository.delete(id);
  }
}
