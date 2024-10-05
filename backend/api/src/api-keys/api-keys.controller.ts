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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
  async create(@Body() createApiKeyDto: CreateApiKeyDto, @Request() req) {
    return this.apiKeysService.create(createApiKeyDto, req.user.userId);
  }
}
