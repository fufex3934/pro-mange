import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel({
      ...userData,
      emailVerificationToken: this.generateEmailToken(),
      isEmailVerified: false,
    });
    const savedUser = await user.save();
    //TODO: send email here
    return savedUser;
  }
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }
  private generateEmailToken(): string {
    return randomBytes(32).toString('hex');
  }
}
