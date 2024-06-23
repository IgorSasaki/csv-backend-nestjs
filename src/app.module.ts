import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from './auth/auth.module'
import { UserModule } from './users/user.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/scalable-backend', {}),
    AuthModule,
    UserModule
  ]
})
export class AppModule {}
