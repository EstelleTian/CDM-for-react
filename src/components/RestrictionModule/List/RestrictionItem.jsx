//除冰限制信息---列表项组件

import React from 'react';
import { Row, Col, Icon } from 'antd';
import { convertRestrictionData } from 'utils/restriction-data-util';
import CreateLayer from "components/CreateLayer/CreateLayer";
import RestrictionDetailContainer from "components/RestrictionModule/Detail/RestrictionDetailContainer";
import './RestrictionItem.less';
class RestrictionItem extends React.Component{
    constructor( props ){
        super(props);
        this.onCloseBtn = this.onCloseBtn.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.state = {
            detail: {
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
    //当点击关闭按钮时，type: 类型
    onCloseBtn( type ){
        this.setState({
            [type]: {
                show: false
            }
        });
    }
    render(){
        const { data, generateTime, indexNumber } = this.props;
        const formatData = convertRestrictionData(data,generateTime);
        const { name, id, publishUserZh, value, deiceFlights, createdDate, createdTime,
            status, statusClassName, effectiveTime, effectiveDate,
        } = formatData;
        const {detail} = this.state;
        return (
            <Col span={24} className="restriction-item">
                <Row className="title">
                    <Col span={17} className={ statusClassName ? `${statusClassName} status` : 'status'}
                         title={ `名称:${name}  ${status}`}
                    >
                        <span className="number" >{indexNumber}</span>
                        {name}

                    </Col>
                    <Col  span={1} ></Col>
                    <Col  span={6} className="effective-time" title={effectiveDate ? `${effectiveDate}`: ''} >
                        <i className="iconfont icon-time" title="生效时间" />
                        <span>{effectiveTime}</span>
                    </Col>

                </Row>

                <Row className="row value-title">
                    <Col span={4} >发布者</Col>
                    <Col span={4} >创建时间</Col>
                    <Col span={4} >限制数值</Col>
                    <Col span={12} >航空公司</Col>
                </Row>
                <Row className="row value">
                    <Col span={4} className="publish-user" title={publishUserZh ? `发布者:${publishUserZh}` : ''}>{publishUserZh}</Col>
                    <Col span={4} className="created-time" title={ createdDate ? `创建时间:${createdDate} ${createdTime}` : '' }> { createdTime } </Col>
                    <Col span={4} className="value" title={value ? `限制数值:${value}` : ''}>{value}</Col>
                    <Col span={12} className="deice-flights" title={deiceFlights ? `航空公司:${deiceFlights}` : ''}>{deiceFlights}</Col>
                </Row>
                <Row className="row">
                    <Col className="operator" span={24}>
                        <i className="iconfont icon-detail" title="详情" onClick={this.openDetail} />
                        <i className="iconfont icon-effect" title="影响"/>
                        <i className="iconfont icon-edit" title="修改"/>
                        <i className="iconfont icon-stop" title="终止"/>
                    </Col>
                </Row>
                {
                    detail.show ?
                        <CreateLayer
                            className="flowcontol-layer"
                        >
                            <RestrictionDetailContainer
                                titleName="限制信息详情"
                                type="detail"
                                id = {id}
                                x = { 500 }
                                y = { 200 }
                                placeType = { data.placeType }
                                clickCloseBtn={ this.onCloseBtn }
                            />
                        </CreateLayer> : ''
                }
            </Col>
        )
    }
};

export default RestrictionItem;