import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'

import { WebSocketGatewayClass } from '../../websocket/websocket.gateway'

@Processor('csv')
export class CsvProcessor {
  constructor(private readonly wsGateway: WebSocketGatewayClass) {}

  @Process('processCsv')
  async handleProcessCsv(job: Job) {
    const { filePath } = job.data

    this.wsGateway.emitCsvProcessed({ status: 'completed', filePath })
  }
}
