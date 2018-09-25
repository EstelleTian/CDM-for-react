//流控信息---菜单操作功能
import React from 'react';
import { Row, Col, Icon, Modal } from 'antd';
import {isValidVariable} from "utils/basic-verify";
import { convertFlowcontrolData } from 'utils/flowcontrol-data-util';
import CreateLayer from "components/CreateLayer/CreateLayer";
import FlowcontrolDetailContainer from "components/FlowcontrolModule/Detail/FlowcontrolDetailContainer";
import FlowcontrolDialogContainer from "components/FlowcontrolModule/Dialog/FlowcontrolDialog/FlowcontrolDialogContainer";
import ImpactContainer from "components/FlowcontrolModule/Impact/ImpactContainer";
import './FlowcontrolItem.less';

class FlowcontrolItem extends React.Component{
    constructor( props ){
        super(props);

        this.onCloseBtn = this.onCloseBtn.bind(this);
        this.openOperationDialog = this.openOperationDialog.bind(this);
        this.getOperations = this.getOperations.bind(this);

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
        const { data, generateTime, systemConfig, indexNumber } = this.props;
        const formatData = convertFlowcontrolData( data, generateTime, systemConfig);
        const { name, id, publishUserZh, reason, placeType, dialogName,
            status, statusClassName, controlPoints, type, value, controlDirection,
            effectiveTime, effectiveDate, casaStatus, operations,
        } = formatData;

        const { flowcontrolDetail, flowcontrolEdit, flowcontrolImpactFlights } = this.state;
        return (
            <Col span={24} className="flow-item">
                <Row className="title">
                    <Col span={17} className={ statusClassName ? `${statusClassName} status` : 'status'}
                         title={ `流控名称:${name}  ${status} ${casaStatus}`}
                    >
                        <span className="number"  title={placeType ? `${placeType}流控`: ''} >{indexNumber + " " + placeType }</span>
                        {name}
                    </Col>
                    <Col  span={1} ></Col>
                    <Col  span={6} className="effective-time" title={effectiveDate ? `${effectiveDate}`: ''} >
                        <i className="iconfont icon-time" title="生效时间" />
                        <span>{effectiveTime}</span>
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
                    <Col span={4} className="type" title={type ? `限制类型:${type}` : ''}>{type}</Col>
                    <Col span={4} className="value" title={ value ? `限制数值:${value}` : '' }> { value } </Col>
                    <Col span={6} className="points" title={controlPoints ? `受控航路点${controlPoints}` : ''}>{controlPoints}</Col>
                    <Col span={6} className="control-direction" title={controlDirection ? `受控降落机场:${controlDirection}`: '' }>{controlDirection}</Col>
                    <Col span={4} className="reason" title={reason ? `原因:${reason}` : ''}>{reason}</Col>
                </Row>
                <Row className="row">
                    <Col span={3} className="casaStatus">
                        { casaStatus }
                    </Col>
                    <Col className="operator" span={21}>

                        {
                            this.getOperations(operations, casaStatus)
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
                                id = {id}
                                x = { 360 }
                                y = { 60 }
                                placeType = { data.placeType }
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
                                titleName= { dialogName}
                                type="flowcontrolEdit"
                                clickCloseBtn={ this.onCloseBtn }
                                placeType = {data.placeType}
                                limitType = {data.typeSubclass || data.type}
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
            </Col>




        )
    }
};

export default FlowcontrolItem;