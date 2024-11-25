import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Automatically add createdAt and updatedAt
export class Log extends Document {
  @Prop({ required: true })
  userId: string; // Reference to the User ID

  @Prop({ required: true })
  action: string; // 'login' or 'logout'

  @Prop()
  ipAddress: string; // User's IP address

  @Prop()
  machineName: string; // User's machine name (if available)

  @Prop()
  operatingSystem: string; // User's operating system (if available)

  @Prop()
  userAgent: string; // Browser or device user agent
}

export const LogSchema = SchemaFactory.createForClass(Log);
