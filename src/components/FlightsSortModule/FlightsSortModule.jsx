//航班起飞排序模块
import React from 'react';
import { Row, Col } from 'antd';
import TableMenuContainer from './TableMenuContainer';
import TableContainer from './TableContainer';
import './FlightsSortModule.less';

const FlightsSortModule = () => (
    <Row className="container">
        <TableMenuContainer/>
        <TableContainer/>
    </Row>
)

export default FlightsSortModule;
