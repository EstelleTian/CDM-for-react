//除冰限制信息---列表

import React from 'react';
import { Row, Col } from 'antd';
import { getRestrictionUrl } from 'utils/request-urls';
import {  requestGet } from 'utils/request-actions';

import RestrictionItem from "./RestrictionItem";
import './RestrictionList.less';

class RestrictionList extends React.Component{
    constructor( props ){
        super(props);
        this.getParams = this.getParams.bind(this);
        this.getRestrictionDatas = this.getRestrictionDatas.bind(this);
        this.handleUpdateRestrictionData = this.handleUpdateRestrictionData.bind(this);
        this.state = {
            restrictionTimerId : 0
        };
    }
    // 拼接获取除冰限制数据请求中所需参数
    getParams (){
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
            "userId" : userId,
        };
        return params;
    }

    // 获取除冰限制数据
    getRestrictionDatas(){
        // 获取参数
        let params = this.getParams();
        // 发送请求并指定回调方法
        requestGet(getRestrictionUrl, params, this.handleUpdateRestrictionData);
    }
    // 更新除冰限制数据
    handleUpdateRestrictionData(res) {
        const {updateRestrictionDatas, updateRestrictionGenerateTime} = this.props;
        // 除冰限制数据生成时间
        const {generateTime = ''} = res;
        // 更新除冰限制数据生成时间
        updateRestrictionGenerateTime(generateTime);
        // 取除冰限制数据
        const {airportDeiceResult = {}} = res;
        const {result = {}} = airportDeiceResult;

        // 更新除冰限制数据
        updateRestrictionDatas(result);
        // 定时30秒后再次获取除冰限制数据并更新
        // const restrictionTimerId = setTimeout(() => {
        //     // 获取除冰限制数据
        //     this.getRestrictionDatas();
        // }, 30*1000);
        // this.setState({
        //     restrictionTimerId
        // });
    }

    // 立即调用
    componentDidMount(){
        // 获取除冰限制数据
        this.getRestrictionDatas()
    }

    componentWillUnmount(){
        //清除定时器
        const { flowcontrolTimerId = 0} = this.state;
        clearTimeout( flowcontrolTimerId );
    }

    render(){
        // 除冰限制数据
        const { restrictionViewMap = [], restrictionGenerateTime } = this.props;
        return (
            <Col span={24} className="restriction-list">
                <Row className="restriction-item-wrapper">
                    {
                        restrictionViewMap.map((item,index) =>{
                            return (
                                <RestrictionItem
                                    key = { item.id}
                                    data = { item }
                                    generateTime = { restrictionGenerateTime }
                                    indexNumber = { index +1 }
                                />
                            )
                        })
                    }

                </Row>

            </Col>
        )
    }
};

export default RestrictionList;