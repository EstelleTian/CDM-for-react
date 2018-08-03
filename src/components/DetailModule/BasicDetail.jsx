//航班表格上右键协调对话框
import React from 'react';
import { Row, Col, Popover } from 'antd';
import { FlightCoordination } from "utils/flightcoordination";
import { getTimeFromString } from "utils/basic-verify";
import "./BasicDetail.less";


class BasicDetail extends React.Component{
    constructor( props ){
        super( props );
    }

    render(){
        const { basicMap = {} } = this.props;
        const panelLayout = {
            xl: 24,
            sm: 24,
            md: 24,
            lg: 12,
            xl: 8
        };
        const colLayout = {
            span: 6
        };

        const {
            STATUS = {}, RDEPTIME = {}, RARRTIME = {}, FORMER_EARRTIME = {},
            ARRAP = {}, DEPAP = {}, ID = {}, REGNUM = {}, AIRCRAFTYPE = {},
            TELENEW = {}, CTOBT = {}, ASBT = {}, AGCT = {},
            SDEPTIME = {}, SARRTIME = {}, SROUTE = {}, TELETYPE = {},
            PDEPTIME = {}, PARRTIME = {}, PROUTE = {}, CPLINFO = {}
        } = basicMap;
        const status = FlightCoordination.getStatusZh(STATUS.value || "——");
        const depTime = getTimeFromString( RDEPTIME.value ) || "——";
        const arrTime = getTimeFromString( RARRTIME.value ) || "——";
        const formerArrTime = getTimeFromString( FORMER_EARRTIME.value ) || "——";
        const ctobt = getTimeFromString( CTOBT.value ) || "——";
        const asbt = getTimeFromString( ASBT.value ) || "——";
        const agct = getTimeFromString( AGCT.value ) || "——";
        const sdpeTime = getTimeFromString( SDEPTIME.value ) || "——";
        const sarrTime = getTimeFromString( SARRTIME.value ) || "——";
        const pdpeTime = getTimeFromString( PDEPTIME.value ) || "——";
        const parrTime = getTimeFromString( PARRTIME.value ) || "——";

        return (
            <Col {...panelLayout} className="panel">
                <Col offset={2} span={20} className="panel-title">
                    <i className="iconfont icon-circle-m"></i>
                    <span>航班信息</span>
                </Col>
                <div className="panel-content">
                    <div span={ 24 } className="imaging-info">
                        <div>
                            <div className="airport" title="起飞机场">
                                { DEPAP.value || "——" }
                            </div>
                            <div className="atime" title={ `实际起飞时间${RDEPTIME.value || "——"}` }>
                                { depTime }
                            </div>
                        </div>
                        <div className="airport-line">
                            <div className="icon">
                                <i className="iconfont icon-airport"></i>
                            </div>
                            <div className="status">{ status }</div>
                        </div>
                        <div>
                            <div className="airport" title="降落机场">
                                { ARRAP.value || "——" }
                            </div>
                            <div className="atime" title={ `实际降落时间${RARRTIME.value || "——"}` }>
                                { arrTime }
                            </div>
                        </div>
                        <div className="cell tele">
                            <div className="cell-title">最新报文</div>
                            <span>{ TELENEW.value || "——" }</span>
                            <Popover
                                title={ (
                                    <span>报文记录</span>
                                )}
                                content={ (
                                    <span>{TELETYPE.value || "——"}</span>
                                )}
                                placement="right"
                            >
                                <i className="iconfont icon-detail" title="查看报文记录"></i>
                            </Popover>
                        </div>

                    </div>
                    <Row className="info">
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">ID</div>
                            <span>{ ID.value || "——" }</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">注册号</div>
                            <span>{REGNUM.value || "——"}</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">机型</div>
                            <span>{AIRCRAFTYPE.value || "——"}</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">前段实降时间</div>
                            <span title={ FORMER_EARRTIME.value || "——" }>{ formerArrTime }</span>
                        </Col>

                    </Row>
                    <Row className="info">
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">预计关门时间</div>
                            <span title={ CTOBT.value || "——" }>{ ctobt || "——" }</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">上客时间</div>
                            <span title={ ASBT.value || "——" }>{ asbt || "——" }</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">关门时间</div>
                            <span title={ AGCT.value || "——" }>{ agct || "——" }</span>
                        </Col>
                    </Row>
                    <Row className="info">
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">计划起飞</div>
                            <span title={ SDEPTIME.value || "——" }>{ sdpeTime || "——" }</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">计划降落</div>
                            <span title={ SARRTIME.value || "——" }>{ sarrTime || "——" }</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">FPL起飞</div>
                            <span title={ PDEPTIME.value || "——" }>{ pdpeTime || "——" }</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">FPL降落</div>
                            <span title={ PARRTIME.value || "——" }>{ parrTime || "——" }</span>
                        </Col>
                    </Row>
                    <Row className="info">
                        <Col span={ 8 } className="cell">
                            <div className="cell-title">计划航路</div>
                            <span className="route">{ SROUTE.value || "——" }</span>
                        </Col>
                        <Col span={ 8 } className="cell">
                            <div className="cell-title">FPL航路</div>
                            <span className="route">{ PROUTE.value || "——" }</span>
                        </Col>
                        <Col span={ 8 } className="cell">
                            <div className="cell-title">CPL信息</div>
                            <span className="route">{ CPLINFO.value || "——" }</span>
                        </Col>
                    </Row>
                </div>
            </Col>
        )
    }

};

export default BasicDetail;