import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { formatDate } from '@project/shared';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly amqpConnection: AmqpConnection
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    await this.amqpConnection.publish(
      'typoteka.notify.income',
      'user.registered',
      {
        userId: 123123123,
        email: 234523452345,
      }
    );

    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User & { postCount: number }> {
    const user = await this.userModel.findById(id).lean().exec();
    if (!user) return null;

    const { data: postCount }: { data: number } = await axios.get(
      `${this.configService.get<string>(
        'POST_SERVICE_URL'
      )}/api/post/count?userId=${id}`
    );

    // @ts-expect-error it is okkkk
    return {
      ...user,
      postCount,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.userModel.findOne({ email }).exec();

    return data;
  }

  async findUsersByIds(userIds: string[]) {
    return await this.userModel.find({ _id: { $in: userIds } }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  @RabbitSubscribe({
    exchange: 'typoteka.notify.income',
    routingKey: 'user.registered',
    queue: 'notify_queue',
  })
  nnnnow(data) {
    console.log('какая nnnnow data:', data);
    // return { date: formatDate(new Date()) };
  }

  @RabbitSubscribe({
    exchange: 'typoteka.notify.income',
    routingKey: 'user.registered',
    queue: 'notify_queue',
  })
  now(data) {
    console.log('какая то data:', data);
    // return { date: formatDate(new Date()) };
  }
}
