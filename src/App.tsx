import React, { useMemo } from "react";
import "./App.css";
import {
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Row,
  Col,
  Checkbox,
} from "antd";
import { useAction } from "./hooks";

function App() {
  const {
    task,
    price,
    currency,
    currencyTypes,
    CNYExchangeRUB,
    USDExchangeRUB,
    USDExchangeCNY,
    scheduleList,
    scheduleTotalPrice,
    doneList,
    doneTotalPrice,
    setTask,
    setPrice,
    setCurrency,
    onAdd,
    onCheckboxClick,
    onDoneCheckboxClick,
  } = useAction();

  return (
    <div className="root">
      <div className="container">
        <div className="header">
          <div>
            <Input
              placeholder="任务"
              className="input"
              onChange={(e) => setTask(e.target?.value)}
            />
            <InputNumber
              placeholder="价格"
              parser={(value) =>
                !!value
                  ? Number(value.replace(/[^\d{1,}\d{1,}|\d{1,}]/g, ""))
                  : 0
              }
              className="input"
              onChange={(e) => setPrice(Number(e))}
            />
            <Select
              options={currencyTypes}
              placeholder="货币类型"
              className="input"
              onChange={(e) => setCurrency(e)}
            />
          </div>
          <Button type="primary" className="button" onClick={onAdd}>
            添加
          </Button>
        </div>
        <div className="exchange-rate">
          <span className="exchange-rate-text">{CNYExchangeRUB} ₽/￥</span>
          <span className="exchange-rate-text">{USDExchangeRUB} ₽/$</span>
          <span className="exchange-rate-text">{USDExchangeCNY} ￥/$</span>
        </div>
        <Card title="计划:" className="card-box">
          {scheduleList.map((schedule, index) => (
            <Row key={index}>
              <Col span={1}>
                <Checkbox onChange={() => onCheckboxClick(index)} />
              </Col>
              <Col span={11}>{schedule.task}</Col>
              <Col span={4}>₽{schedule.RUB}</Col>
              <Col span={4}>￥{schedule.CNY}</Col>
              <Col span={4}>${schedule.USD}</Col>
            </Row>
          ))}
          <Row className="total-price">
            <Col span={12}>将要花费:</Col>
            <Col span={4}>₽{scheduleTotalPrice.RUB}</Col>
            <Col span={4}>￥{scheduleTotalPrice.CNY}</Col>
            <Col span={4}>${scheduleTotalPrice.USD}</Col>
          </Row>
        </Card>
        <Card title="已完成:" className="card-box">
          {doneList.map((doneItem, index) => (
            <Row key={index}>
              <Col span={1}>
                <Checkbox checked onChange={() => onDoneCheckboxClick(index)} />
              </Col>
              <Col span={11} className="done-text">
                {doneItem.task}
              </Col>
              <Col span={4}>₽{doneItem.RUB}</Col>
              <Col span={4}>￥{doneItem.CNY}</Col>
              <Col span={4}>${doneItem.USD}</Col>
            </Row>
          ))}
          <Row className="total-price">
            <Col span={12}>一共花了:</Col>
            <Col span={4}>₽{doneTotalPrice.RUB}</Col>
            <Col span={4}>￥{doneTotalPrice.CNY}</Col>
            <Col span={4}>${doneTotalPrice.USD}</Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}

export default App;
