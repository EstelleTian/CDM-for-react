//限制信息详情
import React from 'react';
import {Row, Col, Icon,} from 'antd';
import DraggableModule from "components/DraggableModule/DraggableModule";
import {getRestrictionDetailUrl} from 'utils/request-urls';
import {formatTimeString, getDayTimeFromString} from "utils/basic-verify";
import {requestGet} from 'utils/request-actions';
import {RestrictionUtil} from 'utils/restriction-data-util';
import './RestrictionDetail.less';

class RestrictionDetail extends React.Component {
    constructor(props) {
        super(props);
        this.getRestrictionDetail = this.getRestrictionDetail.bind(this);
        this.handleRestrictionDetailData = this.handleRestrictionDetailData.bind(this);
        this.converRestrictionData = this.converRestrictionData.bind(this);
        this.state = {}
    }

    // 获取限制详情数据
    getRestrictionDetail() {
        const { id, loginUserInfo } = this.props;
        const {userId} = loginUserInfo;
        // 参数
        let params = {
            id,
            userId
        };
        // 发送请求并指定回调方法
        requestGet(getRestrictionDetailUrl,  params, this.handleRestrictionDetailData);
    }

    // 处理限制详情数据
    handleRestrictionDetailData(res) {
        // 取响应结果中的限制数据
        if (res && res.status == 200) {
            const { dataMap={} } = res;
            const {restriction} = dataMap;
            this.converRestrictionData(restriction);
        }
    }
    // 转换数据
    converRestrictionData(data) {

       const setEffectiveTime = (data) => {
            const  {startTime, generateTime, endTime, lastModifyTime } = data;
            let star = '';
            let end = '';
            // 取开始时间和创建时间值最大的
            if(startTime && generateTime){
                star = startTime*1 < generateTime*1 ? generateTime : startTime;
            }else {
                star = startTime ? startTime : generateTime || '';
            }

            if(endTime && lastModifyTime){
                end = endTime*1 < lastModifyTime ? endTime : lastModifyTime;
            }else {
                end = endTime ? endTime : lastModifyTime || '';
            }

            return `${star} ~ ${end}`;

        };

        // 名称
        let name = data.name || '';
        // 状态
        let status = RestrictionUtil.setStatus(data);
        let statusClassName = RestrictionUtil.setstatusClassName(data);
        // 生效时间
        let effectiveTime = setEffectiveTime(data);
        // 发布用户
        let publishUserZh = data.publishUserZh || '';
        // 开始时间
        let startTime = data.startTime || '';
        // 终止时间
        let endTime = data.endTime || '';
        // 创建时间
        let generateTime = data.generateTime || '';
        // 最后修改时间
        let lastModifyTime = data.lastModifyTime || '';
        // 间隔
        let value = data.value ? `${data.value}(分钟)` : '';
        // 用户组
        let deiceGroup = data.deiceGroup || '';
        // 航空公司
        let deiceFlights = data.deiceFlights || '';
        this.setState({
            name,
            status,
            statusClassName,
            publishUserZh,
            effectiveTime,
            startTime,
            endTime,
            generateTime,
            lastModifyTime,
            value,
            deiceGroup,
            deiceFlights
        })
    }

    componentDidMount() {
        // 获取限制详情数据
        this.getRestrictionDetail()
    }

    render() {
        const {titleName, clickCloseBtn, width = 500, dialogName, x = 300, y} = this.props;
        const {name, status, statusClassName, publishUserZh, effectiveTime, startTime, endTime,
            generateTime, lastModifyTime, value, deiceGroup, deiceFlights } = this.state;
        const Layout24 = {span: 24};
        const Layout6 = {span: 6};
        const Layout18 = {span: 18};

        return (
            <DraggableModule
                bounds=".root"
                x={x}
                y={y}
            >
                <div className="box center no-cursor" style={{width: width}}>
                    <div className="dialog">
                        {/* 头部*/}
                        <Row className="title drag-target cursor">
                            <span>{ titleName }</span>
                            <div
                                className="close-target"
                                onClick={ () => {
                                    clickCloseBtn(dialogName);
                                } }
                            >
                                <Icon type="close" title="关闭"/>
                            </div>
                        </Row>
                        {/* 表单内容*/}
                        <Row className="content restriction-detail">
                            <Col {...Layout24}>
                                <Row>
                                    <Col {...Layout24} className="head">
                                        <h1 className="name">{name}</h1>
                                        <div className={ statusClassName? `status ${statusClassName}` : 'status'}> {status}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24}>
                                        <Row>
                                            <Col {...Layout6}>
                                                <div className="trem">名称</div>
                                            </Col>
                                            <Col {...Layout18}>
                                                <div>{name}</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col {...Layout6}>
                                                <div className="trem">发布用户</div>
                                            </Col>
                                            <Col {...Layout18}>
                                                <div>{publishUserZh}</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col {...Layout6}>
                                                <div className="trem">生效时间范围</div>
                                            </Col>
                                            <Col {...Layout18}>
                                                <div>{effectiveTime}</div>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col {...Layout6}>
                                                <div className="trem">创建时间</div>
                                            </Col>
                                            <Col {...Layout18}>
                                                <div>{generateTime}</div>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col {...Layout6}>
                                                <div className="trem">开始时间</div>
                                            </Col>
                                            <Col {...Layout18}>
                                                <div>{startTime}</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col {...Layout6}>
                                                <div className="trem">终止时间</div>
                                            </Col>
                                            <Col {...Layout18}>
                                                <div>{endTime}</div>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col {...Layout6}>
                                                <div className="trem">最后修改时间</div>
                                            </Col>
                                            <Col {...Layout18}>
                                                <div>{lastModifyTime}</div>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col {...Layout6}>
                                                <div className="trem">除冰间隔</div>
                                            </Col>
                                            <Col {...Layout18}>

                                                <div>{ value }</div>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col {...Layout6}>
                                                <div className="trem">用户组</div>
                                            </Col>
                                            <Col {...Layout18}>
                                                <div>{deiceGroup}</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col {...Layout6}>
                                                <div className="trem">航空公司</div>
                                            </Col>
                                            <Col {...Layout18}>
                                                <div>{deiceFlights}</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>
            </DraggableModule>
        )
    }
}
;

export default RestrictionDetail ;