//除冰限制信息列表模块(侧边栏)
import React from 'react';
import { Row, Col } from 'antd';
import  RestrictionHeaderContainer from './RestrictionHeaderContainer'
import  RestrictionListContainer from './RestrictionListContainer'
import './RestrictionModule.less';

const RestrictionModule = () => (
    <Row className="restriction-container">
        <RestrictionHeaderContainer />
        <RestrictionListContainer/>
    </Row>
)

export default RestrictionModule;
