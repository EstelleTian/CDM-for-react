//流控信息---菜单操作功能
import React from 'react';
import { Row, Col, Icon, Modal } from 'antd';
import {isValidVariable, getTimeFromString, getDateFromString } from "utils/basic-verify";
import  { FlowcontrolDataUtil }  from 'utils/flowcontrol-data-util';
import CreateLayer from "components/CreateLayer/CreateLayer";
import FlowcontrolDetailContainer from "components/FlowcontrolModule/Detail/FlowcontrolDetailContainer";
import FlowcontrolDialogContainer from "components/FlowcontrolModule/Dialog/FlowcontrolDialog/FlowcontrolDialogContainer";
import TerminateContainer from "components/FlowcontrolModule/Terminate/TerminateContainer";
import ImpactContainer from "components/FlowcontrolModule/Impact/ImpactContainer";
import './FlowcontrolItem.less';

class FlowcontrolItem extends React.Component{
    constructor( props ){
        super(props);

        this.onCloseBtn = this.onCloseBtn.bind(this);
        this.openOperationDialog = this.openOperationDialog.bind(this);
        this.getOperations = this.getOperations.bind(this);
        this.getStartTime = this.getStartTime.bind(this);
        this.getEndTime = this.getEndTime.bind(this);
        this.getStartDateFromString = this.getStartDateFromString.bind(this);
        this.getEndDateFromString = this.getEndDateFromString.bind(this);
        this.state = {
            flowcontrolDetail: { //流控详情
                show: false,
            },
            flowcontrolEdit: { //流控修改
                show: false,
            },
            flowcontrolImpactFlights: { //流控影响航班
                show: false,
            },
            terminateFlowControl : { // 流控终止
                show : false,
            }
        }
    }
    /**
     * 获取流控开始时间 HH:MM
     * @param data  流控数据
     * @returns {String}
     * */
    getStartTime(data) {
        const { startTime, relativeStartTime } = data;
        const relative = FlowcontrolDataUtil.isRelative(data);
        if(relative){
            return `( ${ getTimeFromString(relativeStartTime)} )`
        }else {
            return getTimeFromString(startTime);
        }
    }
    /**
     * 获取流控结束时间 HH:MM
     * @param data  流控数据
     * @returns {String}
     * */
    getEndTime(data) {
        const { endTime, relativeEndTime } = data;
        const relative = FlowcontrolDataUtil.isRelative(data);
        if(relative){
            return (isValidVariable(relativeEndTime)) ? `( ${ getTimeFromString(relativeStartTime)} )` : ''
        }else {
            return (isValidVariable(endTime)) ?  getTimeFromString(endTime) : ''
        }
    }

    /**
     * 获取流控开始日期 yyyy-mm-dd
     * @param data  流控数据
     * @returns {String}
     * */
    getStartDateFromString(data){
        const { startTime, relativeStartTime } = data;
        const relative = FlowcontrolDataUtil.isRelative(data);
        if(relative){
            return `( ${ getDateFromString(relativeStartTime)} )`
        }else {
            return getDateFromString(startTime);
        }
    }
    /**
     * 获取流控结束日期 yyyy-mm-dd
     * @param data  流控数据
     * @returns {String}
     * */
    getEndDateFromString(data) {
        const { endTime, relativeEndTime } = data;
        const relative = FlowcontrolDataUtil.isRelative(data);
        if(relative){
            return (isValidVariable(relativeEndTime)) ? `( ${ getDateFromString(relativeStartTime)} )` : ''
        }else {
            return (isValidVariable(endTime)) ?  getDateFromString(endTime) : ''
        }
    }


    //操作列--根据key开启操作模块（详情、修改页面、流控影响航班、终止等）
    openOperationDialog( key, casaStatus ){
        if( key != undefined || key != "" ){
            if( key == 'flowcontrolImpactFlights' ){
                if( isValidVariable(casaStatus) && casaStatus == "计算中" ){
                    Modal.warning({
                        iconType : 'exclamation-circle',
                        title: '提示',
                        content: '流控正在计算中,请稍后再试',
                        okText: `确定`
                    });
                }else{
                    this.setState({
                        [key] : {
                            show: true
                        }
                    });
                }
            }else{
                this.setState({
                    [key] : {
                        show: true
                    }
                });
            }
        }
    };
    //当点击关闭按钮时，type: 类型
    onCloseBtn( type ){
        this.setState({
            [type]: {
                show: false
            }
        });
    }

    // 获取操作选项
    getOperations(operations, casaStatus) {
        // 先排序
        operations.sort((a,b) => {
            return a.order * 1 - b.order * 1;
        });

        return operations.map((item,index) => {
            if(item.show){
                return (
                    <i className={`iconfont icon-${item.type}`} key={index} title={ item.cn} onClick={()=>{
                        this.openOperationDialog(item.en, casaStatus);
                    }} />
                )
            }

        })
    }

    render(){
        const { singleFlowcontrolData, flowGenerateTime, systemConfig, indexNumber } = this.props;
        const formatData = FlowcontrolDataUtil.convertSingleFlowcontrolDataForList( singleFlowcontrolData, flowGenerateTime, systemConfig);
        const { name, id, placeTypeZh, dialogName, category, statusZh,  statusClassName, controlPoints, limitTypeZh, limitValue,
            limitValueUnit,  controlDirection, casaStatusZh, reasonZh,  operations,
        } = formatData;
        const startTime = this.getStartTime(singleFlowcontrolData);
        const endTime = this.getEndTime(singleFlowcontrolData);
        const startDate = this.getStartDateFromString(singleFlowcontrolData);
        const endDate = this.getEndDateFromString(singleFlowcontrolData);
        const { flowcontrolDetail, flowcontrolEdit, flowcontrolImpactFlights, terminateFlowControl } = this.state;
        return (
            <Col span={24} className="flow-item">
                <Row className="title">
                    <Col span={17} className={ statusClassName ? `${statusClassName} status` : 'status'}
                         title={ `流控名称:${name}  ${statusZh}`}
                    >
                        <span className="number"  title={placeTypeZh ? `${placeTypeZh}流控`: ''} >{ placeTypeZh }</span>
                        {name}
                    </Col>
                    <Col  span={1} ></Col>
                    <Col  span={6} className="effective-time"  >
                        <i className="iconfont icon-time" title="生效时间" />
                        <span title={`${startDate}/${endDate}`}>{startTime}-{endTime}</span>
                    </Col>
                </Row>
                <Row className="row value-title">
                    <Col span={4} >限制类型</Col>
                    <Col span={4} >限制数值</Col>
                    <Col span={6} >受控航路点</Col>
                    <Col span={6} >受控降落机场</Col>
                    <Col span={4} >原因</Col>
                </Row>
                <Row className="row value">
                    <Col span={4} className="type" title={limitTypeZh ? `限制类型:${limitTypeZh}` : ''}>{limitTypeZh}</Col>
                    <Col span={4} className="value" title={ limitValue ? `限制数值:${limitValue} ${limitValueUnit}` : '' }> { `${limitValue} ${limitValueUnit}` } </Col>
                    <Col span={6} className="points" title={controlPoints ? `受控航路点:${controlPoints}` : ''}>{controlPoints}</Col>
                    <Col span={6} className="control-direction" title={controlDirection ? `受控降落机场:${controlDirection}`: '' }>{controlDirection}</Col>
                    <Col span={4} className="reason" title={reasonZh ? `原因:${reasonZh}` : ''}>{reasonZh}</Col>
                </Row>
                <Row className="row">
                    <Col span={3} className="casaStatus">
                        { casaStatusZh }
                    </Col>
                    <Col className="operator" span={21}>

                        {
                            this.getOperations(operations, casaStatusZh)
                        }
                    </Col>

                </Row>
                {
                    flowcontrolDetail.show ?
                        <CreateLayer
                            className="flowcontol-layer"
                        >
                            <FlowcontrolDetailContainer
                                titleName="流控信息详情"
                                type="flowcontrolDetail"
                                singleFlowcontrolData = { singleFlowcontrolData }
                                placeType={singleFlowcontrolData.placeType}
                                id = {id}
                                x = { 360 }
                                y = { 60 }
                                clickCloseBtn={ this.onCloseBtn }
                            />
                        </CreateLayer> : ''
                }
                {
                    flowcontrolEdit.show ?
                        <CreateLayer
                            className="flowcontol-layer"
                        >
                            <FlowcontrolDialogContainer
                                titleName= { dialogName+'-修改' }
                                type="flowcontrolEdit"
                                clickCloseBtn={ this.onCloseBtn }
                                placeType = {singleFlowcontrolData.placeType}
                                category = { category }
                                id = {id}
                                x = { 300 }
                                y = { 60 }
                            />
                        </CreateLayer>

                        : ''
                }
                {
                    flowcontrolImpactFlights.show ?
                        <CreateLayer
                            className="flowcontol-layer"
                        >
                            <ImpactContainer
                                formatData = { formatData }
                                type = "flowcontrolImpactFlights"
                                x = { 200 }
                                y = { 60 }
                                id = {id}
                                clickCloseBtn={ this.onCloseBtn }
                            />
                        </CreateLayer> : ''
                }

                {
                    terminateFlowControl.show ?
                        <CreateLayer
                            className="flowcontol-layer"
                        >
                            <TerminateContainer
                                titleName="终止流控"
                                type = "terminateFlowControl"
                                x = { 400 }
                                y = { 60 }
                                id = {id}
                                clickCloseBtn={ this.onCloseBtn }
                            />
                        </CreateLayer>
                        : ''
                }

            </Col>




        )
    }
};

export default FlowcontrolItem;