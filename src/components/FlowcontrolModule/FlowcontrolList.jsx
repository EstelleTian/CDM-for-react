//流控信息---菜单操作功能

import React from 'react';
import { Row, Col } from 'antd';
import { getFlowcontrolUrl } from '../../utils/request-urls';
import { requestGet, request } from '../../utils/request-actions';
import axios from 'axios';

import FlowcontrolItem from "./FlowcontrolItem";
import './FlowcontrolList.less';


class FlowcontrolList extends React.Component{
    constructor( props ){
        super(props);
        this.getParams = this.getParams.bind(this);
        this.getFlowcontrolDatas = this.getFlowcontrolDatas.bind(this);
        this.handleUpdateFlowcontrolData = this.handleUpdateFlowcontrolData.bind(this);
    }
    // 拼接获取流控数据请求中所需参数
    getParams (){
        const { startWaypoints, waypoints, system, systemProgram} = this.props.flowcontrolParams;
        // 暂时取客户端当前日期
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        year = '' + year;
        month = month < 10 ? '0' + month : '' + month;
        day = day < 10 ? '0' + day : '' + day;
        let fullTime = year + month + day;

        const params = {
            "startTime": fullTime+"0000",
            "endTime":  fullTime+ "2359",
            "system": system,
            "systemProgram": systemProgram,
            "waypoints" : waypoints,
            "startWaypoints" : startWaypoints,
        };
        return params;
    }

    // 获取流控数据
    getFlowcontrolDatas(){
        // 获取参数
        let params = this.getParams();
        // 发送请求并指定回调方法
        request(getFlowcontrolUrl, 'POST', JSON.stringify(params), this.handleUpdateFlowcontrolData);
    }
    // 更新流控数据
    handleUpdateFlowcontrolData(res) {
        const {updateFlowcontrolDatas, updateFlowGenerateTime} = this.props;
        // 流控数据生成时间
        const {generateTime = ''} = res;
        // 更新流控数据生成时间
        updateFlowGenerateTime(generateTime);
        // 取流控数据
        const {result = {}} = res;
        // 更新流控数据
        updateFlowcontrolDatas(result);
    }

    // 立即调用
    componentDidMount(){
        // 获取流控数据
        this.getFlowcontrolDatas()
    }

    render(){
        // 流控数据
        const { flowcontrolViewMap = [], flowGenerateTime } = this.props;
        return (
            <Col span={24} className="flowcontrol-list">
                <Row className="flow-item-wrapper">
                    {
                        flowcontrolViewMap.map((item,index) =>{
                            return (
                                <FlowcontrolItem
                                    key={item.id}
                                    data = {item}
                                    indexNumber = { (index +1) }
                                    generateTime = { flowGenerateTime }
                                />
                            )
                        })
                    }

                </Row>

            </Col>
        )
    }
};

export default FlowcontrolList;