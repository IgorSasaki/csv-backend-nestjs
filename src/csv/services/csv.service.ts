import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class CsvService {
  constructor(@InjectQueue('csv') private readonly csvQueue: Queue) {}

  public async processCsv(file: Express.Multer.File) {
    await this.csvQueue.add('processCsv', {
      filePath: file.path,
    });
  }
}
