import { Transaction } from 'sequelize';

export interface tokenPayloadType {
  user: string | number, 
  action: string | number,  
  expirationMinutes ?: number | string,
  dbTransaction ?: Transaction | null
}