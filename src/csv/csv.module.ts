import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'

import { WebSocketModule } from '../websocket/websocket.module'
import { CsvController } from './controllers/csv.controller'
import { CsvProcessor } from './processors/csv.processor'
import { CsvService } from './services/csv.service'

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads'
    }),
    BullModule.registerQueue({
      name: 'csv'
    }),
    WebSocketModule
  ],
  controllers: [CsvController],
  providers: [CsvService, CsvProcessor]
})
export class CsvModule {}
