import { Controller, Post, Delete, Param, Get } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // эндпоинты для подписки и отписки
}
