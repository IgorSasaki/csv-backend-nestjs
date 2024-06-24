import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { diskStorage } from 'multer'
import { extname } from 'path'

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CsvService } from '../services/csv.service'

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          cb(null, `${randomName}${extname(file.originalname)}`)
        }
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/csv') {
          return cb(
            new BadRequestException('Only CSV files are allowed'),
            false
          )
        }
        cb(null, true)
      },
      limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
    })
  )
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    await this.csvService.processCsv(file)

    return {
      message: 'File uploaded successfully and queued for processing',
      file: file.filename
    }
  }
}
