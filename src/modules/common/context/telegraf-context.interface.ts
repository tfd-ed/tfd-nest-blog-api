import { Context } from 'telegraf';
export interface TelegrafContextInterface extends Context {
  message: any;
}
