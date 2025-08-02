import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private emailService: EmailService,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async create(userData: Partial<User>): Promise<User> {
    const emailVerificationToken = this.generateEmailToken();
    const user = new this.userModel({
      ...userData,
      emailVerificationToken,
      isEmailVerified: false,
    });
    const savedUser = await user.save();
    await this.emailService.sendVerificationEmail(
      user.email,
      emailVerificationToken,
    );
    return savedUser;
  }
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }
  private generateEmailToken(): string {
    return randomBytes(32).toString('hex');
  }

  async findOne(token: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({
      emailVerificationToken: token,
    });
    return user;
  }
}
