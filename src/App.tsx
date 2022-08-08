import React from "react";
import "./App.css";
import { Input, InputNumber, Select, Button, Form } from "antd";
import { useAction } from "./hooks";
import ScheduleList from "./components/schedule-list";
import DoneList from "./components/done-list";

const App: React.FC = () => {
  const {
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
  } = useAction();

  return (
    <div className="root">
      <div className="container">
        <Form form={form} name="form" layout="inline" onFinish={onAdd}>
          <Form.Item name="task">
            <Input placeholder="任务" className="input" />
          </Form.Item>
          <Form.Item name="price">
            <InputNumber
              placeholder="价格"
              parser={(value) =>
                !!value ? value.replace(/[^\d{1,}\d{1,}|\d{1,}]/g, "") : ""
              }
              className="input"
            />
          </Form.Item>
          <Form.Item name="currency">
            <Select
              options={currencyTypes}
              placeholder="货币类型"
              className="input"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="button" htmlType="submit">
              添加
            </Button>
          </Form.Item>
        </Form>
        <div className="exchange-rate">
          <span className="exchange-rate-text">{CNYExchangeRUB} ₽/￥</span>
          <span className="exchange-rate-text">{USDExchangeRUB} ₽/$</span>
          <span className="exchange-rate-text">{USDExchangeCNY} ￥/$</span>
        </div>
        <ScheduleList
          scheduleList={scheduleList}
          onCheckboxClick={onCheckboxClick}
          scheduleTotalPrice={scheduleTotalPrice}
        />
        <DoneList
          doneList={doneList}
          onDoneCheckboxClick={onDoneCheckboxClick}
          doneTotalPrice={doneTotalPrice}
        />
      </div>
    </div>
  );
};

export default App;
