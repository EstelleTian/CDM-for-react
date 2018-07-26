//航班起飞排序模块
import React from 'react';
import { Row, Col } from 'antd';
import TableMenuContainer from './TableMenuContainer';
import TableContainer from './TableContainer';
import OperationDialogContainer from '../OperationDialog/OperationDialogContainer';
import './FlightsSortModule.less';

const FlightsSortModule = () => (
        <Col className="card all-flights-card bc-1" xs={24} sm={24} md={24} lg={24} xl={18} xxl={18}>
            <Row className="container">
                <TableMenuContainer/>
                <TableContainer/>
                <OperationDialogContainer />
            </Row>
        </Col>
)

export default FlightsSortModule;
