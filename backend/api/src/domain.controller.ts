
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
import { DomainService } from './domain.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

@Controller('v1/domains')
@ApiTags('Domains')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Domain created successfully.' })
  async createDomain(@Body() createDomainDto: CreateDomainDto) {
    const domain = await this.domainService.createDomain(createDomainDto);
    return { message: 'Domain created successfully', domain };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Retrieve all domains.' })
  async getDomains() {
    const domains = await this.domainService.getDomains();
    return { domains };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Domain updated successfully.' })
  async updateDomain(@Param('id') id: string, @Body() updateDomainDto: UpdateDomainDto) {
    const domain = await this.domainService.updateDomain(id, updateDomainDto);
    return { message: 'Domain updated successfully', domain };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Domain deleted successfully.' })
  async deleteDomain(@Param('id') id: string) {
    await this.domainService.deleteDomain(id);
    return { message: 'Domain deleted successfully' };
  }
}
