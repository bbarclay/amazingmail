import { Injectable } from '@nestjs/common';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async createLead(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepository.create(createLeadDto);
    return this.leadRepository.save(lead);
  }

  async getLeadById(id: string): Promise<Lead> {
return this.leadRepository.findOne({ where: { id } });
  }

  async updateLead(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
const lead = await this.leadRepository.findOne({ where: { id } });
    if (!lead) {
      throw new Error('Lead not found');
    }
    Object.assign(lead, updateLeadDto);
    return this.leadRepository.save(lead);
  }

  async deleteLead(id: string): Promise<void> {
    await this.leadRepository.delete(id);
  }

  async listLeads(): Promise<Lead[]> {
    return this.leadRepository.find();
  }
}
