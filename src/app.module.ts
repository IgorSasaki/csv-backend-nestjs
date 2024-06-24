import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { CsvModule } from './csv/csv.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
      },
    }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
      },
    }),
    CsvModule,
    AuthModule,
    WebSocketModule,
  ],
})
export class AppModule {}
