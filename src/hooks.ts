import { useEffect, useState, useCallback } from "react";
import { api } from "./api";
import { message } from "antd";

interface IScheduleList {
  task: string;
  RUB: number;
  CNY: number;
  USD: number;
}

interface ITotalPrice {
  RUB: number;
  CNY: number;
  USD: number;
}

enum currencyType {
  RUB = 1,
  CNY = 2,
  USD = 3,
}

const currencyTypes = [
  { label: "卢布", value: currencyType.RUB },
  { label: "人民币", value: currencyType.CNY },
  { label: "美元", value: currencyType.USD },
];

const baseTotalPrice = {
  RUB: 0,
  CNY: 0,
  USD: 0,
};

export const useAction = () => {
  const [task, setTask] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<number>(0);
  const [CNYExchangeRUB, setCNYExchangeRUB] = useState<number>(0);
  const [USDExchangeRUB, setUSDExchangeRUB] = useState<number>(0);
  const [USDExchangeCNY, setUSDExchangeCNY] = useState<number>(0);
  const [scheduleList, setScheduleList] = useState<IScheduleList[]>([]);
  const [scheduleTotalPrice, setScheduleTotalPrice] =
    useState<ITotalPrice>(baseTotalPrice);

  const getExchangeRate = async (base: string, symbols: string) => {
    const result = await api.get(`/latest?base=${base}&symbols=${symbols}`);
    return result.data.rates;
  };

  const toFixedPrice = (price: number, fix: number) =>
    Number(price.toFixed(fix));

  const onBaseUSD = useCallback(async () => {
    const rates = await getExchangeRate("USD", "CNY,RUB");
    setCNYExchangeRUB(toFixedPrice(rates.RUB / rates.CNY, 3));
    setUSDExchangeRUB(toFixedPrice(rates.RUB, 3));
    setUSDExchangeCNY(toFixedPrice(rates.CNY, 3));
  }, []);

  const transformPrice = () => {
    switch (currency) {
      case currencyType.RUB:
        return {
          task,
          RUB: price,
          CNY: toFixedPrice(price / CNYExchangeRUB, 5),
          USD: toFixedPrice(price / USDExchangeRUB, 5),
        };
      case currencyType.CNY:
        return {
          task,
          RUB: toFixedPrice(price * CNYExchangeRUB, 5),
          CNY: price,
          USD: toFixedPrice(price / USDExchangeCNY, 5),
        };
      default:
        return {
          task,
          RUB: toFixedPrice(price * USDExchangeRUB, 5),
          CNY: toFixedPrice(price * USDExchangeCNY, 5),
          USD: price,
        };
    }
  };

  const onAdd = () => {
    if (!!task && !!price && !!currency) {
      setScheduleList([...scheduleList, transformPrice()]);
    } else {
      message.error("请完整填写数据");
    }
  };

  const onCheckboxClick = (index: number) => {};

  const onScheduleSum = useCallback(() => {
    const newTotal = JSON.parse(JSON.stringify(scheduleTotalPrice));
    const lastSchedule = scheduleList[scheduleList.length - 1];
    newTotal.RUB += lastSchedule.RUB;
    newTotal.CNY += lastSchedule.CNY;
    newTotal.USD += lastSchedule.USD;
    setScheduleTotalPrice(newTotal);
  }, [scheduleList]);

  useEffect(() => {
    if (scheduleList.length > 0) {
      onScheduleSum();
    }
  }, [scheduleList]);

  useEffect(() => {
    onBaseUSD();
  }, [onBaseUSD]);

  return {
    task,
    price,
    currency,
    currencyTypes,
    CNYExchangeRUB,
    USDExchangeRUB,
    USDExchangeCNY,
    scheduleList,
    scheduleTotalPrice,
    setTask,
    setPrice,
    setCurrency,
    onAdd,
    onCheckboxClick,
  };
};
