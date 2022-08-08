import React, { FC, memo } from "react";
import { Card, Row, Col, Checkbox } from "antd";
import { DoneListProps } from "./props";

const DoneList: FC<DoneListProps> = ({
  doneList,
  onDoneCheckboxClick,
  doneTotalPrice,
}) => {
  return (
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
        <Col span={4}>₽{doneTotalPrice().RUB}</Col>
        <Col span={4}>￥{doneTotalPrice().CNY}</Col>
        <Col span={4}>${doneTotalPrice().USD}</Col>
      </Row>
    </Card>
  );
};

export default memo(DoneList);
