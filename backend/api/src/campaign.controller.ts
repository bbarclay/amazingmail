import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Controller('v1/campaigns')
@ApiTags('Campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Campaign created successfully.' })
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    const campaign = await this.campaignService.createCampaign(createCampaignDto);
    return { message: 'Campaign created successfully', campaign };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Retrieve campaign by ID.' })
  async getCampaignById(@Param('id') id: string) {
    const campaign = await this.campaignService.getCampaignById(id);
    return { campaign };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Campaign updated successfully.' })
  async updateCampaign(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    const campaign = await this.campaignService.updateCampaign(id, updateCampaignDto);
    return { message: 'Campaign updated successfully', campaign };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Campaign deleted successfully.' })
  async deleteCampaign(@Param('id') id: string) {
    await this.campaignService.deleteCampaign(id);
    return { message: 'Campaign deleted successfully' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'List all campaigns.' })
  async listCampaigns() {
    const campaigns = await this.campaignService.listCampaigns();
    return { campaigns };
  }
}
