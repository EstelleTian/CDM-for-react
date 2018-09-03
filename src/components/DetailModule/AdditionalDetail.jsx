//航班详情----其他详情信息
import React from 'react';
import { Row, Col } from 'antd';
import TableLayoutDetail from './TableLayoutDetail';
import { FlightCoordination } from 'utils/flightcoordination';
import FlowcontrolUtils from 'utils/flowcontrol-utils';
import {getDayTimeFromString} from "utils/basic-verify";
import BasicDetail from "components/DetailModule/BasicDetail";
import "./AdditionalDetail.less";

const NameList = {
    FLIGHT_BASIC: "flightBasic", //航班信息
    FLIGHT_FORMER: "flightFormer", //前段航班信息
    OPERATION: "operation", //运行分析信息
    RUNWAY: "runway", //机位&跑道&除冰信息
    FLIGHT_EFPS: "flightEFPS", //电子进程单
    FLOWCONTROL: "flowcontrol", //命中流控
    RECORD: "record", //协调记录
    PRIORITY: "priority", //航班协调信息
    COORDINATION: "coordination", //协调信息
    TRAINFO: "traInfo", //航迹信息
};

class AdditionalDetail extends React.Component{
    constructor( props ){
        super( props );
        this.toggleList = this.toggleList.bind(this);
        this.state = {
            active: [NameList.FLIGHT_BASIC, NameList.RECORD, NameList.OPERATION]
        }
    }
    //模块切换
    toggleList( name ){
        const curActive = this.state.active;
        //如果有，则关闭
        const index = curActive.indexOf(name);
        let newActive = curActive;
        if( index > -1 ){
            //去掉该值
            newActive.splice( index, 1 );
        }else{ //如果没有，则看长度，如果小于3，添加； 大于3，去掉最后一个后添加
            // if( curActive.length < 3 ){
            //     newActive.push( name );
            // }else{
            //     //去掉最后一个
            //     newActive.splice( 2, 1 );
            //     newActive.push( name );
            // }
            newActive.push( name );
        }
        //赋值
        this.setState({
            active: newActive
        })
    };

    render(){
        const Layout = {
            xl: 24,
            sm: 24,
            md: 24,
            lg: 24,
            xl: 24
        };
        const colLayout = {
            span: 12
        };
        let { active } = this.state;
        const { flightDetailView = {}, unfoldAll } = this.props;
        if( unfoldAll ){
            active = Object.values(NameList);
        }

        const {
            flightDelayMap = {}, positionAndRunwayAndDeiceMap = {}, obtAndTotMap = {}, priorityAndPoolMap = {},
            flightEFPSMap = {}, flightTrajectorMap = {}, flowcontrolMap = {}, recordMap = {}, flightBasicMap = {},
            flightFormerMap = {}
        } = flightDetailView;
        //运行分析信息
        const {
            CLOSE_WAIT, TAXI_WAIT, SDELAY, PDELAY,
            OUTTIME_DEVIATE, COLSE_DEVIATE, DEP_DEVIATE
        } = flightDelayMap;
        //机位 除冰 跑道信息
        const {
            POSITION, RUNWAY, TAXI, DEICE_STATUS, DEICE_POSITION, DEICE_GROUP
        } = positionAndRunwayAndDeiceMap;
        //航班协调信息
        const {
            PRIORITY, POOL_STATUS, SLOT_STATUS, CLEARANCE, DELAY_REASON, QUALIFICATIONS
        } = priorityAndPoolMap;
        //电子进程单
        const {
            EFPS_SID, EFPS_ICEID, EFPS_REQTIME, EFPS_PUSTIME, EFPS_LINTIME,
            EFPS_IN_ICETIME, EFPS_IN_DHLTIME, EFPS_OUT_ICETIME, EFPS_OUT_DHLTIME
        } = flightEFPSMap;
        const reqTime = getDayTimeFromString( EFPS_REQTIME.value ) || "——";
        const pusTime = getDayTimeFromString( EFPS_PUSTIME.value ) || "——";
        const lineTime = getDayTimeFromString( EFPS_LINTIME.value ) || "——";
        const inIceTime = getDayTimeFromString( EFPS_IN_ICETIME.value ) || "——";
        const inDHLTime = getDayTimeFromString( EFPS_IN_DHLTIME.value ) || "——";
        const outIceTime = getDayTimeFromString( EFPS_OUT_ICETIME.value ) || "——";
        const outDHLTime = getDayTimeFromString( EFPS_OUT_DHLTIME.value ) || "——";
        //航迹信息--方向
        const { DIRECTION = {} } = flightTrajectorMap;
        const direction = DIRECTION.value || "";

        return (
            <Col {...Layout} className="accordion">
                <ul>
                    <li className={ (active.indexOf(NameList.FLIGHT_BASIC) > -1)  ? "active": ""} >
                        <div className="title" onClick={()=>{
                            this.toggleList(NameList.FLIGHT_BASIC);
                        }}>航班信息</div>
                        <div className="container basicDetail">
                            {
                                ( (active.indexOf(NameList.FLIGHT_BASIC) > -1) ?
                                    <BasicDetail
                                        basicMap = { flightBasicMap }
                                        name = "flightBasicMap"
                                    />
                                    : "" )
                            }
                        </div>
                    </li>
                    <li className={ (active.indexOf(NameList.FLIGHT_FORMER) > -1)  ? "active": ""}>
                        <div className="title" onClick={()=>{
                            this.toggleList(NameList.FLIGHT_FORMER);
                        }}>前段航班信息</div>
                        <div className="container formercDetail">
                            {
                                ((active.indexOf(NameList.FLIGHT_FORMER) > -1) ?
                                    <BasicDetail
                                        basicMap = { flightFormerMap }
                                        name = "flightFormerMap"
                                    />
                                    : "" )
                            }
                        </div>
                    </li>
                    <li className={ (active.indexOf(NameList.OPERATION) > -1)  ? "active": ""}>
                        <div className="title" onClick={()=>{
                            this.toggleList(NameList.OPERATION);
                        }}>运行分析信息</div>
                        <div className="container operation">
                            {
                                ((active.indexOf(NameList.OPERATION) > -1) ?
                                    <div className="content">
                                        <Row className="info">
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">关门等待</div>
                                                <span>{ CLOSE_WAIT.value || "N/A" }</span>
                                            </Col>
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">滑行等待</div>
                                                <span>{ TAXI_WAIT.value || "N/A"}</span>
                                            </Col>
                                        </Row>
                                        <Row className="info">
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">离港延误SCH</div>
                                                <span>{ (SDELAY.value || "0" ) + "mins" }</span>
                                            </Col>
                                            <div {...colLayout} className="cell">
                                                <div className="cell-title">离港延误FPL</div>
                                                <span>{ (PDELAY.value || "0" ) + "mins" }</span>
                                            </div>
                                        </Row>
                                        <Row className="info">
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title" title="推出偏离(AOBT-COBT)">推出偏离</div>
                                                <span>{ OUTTIME_DEVIATE.value || "N/A" }</span>
                                            </Col>
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title" title="关门偏离(AGCT-COBT)">关门偏离</div>
                                                <span>{ COLSE_DEVIATE.value || "N/A"}</span>
                                            </Col>
                                        </Row>
                                        <Row className="info">
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title" title="起飞偏离(ATOT-CTOT)">起飞偏离</div>
                                                <span>{ DEP_DEVIATE.value || "N/A"}</span>
                                            </Col>
                                        </Row>
                                    </div>
                                 : "" )
                            }
                        </div>
                    </li>
                    <li className={ (active.indexOf(NameList.RUNWAY) > -1)  ? "active": ""}>
                        <div className="title" onClick={()=>{
                            this.toggleList(NameList.RUNWAY);
                        }}>机位&跑道&除冰信息</div>
                        <div className="container runway">
                            {
                                ((active.indexOf(NameList.RUNWAY) > -1) ?
                                    <div className="content">
                                        <Row className="info">
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">跑道</div>
                                                <span>{ RUNWAY.value || "——" }</span>
                                            </Col>
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">滑行时间</div>
                                                <span>{ (TAXI.value || "0" ) + "mins" }</span>
                                            </Col>
                                        </Row>
                                        <Row className="info">
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">机位</div>
                                                <span>{ POSITION.value || "——" }</span>
                                            </Col>
                                            <div {...colLayout} className="cell">
                                                <div className="cell-title">是否除冰</div>
                                                <span>{ (DEICE_STATUS.value == "0" ? "否" : "是" ) }</span>
                                            </div>
                                        </Row>
                                        <Row className="info">
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">除冰位</div>
                                                <span>{ DEICE_POSITION.value || "——" }</span>
                                            </Col>
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">除冰组</div>
                                                <span>{ DEICE_GROUP.value || "——"}</span>
                                            </Col>
                                        </Row>
                                    </div>
                                    : "" )
                            }
                        </div>
                    </li>
                    <li className={ (active.indexOf(NameList.PRIORITY) > -1)  ? "active": ""}>
                        <div className="title" onClick={()=>{
                            this.toggleList(NameList.PRIORITY);
                        }}>航班协调信息</div>
                        <div className="container priority">
                            {
                                ((active.indexOf(NameList.PRIORITY) > -1) ?
                                    <div className="content">
                                        <Row className="info">
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">优先级</div>
                                                <span>{ FlightCoordination.getPriorityZh(PRIORITY.value) || "——" }</span>
                                            </Col>
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">等待池</div>
                                                <span>{ FlightCoordination.getPoolStatusZh(POOL_STATUS.value) || "——" }</span>
                                            </Col>
                                        </Row>
                                        <Row className="info">
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">时隙状态</div>
                                                <span>{ FlightCoordination.getSlotStatusZh( SLOT_STATUS.value ) || "——" }</span>
                                            </Col>
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">放行状态</div>
                                                <span>{ FlightCoordination.getClearanceZh( CLEARANCE.value || "——" ) }</span>
                                            </Col>
                                        </Row>
                                        <Row className="info">
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">延误原因</div>
                                                <span>{ FlowcontrolUtils.getReasonZh(DELAY_REASON.value) || "——" }</span>
                                            </Col>
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">资质</div>
                                                <span>{ FlightCoordination.getQualificationsZh( QUALIFICATIONS.value)  || "——" }</span>
                                            </Col>
                                        </Row>
                                    </div>
                                    : "" )
                            }
                        </div>
                    </li>
                    <li className={ (active.indexOf(NameList.COORDINATION) > -1)  ? "active": ""}>
                        <div className="title" onClick={()=>{
                            this.toggleList(NameList.COORDINATION);
                        }}>协调信息</div>
                        <div className="container coordination">
                            {
                                ((active.indexOf(NameList.COORDINATION) > -1) ?
                                    <div className="content">
                                        <TableLayoutDetail
                                            name = "obtAndTotMap"
                                            orgMap = { obtAndTotMap }
                                        />
                                    </div>
                                : "" )
                            }
                        </div>
                    </li>
                    <li className={ (active.indexOf(NameList.FLIGHT_EFPS) > -1)  ? "active": ""}>
                        <div className="title" onClick={()=>{
                            this.toggleList(NameList.FLIGHT_EFPS);
                        }}>电子进程单</div>
                        <div className="container flightEFPS">
                            {
                                ((active.indexOf(NameList.FLIGHT_EFPS) > -1) ?
                                    <div className="content">
                                        <Row className="info">
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">离场程序</div>
                                                <span>{ EFPS_SID.value || "——" }</span>
                                            </Col>
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">除冰坪</div>
                                                <span>{ EFPS_ICEID.value || "——" }</span>
                                            </Col>
                                        </Row>
                                        <Row className="info">
                                            <Col span={8} className="cell">
                                                <div className="cell-title">申请时间</div>
                                                <span title={ EFPS_REQTIME.value || "" }>{ reqTime || "——" }</span>
                                            </Col>
                                            <Col span={8} className="cell">
                                                <div className="cell-title">推出时间</div>
                                                <span title={ EFPS_PUSTIME.value || "" }>{ pusTime || "——" }</span>
                                            </Col>
                                            <Col span={8} className="cell">
                                                <div className="cell-title">上跑道时间</div>
                                                <span title={ EFPS_LINTIME.value || "" }>{ lineTime || "——" }</span>
                                            </Col>
                                        </Row>
                                        <Row className="info">
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">进除冰区时间</div>
                                                <span title={ EFPS_IN_ICETIME.value || "" }>{ inIceTime || "——" }</span>
                                            </Col>
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">进除冰等待区时间</div>
                                                <span title={ EFPS_IN_DHLTIME.value || "" }>{ inDHLTime || "——" }</span>
                                            </Col>
                                        </Row>
                                        <Row className="info">
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">出除冰区时间</div>
                                                <span title={ EFPS_OUT_ICETIME.value || "" }>{ outIceTime || "——" }</span>
                                            </Col>
                                            <Col {...colLayout} className="cell">
                                                <div className="cell-title">出除冰等待区时间</div>
                                                <span title={ EFPS_OUT_DHLTIME.value || "" }>{ outDHLTime || "——" }</span>
                                            </Col>
                                        </Row>
                                    </div>
                                    : "" )
                            }
                        </div>
                    </li>
                    <li className={ (active.indexOf(NameList.TRAINFO) > -1)  ? "active": ""}>
                        <div className="title" onClick={()=>{
                            this.toggleList(NameList.TRAINFO);
                        }}>航迹信息{ (direction == "") ? "" : `#${direction}` }</div>
                        <div className="container traInfo">
                            {
                                ((active.indexOf(NameList.TRAINFO) > -1) ?
                                    <div className="content">
                                        <TableLayoutDetail
                                            name = "flightTrajectorMap"
                                            orgMap = { flightTrajectorMap }
                                        />
                                    </div>
                                : "" )
                            }
                        </div>
                    </li>
                    <li className={ (active.indexOf(NameList.FLOWCONTROL) > -1)  ? "active": ""}>
                        <div className="title" onClick={()=>{
                            this.toggleList(NameList.FLOWCONTROL);
                        }}>命中流控</div>
                        <div className="container flowcontrol">
                            {
                                ((active.indexOf(NameList.FLOWCONTROL) > -1) ?
                                    <div className="content">
                                        <TableLayoutDetail
                                            name = "flowcontrolMap"
                                            orgMap = { flowcontrolMap }
                                        />
                                    </div>
                                    : "" )
                            }
                        </div>
                    </li>
                    <li className={ (active.indexOf(NameList.RECORD) > -1) ? "active": ""}>
                        <div className="title" onClick={()=>{
                            this.toggleList(NameList.RECORD);
                        }}>协调记录</div>
                        <div className="container record">
                            {
                                ((active.indexOf(NameList.RECORD) > -1) ?
                                    <div className="content">
                                        <TableLayoutDetail
                                            name = "recordMap"
                                            orgMap = { recordMap }
                                        />
                                    </div>
                                    : "" )
                            }
                        </div>
                    </li>
                </ul>
            </Col>
        )
    }
};

export default AdditionalDetail;