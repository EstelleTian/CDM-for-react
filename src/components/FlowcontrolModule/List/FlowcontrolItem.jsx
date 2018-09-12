//流控信息---菜单操作功能

import React from 'react';
import { Row, Col, Icon } from 'antd';
import './FlowcontrolItem.less';
import { convertFlowcontrolData } from 'utils/flowcontrol-data-util';
import CreateLayer from "components/CreateLayer/CreateLayer";
import FlowcontrolDetailContainer from "components/FlowcontrolModule/Detail/FlowcontrolDetailContainer";
import FlowcontrolDialogContainer from "components/FlowcontrolModule/Dialog/FlowcontrolDialog/FlowcontrolDialogContainer";

class FlowcontrolItem extends React.Component{
    constructor( props ){
        super(props);

        this.onCloseBtn = this.onCloseBtn.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.state = {
            detail: {
                show: false,
            },
            modify: {
                show: false,
            },

        }
    }
    // 打开详情
    openDetail(){
        this.setState({
            detail: {
                show: true
            }
        });
    }
    // 流控修改
    handleUpdate(){
        this.setState({
            modify : {
                show: true
            }
        });
    }
    //当点击关闭按钮时，type: 类型
    onCloseBtn( type ){
        this.setState({
            [type]: {
                show: false
            }
        });
    }

    render(){
        const { data, generateTime } = this.props;
        const { indexNumber} = this.props;
        const formatData = convertFlowcontrolData(data,generateTime);
        const { name, id, publishUserZh, reason, placeType, dialogName,
            status, statusClassName, controlPoints, type, value, controlDirection,
            effectiveTime, effectiveDate, casaStatus,
        } = formatData;

        const { detail, modify } = this.state;
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
                    <Col span={10}>

                    </Col>
                    <Col className="operator" span={14}>
                        <i className="iconfont icon-detail" title="详情" onClick={this.openDetail} />
                        <i className="iconfont icon-effect" title="影响"/>
                        <i className="iconfont icon-edit" title="修改" onClick={this.handleUpdate}/>
                        <i className="iconfont icon-stop" title="终止"/>
                    </Col>

                </Row>
                {
                    detail.show ?
                        <CreateLayer
                            className="flowcontol-layer"
                        >
                            <FlowcontrolDetailContainer
                                titleName="流控信息详情"
                                type="detail"
                                id = {id}
                                x = { 360 }
                                y = { 60 }
                                placeType = { data.placeType }
                                clickCloseBtn={ this.onCloseBtn }
                            />
                        </CreateLayer> : ''
                }
                {
                    modify.show ?
                        <CreateLayer
                            className="flowcontol-layer"
                        >
                            <FlowcontrolDialogContainer
                                titleName= { dialogName}
                                type="modify"
                                clickCloseBtn={ this.onCloseBtn }
                                placeType = {data.placeType}
                                limitType = {data.typeSubclass}
                                id = {id}
                                x = { 300 }
                                y = { 60 }
                            />
                        </CreateLayer>

                        : ''
                }
            </Col>




        )
    }
};

export default FlowcontrolItem;