
import {
  Controller,
  Put,
  Delete,
  Body,
  Param,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiKeyDto } from './dto/api-key.dto';
import { ConnectedAccountDto } from './dto/connected-account.dto';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    const user = await this.userService.updateProfile(updateProfileDto);
    return { message: 'Profile updated successfully', user };
  }

  @Post('api-keys')
  @HttpCode(HttpStatus.CREATED)
  async createApiKey(@Body() apiKeyDto: ApiKeyDto) {
    const apiKey = await this.userService.createApiKey(apiKeyDto);
    return { message: 'API key created successfully', apiKey };
  }

  @Post('connected-accounts')
  @HttpCode(HttpStatus.CREATED)
  async addConnectedAccount(@Body() connectedAccountDto: ConnectedAccountDto) {
    const account = await this.userService.addConnectedAccount(connectedAccountDto);
    return { message: 'Connected account added successfully', account };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@Param('id') id: string) {
    await this.userService.deleteAccount(id);
    return { message: 'Account deleted successfully' };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    return { user };
  }

  @Get(':id/connected-accounts')
  @HttpCode(HttpStatus.OK)
  async getConnectedAccounts(@Param('id') id: string) {
    const accounts = await this.userService.getConnectedAccounts(id);
    return { accounts };
  }

}
