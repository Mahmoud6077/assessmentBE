import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './schemas/log.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async createLog(logDetails: {
    userId: string;
    action: string;
    ipAddress?: string;
    machineName?: string;
    operatingSystem?: string;
    userAgent?: string;
  }): Promise<Log> {
    const log = new this.logModel(logDetails);
    return log.save();
  }

  async getLogsByUser(userId: string): Promise<Log[]> {
    return this.logModel.find({ userId }).exec();
  }
}
