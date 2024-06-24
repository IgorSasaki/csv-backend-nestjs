import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
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
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    if (!file) {
      throw new BadRequestException('File is required')
    }
    const userId = req.user.userId

    await this.csvService.processCsv(file, userId)

    return {
      message: 'File uploaded successfully and queued for processing',
      file: file.filename
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('data')
  async getCsvData(@Req() req: Request) {
    const userId = req.user.userId

    return this.csvService.getCsvData(userId)
  }
}
