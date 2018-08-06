//除冰限制信息列表模块(侧边栏)
import React from 'react';
import { Row, Col } from 'antd';
import  RestrictionHeader from './RestrictionHeader'
import  RestrictionListContainer from './RestrictionListContainer'
import './RestrictionModule.less';

const RestrictionModule = () => (
    <Row className="restriction-container">
        <RestrictionHeader />
        <RestrictionListContainer/>
    </Row>
)

export default RestrictionModule;
