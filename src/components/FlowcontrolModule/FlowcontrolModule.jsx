//航班起飞排序模块
import React from 'react';
import { Row, Col } from 'antd';
import  FlowcontrolHeaderContainer from './FlowcontrolHeaderContainer'
import  FlowcontrolItemContainer from './FlowcontrolItemContainer'
import  FlowcontrolListContainer from './FlowcontrolListContainer'

import './FlowcontrolModule.less';

const FlowcontrolModule = () => (
    <Col className="card all-flights-card bc-1" xs={0} sm={0} md={0} lg={0} xl={6} xxl={6}>
        <Row className="flowcontrol-container">
            <FlowcontrolHeaderContainer />
            <FlowcontrolListContainer/>
        </Row>
    </Col>
)

export default FlowcontrolModule;
