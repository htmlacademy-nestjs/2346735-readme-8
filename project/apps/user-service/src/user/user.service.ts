import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Model } from 'mongoose';

import { User } from './user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly amqpConnection: AmqpConnection
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);

      await this.amqpConnection.publish(
        this.configService.get<string>('RABBIT_EXCHANGE'),
        'user.create',
        createdUser
      );

      return await createdUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          'Пользователь с таким email уже существует'
        );
      }
      throw new InternalServerErrorException('Не удалось создать пользователя');
    }
  }

  async findAll(): Promise<User[]> {
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
}
