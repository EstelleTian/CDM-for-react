//流控信息---菜单操作功能

import React from 'react';
import { Row, Col } from 'antd';
import { getFlowcontrolUrl } from '../../utils/request-urls';
import { isEffective } from '../../utils/flowcontrol-data-util';

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
    getParams (){
        let params = {
            "startTime": "",
            "endTime": "",
            "system": "CDM",
            "systemProgram": "CDMZUUU",
            "waypoints" : "PARGU,RG,CZH,ENH,P127,P124,SUBUL,UPKUS,AGULU,OMBON",
            "startWaypoints" : "ZUUU",
        };
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        year = '' + year;
        month = month < 10 ? '0' + month : '' + month;
        day = day < 10 ? '0' + day : '' + day;
        let fullTime = year + month + day;
        params["startTime"] = fullTime + '0000';
        params["endTime"] = fullTime + '2359';
        return params;
    }


    // 获取流控数据
    getFlowcontrolDatas(){
        // const { flowcontrolDataMap, updateFlowcontrolDatas, updateFlowcontrolViewMap, updateFlowGenerateTime } = this.props;
        //
        // const  filterFlowoncontrolDatas = this.filterFlowoncontrolDatas;

        // let params = this.getParams();
        // params = JSON.stringify(params)
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
            "system": "CDM",
            "systemProgram": "CDMZUUU",
            "waypoints" : "PARGU,RG,CZH,ENH,P127,P124,SUBUL,UPKUS,AGULU,OMBON",
            "startWaypoints" : "ZUUU",
        };
        // axios.request({
        //     url: getFlowcontrolUrl,
        //     method: "post",
        //     data: JSON.stringify(params),
        //     headers: {
        //         'Content-Type': 'application/json; charset=utf-8'
        //     }
        // }).then(function (response) {
        //
        //     const { data = {} } = response;
        //     // 流控数据生成时间
        //     const { generateTime = '' } = data;
        //     // 更新流控数据生成时间
        //     updateFlowGenerateTime(generateTime);
        //     // 取流控数据
        //     const { result = {} } = data;
        //     // 更新流控数据
        //     updateFlowcontrolDatas(result);
        //     // 根据过虑条件过滤显示的流控数据
        //     const viewMap = filterFlowoncontrolDatas(flowcontrolDataMap);
        //     // 更新显示的流控数据
        //     updateFlowcontrolViewMap(viewMap);
        //
        // })
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