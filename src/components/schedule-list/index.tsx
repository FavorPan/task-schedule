import React, { FC, memo } from "react";
import { Card, Row, Col, Checkbox } from "antd";
import { ScheduleListProps } from "./props";

const ScheduleList: FC<ScheduleListProps> = ({
  scheduleList,
  onCheckboxClick,
  scheduleTotalPrice,
}) => {
  return (
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
        <Col span={4}>₽{scheduleTotalPrice().RUB}</Col>
        <Col span={4}>￥{scheduleTotalPrice().CNY}</Col>
        <Col span={4}>${scheduleTotalPrice().USD}</Col>
      </Row>
    </Card>
  );
};

export default memo(ScheduleList);
