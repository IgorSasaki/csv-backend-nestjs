import { v4 as uuidv4 } from 'uuid';

import { ICsvData } from '../../common/interfaces/csv.interface';

export class CsvAdapter {
  static adapt(data: any, userId: string): ICsvData {
    const dateNow = new Date().toISOString();

    return {
      csvRowId: uuidv4(),
      userId,
      email: data.Email || '',
      name: data.Nome || '',
      age: this.parseNumber(data.Idade),
      monetaryValue: this.parseMonetaryValue(data['Valor Monetario'] ?? '0'),
      createdAt: dateNow,
      updatedAt: dateNow,
    };
  }

  static rawAdapt(data: ICsvData | any) {
    return {
      Email: data.email,
      Nome: data.name,
      Idade: data.age,
      'Valor Monetario': data.monetaryValue.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
      }),
    };
  }

  private static parseNumber(value: string): number {
    const parsedValue = parseFloat(value.replace(/[^\d.-]/g, ''));
    return isNaN(parsedValue) ? 0 : parsedValue;
  }

  private static parseMonetaryValue(value: string): number {
    const parsedValue = parseFloat(
      value.replace(/[R$\s.]/g, '').replace(',', '.'),
    );

    return isNaN(parsedValue) ? 0 : parsedValue;
  }
}
