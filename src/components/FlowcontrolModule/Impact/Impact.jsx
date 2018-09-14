import React from 'react';
import { Row, Col, Icon } from 'antd';
import DraggableModule from "components/DraggableModule/DraggableModule";
import './Impact.less'

class Impact extends React.Component{
    constructor( props ){
        super(props);
    }
    componentDidMount(){
        //请求
    }
    render(){
        const { formatData, clickCloseBtn, width = 1100, dialogName, x, y, loginUserInfo, systemConfig} = this.props;
        const { name, effectiveTime, publishUserZh, flowStatus, flowStatusClassName, startTime, endTime, generateTime, lastModifyTime, updateTime } = formatData;
        return (
            <DraggableModule
                bounds = ".root"
                x = {x}
                y = {y}
            >
                <div className="box center no-cursor" style={{ width: width }}>
                    <div className="dialog">
                        {/* 头部*/}
                        <Row className="title drag-target cursor">
                            <span>{name} 影响航班</span>
                            <div
                                className="close-target"
                                onClick={ () => {
                                    clickCloseBtn(dialogName);
                                } }
                            >
                                <Icon type="close" title="关闭"/>
                            </div>
                        </Row>
                        <div className="content">
                            <Row className="short-info">
                                <Col span={24} className="main-title">
                                    <span className="name">{ name }</span>
                                    <span className="effectiveTime">( { effectiveTime } )</span>
                                    <span className={`status ${flowStatusClassName}`}>{ flowStatus }</span>
                                </Col>
                                <Col span={24} className="main-date">
                                    <Col span={4}>创建时间</Col>
                                    <Col span={4}>开始时间</Col>
                                    <Col span={4}>结束时间</Col>
                                    <Col span={4}>终止时间</Col>
                                    <Col span={4}>更新时间</Col>
                                    <Col span={4}>发布用户</Col>
                                </Col>
                                <Col span={24} className="main-date">
                                    <Col span={4}>{generateTime || "——"}</Col>
                                    <Col span={4}>{startTime || "——"}</Col>
                                    <Col span={4}>{endTime || "——"}</Col>
                                    <Col span={4}>{lastModifyTime || "——"}</Col>
                                    <Col span={4}>{updateTime || "——"}</Col>
                                    <Col span={4}>{publishUserZh || "——"}</Col>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </DraggableModule>
        )
    }
};

export default Impact;