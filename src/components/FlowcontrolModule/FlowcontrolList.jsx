//流控信息---菜单操作功能

import React from 'react';
import { Row, Col } from 'antd';
import { getFlowcontrolUrl } from '../../utils/request-urls';
import { isValidVariable, isValidObject } from '../../utils/basic-verify';
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
        this.filterFlowoncontrolDatas = this.filterFlowoncontrolDatas.bind(this);
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

    // 过滤流控数据
    filterFlowoncontrolDatas(){
        const { flowcontrolDataMap, shieldLong, scope, placeType, orderBy, quicklyFilters, generateTime } = this.props;
        let flowcontrolDatas = Object.values( flowcontrolDataMap ); //转为数组
        // 过滤

        // 过滤是否屏蔽长期
        if(shieldLong){ // 不屏蔽长期则不进行过滤,反之过滤
            flowcontrolDatas = flowcontrolDatas.filter((item) => {
                // 0 : 长期  1 : 非长期
                if( 0 == item.flowcontrolType*1){
                    return false
                }else{
                    return true
                }
            })
        }

        // 过滤范围
        if(isValidVariable(scope) && 'ALL' != scope){ // 范围为"ALL"或无效则不进行过滤,反之过滤
            // 若范围为"EFFECTIVE"(正在生效)
            if('EFFECTIVE' == scope){
                // 过滤正在生效流控数据
                flowcontrolDatas = flowcontrolDatas.filter((item) => {
                    return isEffective(item,generateTime);
                });
            }

        }
        // 过滤类型
        if(isValidVariable(placeType) && 'ALL' != placeType){ // 类型为"ALL"或无效则不进行过滤,反之过滤
            flowcontrolDatas = flowcontrolDatas.filter((item) => placeType == item.placeType);
        }


        // 排序
        if("TIME" == orderBy){ // 按时间排序
            // 时间排序
            //失效在下生效在上 ? (原代码未按此规则排序)
            // 失效流控按lastModifyTime倒叙排
            // 生效流控按generateTime倒叙排排

            flowcontrolDatas.sort((d1,d2) =>{
                if(isValidObject(d1) && isValidObject(d2)){
                    const d1Time = d1.lastModifyTime || d1.generateTime;
                    const d2Time = d2.lastModifyTime || d2.generateTime;

                    return (d1Time * 1 > d2Time *1) ? -1 : 1 ;
                }
            });

        }else if("LEVEL" == orderBy){ // 按程度排序
            // LDR 排在最后
            //


        }


        return flowcontrolDatas;
    }
    handleUpdateFlowcontrolData( response ){
        const { flowcontrolDataMap, updateFlowcontrolDatas, updateFlowcontrolViewMap, updateFlowGenerateTime } = this.props;
        // 取流控数据  流控数据生成时间
        const { generateTime = '', result = {} } = response;
        // 更新流控数据生成时间
        updateFlowGenerateTime(generateTime);
        // 更新流控数据
        updateFlowcontrolDatas(result);
        // 根据过虑条件过滤显示的流控数据
        const viewMap = this.filterFlowoncontrolDatas(flowcontrolDataMap);
        // 更新显示的流控数据
        updateFlowcontrolViewMap(viewMap);
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
        request(getFlowcontrolUrl, 'POST', JSON.stringify(params), this.handleUpdateFlowcontrolData)
    }

    // 立即调用
    componentDidMount(){
        // 获取流控数据
        this.getFlowcontrolDatas()
    }



    render(){
        // 流控数据
        const { flowcontrolViewMap = [], generateTime } = this.props;
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
                                    generateTime = { generateTime }
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