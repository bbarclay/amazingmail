
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
import { BillingService } from './billing.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('v1/billing')
@ApiTags('Billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('subscriptions')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Subscription created successfully.' })
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = await this.billingService.createSubscription(createSubscriptionDto);
    return { message: 'Subscription created successfully', subscription };
  }

  @Get('subscriptions')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Retrieve all subscriptions.' })
  async getSubscriptions() {
    const subscriptions = await this.billingService.getSubscriptions();
    return { subscriptions };
  }

  @Put('subscriptions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Subscription updated successfully.' })
  async updateSubscription(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    const subscription = await this.billingService.updateSubscription(id, updateSubscriptionDto);
    return { message: 'Subscription updated successfully', subscription };
  }

  @Delete('subscriptions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Subscription deleted successfully.' })
  async deleteSubscription(@Param('id') id: string) {
    await this.billingService.deleteSubscription(id);
    return { message: 'Subscription deleted successfully' };
  }

  @Get('payments')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Retrieve all payments.' })
  async getPayments() {
    const payments = await this.billingService.getPayments();
    return { payments };
  }
}
