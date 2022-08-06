export interface IGetExchangeRate {
  RUB: number;
  CNY: number;
}

export interface IScheduleList {
  task: string;
  RUB: number;
  CNY: number;
  USD: number;
}

export interface ITotalPrice {
  RUB: number;
  CNY: number;
  USD: number;
}

export interface IForm {
  task: string;
  price: number;
  currency: number;
}
