//航班起飞排序---菜单操作功能

import React from 'react';
import { Col } from 'antd';
import './TableHeader.less';

class TableHeader extends React.Component{
    constructor( props ){
        super(props);
    }

    render(){
        const { generateTime = {} } = this.props;
        const {time = ''} = generateTime;

        return (
            <Col span={24} className="header">
                <div className="title">
                    <span>航班起飞排序</span>
                    {
                        (time ) ? <span>{time}</span> : ''
                    }

                </div>
            </Col>
        )
    }
};

export default TableHeader;