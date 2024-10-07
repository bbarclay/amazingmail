
import {
  Controller,
  Put,
  Delete,
  Body,
  Param,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiKeyDto } from './dto/api-key.dto';
import { ConnectedAccountDto } from './dto/connected-account.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    const user = await this.userService.updateProfile(updateProfileDto);
    return { message: 'Profile updated successfully', user };
  }

  @Post('api-keys')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create API key' })
  @ApiResponse({ status: 201, description: 'API key created successfully' })
  async createApiKey(@Body() apiKeyDto: ApiKeyDto) {
    const apiKey = await this.userService.createApiKey(apiKeyDto);
    return { message: 'API key created successfully', apiKey };
  }

  @Post('connected-accounts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add connected account' })
  @ApiResponse({ status: 201, description: 'Connected account added successfully' })
  async addConnectedAccount(@Body() connectedAccountDto: ConnectedAccountDto) {
    const account = await this.userService.addConnectedAccount(connectedAccountDto);
    return { message: 'Connected account added successfully', account };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 204, description: 'Account deleted successfully' })
  @ApiParam({ name: 'id', type: 'string' })
  async deleteAccount(@Param('id') id: string) {
    await this.userService.deleteAccount(id);
    return { message: 'Account deleted successfully' };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiParam({ name: 'id', type: 'string' })
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    return { user };
  }

  @Get(':id/connected-accounts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get connected accounts for user' })
  @ApiResponse({ status: 200, description: 'Connected accounts retrieved successfully' })
  @ApiParam({ name: 'id', type: 'string' })
  async getConnectedAccounts(@Param('id') id: string) {
    const accounts = await this.userService.getConnectedAccounts(id);
    return { accounts };
  }

  @Post(':id/profile-image')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload profile image' })
  @ApiResponse({ status: 200, description: 'Profile image uploaded successfully' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const user = await this.userService.uploadProfileImage(id, file.buffer, file.originalname);
    return { message: 'Profile image uploaded successfully', user };
  }
}

