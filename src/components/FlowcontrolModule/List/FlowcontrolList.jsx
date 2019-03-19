//流控信息---菜单操作功能

import React from 'react';
import { Row, Col } from 'antd';
import { getFlowcontrolUrl } from 'utils/request-urls';
import {  request } from 'utils/request-actions';
// 动画
import QueueAnim from 'rc-queue-anim';
// 引入流控列表项组件
import FlowcontrolItem from "./FlowcontrolItem";
import './FlowcontrolList.less';

class FlowcontrolList extends React.Component{
    constructor( props ){
        super(props);
        this.getParams = this.getParams.bind(this);
        this.getFlowcontrolDatas = this.getFlowcontrolDatas.bind(this);
        this.handleUpdateFlowcontrolData = this.handleUpdateFlowcontrolData.bind(this);
        this.connectAuth = this.connectAuth.bind(this);
        this.getFlowcontrolItems = this.getFlowcontrolItems.bind(this);
        // 初始化组件state
        this.state = {
            flowcontrolTimerId : 0
        };
    }

    /**
     * 拼接获取流控数据请求中所需参数
     *
     *  return { params } 参数对象
     * */
    getParams (){
        const { startWaypoints, waypoints, system, systemProgram} = this.props.flowcontrolParams;
        const { userId } = this.props;
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
            "userId" : userId,
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
    /**
     * 更新流控数据
     * @param res 响应数据
     *
     * */
    handleUpdateFlowcontrolData(res) {
        const {updateFlowcontrolDatas, updateFlowGenerateTime} = this.props;
        // 流控数据生成时间
        const {generateTime = ''} = res;
        // 更新流控数据生成时间
        updateFlowGenerateTime(generateTime);
        // 取流控数据及操作权限
        const {result = {}, authMap = {} } = res;
        // 将操作权限与流控数据合并
        const flowDatas = this.connectAuth(result, authMap);
        // 更新流控数据
        updateFlowcontrolDatas(flowDatas);
        // 定时30秒后再次获取流控数据并更新
        const flowcontrolTimerId = setTimeout(() => {
            // 获取流控数据
            this.getFlowcontrolDatas();
        }, 30*1000);
        this.setState({
            flowcontrolTimerId
        });
    }
    /**
     * 将操作权限与流控数据合并
     * @param dataMap 流控数据集合
     * @param authMap 流控数据操作权限集合
     * @return { result } 合并后的流控数据
     * */
    connectAuth(dataMap,authMap) {
        let result = {};
        let map = Object.keys(dataMap);
        map.map((item) => {
            let auth = authMap[item];
            if(auth){
                result[item] = {...dataMap[item],auth}
            }
        });
        return result
    }

    /**
     * 获取流控列表项
     *
     * */
    getFlowcontrolItems() {
        // 流控数据
        const { flowcontrolViewMap = [], flowGenerateTime, systemConfig } = this.props;
        return flowcontrolViewMap.map((item,index) =>{
            return (
                <FlowcontrolItem
                    key={item.id}
                    singleFlowcontrolData = {item} // 单个流控数据
                    indexNumber = { (index +1) } // 列表项下标标识
                    flowGenerateTime = { flowGenerateTime } // 流控列表数据生成时间
                    systemConfig = { systemConfig } // 系统参数
                />
            )
        })
    }

    // 组件挂载完成
    componentDidMount(){
        // 获取流控数据
        this.getFlowcontrolDatas()
    }
    //组件将要挂载
    componentWillUnmount(){
        //清除定时器
        const { flowcontrolTimerId = 0} = this.state;
        clearTimeout( flowcontrolTimerId );
    }

    render(){
        return (
            <Col span={24} className="flowcontrol-list">
                <Row className="flow-item-wrapper">
                    <QueueAnim delay={300} className="queue-simple">
                    {
                        this.getFlowcontrolItems()
                    }
                    </QueueAnim>
                </Row>

            </Col>
        )
    }
};

export default FlowcontrolList;