import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from './subscription.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel('Subscription')
    private readonly subscriptionModel: Model<Subscription>
  ) {}

  async subscribe(userId: string, targetUserId: string): Promise<Subscription> {
    const existingSubscription = await this.subscriptionModel.findOne({
      user: userId,
      subscribedTo: targetUserId,
    });

    if (existingSubscription) {
      throw new Error('User is already subscribed to this user');
    }

    const subscription = new this.subscriptionModel({
      user: userId,
      subscribedTo: targetUserId,
    });

    return subscription.save();
  }

  async unsubscribe(userId: string, targetUserId: string): Promise<void> {
    await this.subscriptionModel.deleteOne({
      user: userId,
      subscribedTo: targetUserId,
    });
  }

  async getSubscriptions(userId: string): Promise<Subscription[]> {
    return this.subscriptionModel.find({ user: userId });
  }

  async isSubscribed(userId: string, targetUserId: string): Promise<boolean> {
    const subscription = await this.subscriptionModel.findOne({
      user: userId,
      subscribedTo: targetUserId,
    });
    return !!subscription;
  }
}
