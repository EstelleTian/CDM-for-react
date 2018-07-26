//流控信息---菜单操作功能

import React from 'react';
import { Col } from 'antd'
import FlowcontrolModule from '../FlowcontrolModule/FlowcontrolModule';


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
                    ( key == 'notice-info' ) ? '通告信息' : ''
                }
                {
                    ( key == 'restriction-info' ) ? '限制信息' : ''
                }


            </Col>
        )
    }
};

export default Sidebar;