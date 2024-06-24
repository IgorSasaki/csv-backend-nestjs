import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class CsvData extends Document {
  @Prop({ required: true })
  userId: string

  @Prop()
  csvRowId: string

  @Prop()
  email: string

  @Prop()
  name: string

  @Prop()
  idade: number

  @Prop()
  monetaryValue: number

  @Prop({ required: true })
  createdAt: string

  @Prop({ required: true })
  updatedAt: string
}

export const CsvDataSchema = SchemaFactory.createForClass(CsvData)
