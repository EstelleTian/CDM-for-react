//航班起飞排序---菜单操作功能

import React from 'react';
import { Col } from 'antd';
import './TableHeader.less';

class TableHeader extends React.Component{
    constructor( props ){
        super(props);
    }

    render(){
        return (
            <Col span={24} className="header">
                <div className="title">
                    <span>航班起飞排序</span>
                </div>
            </Col>
        )
    }
};

export default TableHeader;