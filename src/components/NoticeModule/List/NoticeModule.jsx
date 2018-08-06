//航班起飞排序模块
import React from 'react';
import { Row, Col } from 'antd';
import  NoticeHeaderContainer from './NoticeHeaderContainer'
import  NoticeListContainer from './NoticeListContainer'


const NoticeModule = () => (
    <Row className="flowcontrol-container">
        <NoticeHeaderContainer />
        <NoticeListContainer/>
    </Row>
)

export default NoticeModule;
