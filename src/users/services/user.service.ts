import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  public async create(user: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const dateNow = new Date().toISOString();

    const existUser = await this.findOneByEmail(user.email);

    if (existUser) {
      throw new BadRequestException(
        `User with email '${user.email}' already exist`,
      );
    }

    const newUser = new this.UserModel({
      ...user,
      userId: uuidv4(),
      createdAt: dateNow,
      updatedAt: dateNow,
      password: hashedPassword,
    });

    return newUser.save();
  }

  public async findOneByEmail(email: string) {
    const user = await this.UserModel.findOne({ email }).exec();

    if (!user) {
      return null;
    }

    return {
      name: user.name,
      userId: user.userId,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      password: user.password,
    };
  }
}
