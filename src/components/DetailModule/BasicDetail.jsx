//航班详情----航班信息
import React from 'react';
import { Row, Col, Popover } from 'antd';
import { FlightCoordination } from "utils/flightcoordination";
import { getDayTimeFromString } from "utils/basic-verify";
import "./BasicDetail.less";

class BasicDetail extends React.Component{
    constructor( props ){
        super( props );
        this.getDetailComponent = this.getDetailComponent.bind(this);
    }

    getDetailComponent(){
        const { basicMap = {}, name = "" } = this.props;
        const colLayout = {
            span: 6
        };
        let resDom;
        if( name == "flightBasicMap" ){
            const {
                STATUS = {}, RDEPTIME = {}, RARRTIME = {}, FORMER_EARRTIME = {},
                ARRAP = {}, DEPAP = {}, ID = {}, REGNUM = {}, AIRCRAFTYPE = {},
                TELENEW = {}, CTOBT = {}, ASBT = {}, AGCT = {},
                SDEPTIME = {}, SARRTIME = {}, SROUTE = {}, TELETYPE = {},
                PDEPTIME = {}, PARRTIME = {}, PROUTE = {}, CPLINFO = {}, CARRIER = {}
            } = basicMap;
            const status = FlightCoordination.getStatusZh(STATUS.value || "——");
            const depTime = getDayTimeFromString( RDEPTIME.value ) || "——";
            const arrTime = getDayTimeFromString( RARRTIME.value ) || "——";
            const formerArrTime = getDayTimeFromString( FORMER_EARRTIME.value ) || "——";
            const ctobt = getDayTimeFromString( CTOBT.value ) || "——";
            const asbt = getDayTimeFromString( ASBT.value ) || "——";
            const agct = getDayTimeFromString( AGCT.value ) || "——";
            const sdpeTime = getDayTimeFromString( SDEPTIME.value ) || "——";
            const sarrTime = getDayTimeFromString( SARRTIME.value ) || "——";
            const pdpeTime = getDayTimeFromString( PDEPTIME.value ) || "——";
            const parrTime = getDayTimeFromString( PARRTIME.value ) || "——";
            resDom = (
                <div className="panel-content">
                    <div span={ 24 } className="imaging-info">
                        <div>
                            <div className="airport" title="起飞机场">
                                { DEPAP.value || "——" }
                            </div>
                            <div className="atime" title={ `实际起飞时间${RDEPTIME.value || ""}` }>
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
                            <div className="atime" title={ `实际降落时间${RARRTIME.value || ""}` }>
                                { arrTime }
                            </div>
                        </div>


                    </div>
                    <Row className="info">
                        <Col span={5} className="cell">
                            <div className="cell-title">ID</div>
                            <span>{ ID.value || "——" }</span>
                        </Col>
                        <Col span={5} className="cell">
                            <div className="cell-title">注册号</div>
                            <span>{REGNUM.value || "——"}</span>
                        </Col>
                        <Col span={4} className="cell">
                            <div className="cell-title">机型</div>
                            <span>{AIRCRAFTYPE.value || "——"}</span>
                        </Col>
                        <Col span={5} className="cell">
                            <div className="cell-title">所属公司</div>
                            <span>{CARRIER.value || "——"}</span>
                        </Col>
                        <div span={5} className="cell tele">
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

                    </Row>
                    <Row className="info">
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">前段实降时间</div>
                            <span title={ FORMER_EARRTIME.value || "——" }>{ formerArrTime }</span>
                        </Col>
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
            );
        }else if( name == "flightFormerMap" ){
            const {
                FORMER_ID = {}, FORMER_DEPAP = {}, FORMER_ARRAP = {}, FORMER_RDEPTIME = {}, FORMER_RARRTIME = {},
                FORMER_REGNUM = {}, FORMER_ACTYPE = {}, FORMER_TELENEW = {}, FORMER_TELETYPE = {}, FORMER_AGCT = {}, FORMER_AOBT = {},
                FORMER_SDEPTIME = {}, FORMER_SARRTIME = {}, FORMER_PDEPTIME = {}, FORMER_PARRTIME = {},
                FORMER_SROUTE = {}, FORMER_PROUTE = {}, FORMER_CPLINFO = {}, FORMER_FLIGHTID = {}, FORMER_CARRIER = {}
            } = basicMap;
            const depTime = getDayTimeFromString( FORMER_RDEPTIME.value ) || "——";
            const arrTime = getDayTimeFromString( FORMER_RARRTIME.value ) || "——";
            const agctTime = getDayTimeFromString( FORMER_AGCT.value ) || "——";
            const aobtTime = getDayTimeFromString( FORMER_AOBT.value ) || "——";
            const sdpeTime = getDayTimeFromString( FORMER_SDEPTIME.value ) || "——";
            const sarrTime = getDayTimeFromString( FORMER_SARRTIME.value ) || "——";
            const pdpeTime = getDayTimeFromString( FORMER_PDEPTIME.value ) || "——";
            const parrTime = getDayTimeFromString( FORMER_PARRTIME.value ) || "——";

            resDom = (
                <div className="panel-content">
                    <div span={ 24 } className="imaging-info">
                        <div>
                            <div className="airport" title="起飞机场">
                                { FORMER_DEPAP.value || "——" }
                            </div>
                            <div className="atime" title={ `实际起飞时间${FORMER_RDEPTIME.value || ""}` }>
                                { depTime }
                            </div>
                        </div>
                        <div className="airport-line">
                            <div className="icon">
                                <i className="iconfont icon-airport"></i>
                            </div>
                        </div>
                        <div>
                            <div className="airport" title="降落机场">
                                { FORMER_ARRAP.value || "——" }
                            </div>
                            <div className="atime" title={ `实际降落时间${FORMER_RARRTIME.value || ""}` }>
                                { arrTime }
                            </div>
                        </div>
                    </div>
                    <Row className="info">
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">航班号</div>
                            <span>{ FORMER_FLIGHTID.value || "——" }</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">关门时间</div>
                            <span title={ FORMER_AGCT.value || "——" }>{ agctTime || "——" }</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">推出时间</div>
                            <span title={ FORMER_AOBT.value || "——" }>{ aobtTime || "——" }</span>
                        </Col>
                        <div {...colLayout} className="cell tele">
                            <div className="cell-title">最新报文</div>
                            <span>{ FORMER_TELENEW.value || "——" }</span>
                            <Popover
                                title={ (
                                    <span>报文记录</span>
                                )}
                                content={ (
                                    <span>{FORMER_TELETYPE.value || "——"}</span>
                                )}
                                placement="right"
                            >
                                <i className="iconfont icon-detail" title="查看报文记录"></i>
                            </Popover>
                        </div>

                    </Row>
                    <Row className="info">
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">ID</div>
                            <span>{ FORMER_ID.value || "——" }</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">注册号</div>
                            <span>{FORMER_REGNUM.value || "——"}</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">机型</div>
                            <span>{FORMER_ACTYPE.value || "——"}</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">所属公司</div>
                            <span>{FORMER_CARRIER.value || "——"}</span>
                        </Col>
                    </Row>
                    <Row className="info">
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">计划起飞</div>
                            <span title={ FORMER_SDEPTIME.value || "——" }>{ sdpeTime || "——" }</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">计划降落</div>
                            <span title={ FORMER_SARRTIME.value || "——" }>{ sarrTime || "——" }</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">FPL起飞</div>
                            <span title={ FORMER_PDEPTIME.value || "——" }>{ pdpeTime || "——" }</span>
                        </Col>
                        <Col {...colLayout} className="cell">
                            <div className="cell-title">FPL降落</div>
                            <span title={ FORMER_PARRTIME.value || "——" }>{ parrTime || "——" }</span>
                        </Col>
                    </Row>
                    <Row className="info">
                        <Col span={ 6 } className="cell">
                            <div className="cell-title">计划航路</div>
                            <span className="route">{ FORMER_SROUTE.value || "——" }</span>
                        </Col>
                        <Col span={ 12 } className="cell">
                            <div className="cell-title">FPL航路</div>
                            <span className="route">{ FORMER_PROUTE.value || "——" }</span>
                        </Col>
                        <Col span={ 6 } className="cell">
                            <div className="cell-title">CPL信息</div>
                            <span className="route">{ FORMER_CPLINFO.value || "——" }</span>
                        </Col>
                    </Row>
                </div>
            );
        }
        return resDom;

    };

    render(){
        const panelLayout = {
            xl: 24,
            sm: 24,
            md: 24,
            lg: 24,
            xl: 24
        };
        const Dom = this.getDetailComponent();
        return (
            <Col {...panelLayout} className="panel">
                { Dom }
            </Col>
        )


    }

};

export default BasicDetail;