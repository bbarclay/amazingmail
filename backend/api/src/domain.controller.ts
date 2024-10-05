
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
import { DomainService } from './domain.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

@Controller('v1/domains')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDomain(@Body() createDomainDto: CreateDomainDto) {
    const domain = await this.domainService.createDomain(createDomainDto);
    return { message: 'Domain created successfully', domain };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getDomains() {
    const domains = await this.domainService.getDomains();
    return { domains };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateDomain(@Param('id') id: string, @Body() updateDomainDto: UpdateDomainDto) {
    const domain = await this.domainService.updateDomain(id, updateDomainDto);
    return { message: 'Domain updated successfully', domain };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDomain(@Param('id') id: string) {
    await this.domainService.deleteDomain(id);
    return { message: 'Domain deleted successfully' };
  }
}
