//航班起飞排序模块
import React from 'react';
import { Row } from 'antd';
import  FlowcontrolHeaderContainer from './FlowcontrolHeaderContainer';
import  FlowcontrolListContainer from './FlowcontrolListContainer';

import './FlowcontrolModule.less';

const FlowcontrolModule = () => (
    <Row className="flowcontrol-container">
        <FlowcontrolHeaderContainer />
        <FlowcontrolListContainer/>
    </Row>
)

export default FlowcontrolModule;
