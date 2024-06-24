import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'

import { WebSocketModule } from '../websocket/websocket.module'
import { CsvController } from './controllers/csv.controller'
import { CsvProcessor } from './processors/csv.processor'
import { CsvData, CsvDataSchema } from './schemas/csv-data.schema'
import { CsvService } from './services/csv.service'

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads'
    }),
    BullModule.registerQueue({
      name: 'csv'
    }),
    MongooseModule.forFeature([{ name: CsvData.name, schema: CsvDataSchema }]),
    WebSocketModule
  ],
  controllers: [CsvController],
  providers: [CsvService, CsvProcessor]
})
export class CsvModule {}
