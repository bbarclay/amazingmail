import { Injectable } from '@nestjs/common';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}

  async createCampaign(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const campaign = this.campaignRepository.create(createCampaignDto);
    return this.campaignRepository.save(campaign);
  }

  async getCampaignById(id: string): Promise<Campaign> {
return this.campaignRepository.findOne({ where: { id } });
  }

  async updateCampaign(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
const campaign = await this.campaignRepository.findOne({ where: { id } });
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    Object.assign(campaign, updateCampaignDto);
    return this.campaignRepository.save(campaign);
  }

  async deleteCampaign(id: string): Promise<void> {
    await this.campaignRepository.delete(id);
  }

  async listCampaigns(): Promise<Campaign[]> {
    return this.campaignRepository.find();
  }
}
