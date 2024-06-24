import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { Model } from 'mongoose';

import { ICsvData } from '../../common/interfaces/csv.interface';
import { WebSocketGatewayClass } from '../../websocket/websocket.gateway';
import { CsvAdapter } from '../adapters/csv.adapter';
import { CsvData as CsvDataModel } from '../schemas/csv-data.schema';

@Processor('csv')
export class CsvProcessor {
  constructor(
    @InjectModel(CsvDataModel.name) private csvDataModel: Model<CsvDataModel>,
    private readonly wsGateway: WebSocketGatewayClass,
  ) {}

  @Process('processCsv')
  async handleProcessCsv(job: Job) {
    const { filePath, userId } = job.data;
    const results: ICsvData[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        const normalizedData = CsvAdapter.adapt(data, userId);
        results.push(normalizedData);
      })
      .on('end', async () => {
        try {
          await this.csvDataModel.insertMany(results);
          this.wsGateway.emitCsvProcessed({ status: 'completed', filePath });
        } catch (error) {
          console.error('Error inserting data into the database:', error);
        }
      });
  }
}
