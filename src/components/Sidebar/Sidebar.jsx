//侧边栏组件

import React from 'react';
import { Col } from 'antd'
import FlowcontrolModule from '../FlowcontrolModule/List/FlowcontrolModule';
import NoticeModule from '../NoticeModule/List/NoticeModule';
import RestrictionModule from '../RestrictionModule/List/RestrictionModule';


class Sidebar extends React.Component{
    constructor( props ){
        super(props);
    }
    render(){
        const { sidebarConfig } = this.props;
        const { key = '' } = sidebarConfig;

        return (
            <Col className="card sidebar bc-1" xs={0} sm={0} md={0} lg={0} xl={6} xxl={6}>
                {
                    ( key == 'flowcontrol-info' ) ? <FlowcontrolModule/> : ''
                }
                {
                    ( key == 'notice-info' ) ? <NoticeModule/>: ''
                }
                {
                    ( key == 'restriction-info' ) ? <RestrictionModule /> : ''
                }


            </Col>
        )
    }
};

export default Sidebar;