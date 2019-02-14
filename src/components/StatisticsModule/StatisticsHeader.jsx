//统计信息---菜单操作功能

import React from 'react';
import { Col  } from 'antd';
import { isValidVariable } from 'utils/basic-verify';

class StatisticsHeader extends React.Component{
    constructor( props ){
        super(props);
    }


    render(){
        return (
            <Col span={24} className="header">
                <Col span={10} className="title" >
                    <span className="designation">统计信息</span>
                </Col>
            </Col>
        )
    }
};

export default StatisticsHeader;