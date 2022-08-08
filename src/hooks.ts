import { useEffect, useState, useCallback } from "react";
import { api } from "./api";
import { message, Form } from "antd";
import { IGetExchangeRate, IScheduleList, IForm } from "./types";

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

const baseSchedule: IScheduleList = {
  task: "",
  RUB: 0,
  CNY: 0,
  USD: 0,
};

const calcTotalPrice = (list: IScheduleList[]) => {
  if (list.length > 0) {
    return list.reduce((total, item) => {
      return {
        task: "",
        RUB: total.RUB + item.RUB,
        CNY: total.CNY + item.CNY,
        USD: total.USD + item.USD,
      };
    });
  } else {
    return baseSchedule;
  }
};

const toFixedPrice = (price: number, fix: number) => Number(price.toFixed(fix));

export const useAction = () => {
  const [CNYExchangeRUB, setCNYExchangeRUB] = useState<number>(0);
  const [USDExchangeRUB, setUSDExchangeRUB] = useState<number>(0);
  const [USDExchangeCNY, setUSDExchangeCNY] = useState<number>(0);
  const [scheduleList, setScheduleList] = useState<IScheduleList[]>([]);
  const [doneList, setDoneList] = useState<IScheduleList[]>([]);

  const [form] = Form.useForm();

  const getExchangeRate = async (
    base: string,
    symbols: string
  ): Promise<IGetExchangeRate> => {
    const result = await api.get(`/latest?base=${base}&symbols=${symbols}`);
    return result.data.rates;
  };

  const onBaseUSD = useCallback(async () => {
    const rates = await getExchangeRate("USD", "CNY,RUB");
    setCNYExchangeRUB(toFixedPrice(rates.RUB / rates.CNY, 3));
    setUSDExchangeRUB(toFixedPrice(rates.RUB, 3));
    setUSDExchangeCNY(toFixedPrice(rates.CNY, 3));
  }, []);

  const transformPrice = (values: IForm) => {
    switch (values.currency) {
      case currencyType.RUB:
        return {
          task: values.task,
          RUB: values.price,
          CNY: toFixedPrice(values.price / CNYExchangeRUB, 5),
          USD: toFixedPrice(values.price / USDExchangeRUB, 5),
        };
      case currencyType.CNY:
        return {
          task: values.task,
          RUB: toFixedPrice(values.price * CNYExchangeRUB, 5),
          CNY: values.price,
          USD: toFixedPrice(values.price / USDExchangeCNY, 5),
        };
      default:
        return {
          task: values.task,
          RUB: toFixedPrice(values.price * USDExchangeRUB, 5),
          CNY: toFixedPrice(values.price * USDExchangeCNY, 5),
          USD: values.price,
        };
    }
  };

  const onAdd = (values: IForm) => {
    if (!!values.task && !!values.price && !!values.currency) {
      setScheduleList([...scheduleList, transformPrice(values)]);
      form.resetFields();
    } else {
      message.error("请完整填写数据");
    }
  };

  const onCheckboxClick = (index: number) => {
    const doneSchedule = scheduleList.find((schedule, i) => i === index);
    setScheduleList(scheduleList.filter((schedule, i) => i !== index));
    !!doneSchedule && setDoneList([...doneList, doneSchedule]);
  };

  const scheduleTotalPrice = useCallback(() => {
    return calcTotalPrice(scheduleList);
  }, [scheduleList]);

  const onDoneCheckboxClick = (index: number) => {
    const schedule = doneList.find((doneItem, i) => i === index);
    setDoneList(doneList.filter((doneItem, i) => i !== index));
    !!schedule && setScheduleList([...scheduleList, schedule]);
  };

  const doneTotalPrice = useCallback(() => {
    return calcTotalPrice(doneList);
  }, [doneList]);

  useEffect(() => {
    onBaseUSD();
  }, [onBaseUSD]);

  return {
    currencyTypes,
    CNYExchangeRUB,
    USDExchangeRUB,
    USDExchangeCNY,
    scheduleList,
    doneList,
    form,
    scheduleTotalPrice,
    doneTotalPrice,
    onAdd,
    onCheckboxClick,
    onDoneCheckboxClick,
  };
};
