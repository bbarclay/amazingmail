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
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Controller('v1/leads')
@ApiTags('Leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Lead created successfully.' })
  async createLead(@Body() createLeadDto: CreateLeadDto) {
    const lead = await this.leadService.createLead(createLeadDto);
    return { message: 'Lead created successfully', lead };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Retrieve lead by ID.' })
  async getLeadById(@Param('id') id: string) {
    const lead = await this.leadService.getLeadById(id);
    return { lead };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Lead updated successfully.' })
  async updateLead(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    const lead = await this.leadService.updateLead(id, updateLeadDto);
    return { message: 'Lead updated successfully', lead };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Lead deleted successfully.' })
  async deleteLead(@Param('id') id: string) {
    await this.leadService.deleteLead(id);
    return { message: 'Lead deleted successfully' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'List all leads.' })
  async listLeads() {
    const leads = await this.leadService.listLeads();
    return { leads };
  }
}
