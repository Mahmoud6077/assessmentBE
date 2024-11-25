import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), // Makes the ConfigModule global
    (() => {
      console.log('Database URI:', process.env.MONGO_URI);
      return MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/defaultDb');
    })(),
    MailerModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}


// MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb+srv://hamoodalking8:os30iVa4AnaPwiAu@cluster1.vj93e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1'), // Use environment variable