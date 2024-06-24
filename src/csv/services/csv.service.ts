import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { Redis } from 'ioredis';
import { Model } from 'mongoose';

import { ICsvData } from '../../common/interfaces/csv.interface';
import { CsvAdapter } from '../adapters/csv.adapter';
import { CsvData } from '../schemas/csv-data.schema';

@Injectable()
export class CsvService {
  constructor(
    @InjectModel(CsvData.name) private csvDataModel: Model<CsvData>,
    @InjectQueue('csv') private readonly csvQueue: Queue,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async processCsv(file: Express.Multer.File, userId: string) {
    await this.csvQueue.add('processCsv', {
      filePath: file.path,
      userId,
    });
  }

  async getCsvData(userId: string) {
    const cacheKey = `csv_data_${userId}`;
    const cachedData = await this.redis.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const data = await this.csvDataModel.find({ userId }).exec();
    const values = data.map((item) => item.monetaryValue);
    const mediana = this.calculateMedian(values);

    const result = {
      res: data.map((value) =>
        CsvAdapter.rawAdapt(value.toObject() as ICsvData),
      ),
      mediana,
    };

    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60); // Cache por 60 segundos

    return result;
  }

  private calculateMedian(values: number[]): number {
    if (!values.length) return 0;
    const sorted = values.sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  }
}
