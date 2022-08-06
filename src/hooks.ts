import { useEffect, useState, useCallback } from "react";
import { api } from "./api";
import { message, Form } from "antd";
import { IGetExchangeRate, IScheduleList, ITotalPrice, IForm } from "./types";

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
  const [CNYExchangeRUB, setCNYExchangeRUB] = useState<number>(0);
  const [USDExchangeRUB, setUSDExchangeRUB] = useState<number>(0);
  const [USDExchangeCNY, setUSDExchangeCNY] = useState<number>(0);
  const [scheduleList, setScheduleList] = useState<IScheduleList[]>([]);
  const [scheduleTotalPrice, setScheduleTotalPrice] = useState<ITotalPrice>(baseTotalPrice);
  const [doneList, setDoneList] = useState<IScheduleList[]>([]);
  const [doneTotalPrice, setDoneTotalPrice] = useState<ITotalPrice>(baseTotalPrice);

  const [form] = Form.useForm();

  const getExchangeRate = async (base: string, symbols: string): Promise<IGetExchangeRate> => {
    const result = await api.get(`/latest?base=${base}&symbols=${symbols}`);
    return result.data.rates;
  };

  const toFixedPrice = (price: number, fix: number) => Number(price.toFixed(fix));

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

  const calcTotalPrice = (list: IScheduleList[]) => {
    const newTotal = JSON.parse(JSON.stringify(baseTotalPrice));
    list.forEach((schedule) => {
      newTotal.RUB += schedule.RUB;
      newTotal.CNY += schedule.CNY;
      newTotal.USD += schedule.USD;
    });
    return newTotal;
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

  const onScheduleSum = useCallback(() => {
    const newTotal = calcTotalPrice(scheduleList);
    setScheduleTotalPrice(newTotal);
  }, [scheduleList]);

  const onDoneCheckboxClick = (index: number) => {
    const schedule = doneList.find((doneItem, i) => i === index);
    setDoneList(doneList.filter((doneItem, i) => i !== index));
    !!schedule && setScheduleList([...scheduleList, schedule]);
  };

  const onDoneSum = useCallback(() => {
    const newTotal = calcTotalPrice(doneList);
    setDoneTotalPrice(newTotal);
  }, [doneList]);

  useEffect(() => {
    if (scheduleList.length > 0) {
      onScheduleSum();
    } else {
      setScheduleTotalPrice(baseTotalPrice);
    }
    // eslint-disable-next-line
  }, [scheduleList]);

  useEffect(() => {
    if (doneList.length > 0) {
      onDoneSum();
    } else {
      setDoneTotalPrice(baseTotalPrice);
    }
    // eslint-disable-next-line
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
    scheduleTotalPrice,
    doneList,
    doneTotalPrice,
    form,
    onAdd,
    onCheckboxClick,
    onDoneCheckboxClick,
  };
};
