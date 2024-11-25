import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

   // Method to get and log indexes
  async getIndexes() {
    const indexes = await this.userModel.collection.indexes();
    console.log('Indexes:', indexes); // This will print the indexes to the terminal
    return indexes; // Optionally return the indexes to the caller
  }

  
async create(createUserDto: CreateUserDto): Promise<User> {
  try {
    console.log('Incoming data:', createUserDto); // Log the incoming request data

    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return await user.save();
  } catch (error) {
    // Safely cast error to 'Error' type to access 'message'
    if (error instanceof Error) {
      console.error('Error in create method:', error.message);
      throw new Error(error.message || 'Failed to create user');
    }
    // Handle unexpected non-Error objects
    console.error('Unknown error:', error);
    throw new Error('An unexpected error occurred');
  }
}


  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    return user || undefined;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async updateIsActive(userId: string, isActive: boolean): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { isActive }).exec();
  }

  async updateLastLoggedIn(userId: string): Promise<void> {
    await this.userModel
      .updateOne({ _id: userId }, { lastLoggedIn: new Date() })
      .exec();
  }

  async generateResetToken(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // Check if the token is not expired
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }
}
