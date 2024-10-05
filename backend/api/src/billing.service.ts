
import { Injectable } from '@nestjs/common';
import { Subscription } from './entities/subscription.entity';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const subscription = this.subscriptionRepository.create(createSubscriptionDto);
    return this.subscriptionRepository.save(subscription);
  }

  async getSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionRepository.find();
  }

  async updateSubscription(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    await this.subscriptionRepository.update(id, updateSubscriptionDto);
    return this.subscriptionRepository.findOne(id);
  }

  async deleteSubscription(id: string): Promise<void> {
    await this.subscriptionRepository.delete(id);
  }

  async getPayments(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }
}
