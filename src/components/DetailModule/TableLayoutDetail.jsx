//航班详情----其他详情信息--涉及表格布局的模块
import React from 'react';
import { Table } from 'antd';
import {getDayTimeFromString, isValidObject} from "utils/basic-verify";
import "./TableLayoutDetail.less";
import FlowcontrolUtils from "utils/flowcontrol-utils";
import FlightCoordinationRecordGridTableDataUtil from "utils/flight-coordination-record-data-util";

class TableLayoutDetail extends React.Component{
    constructor( props ){
        super( props );
        this.getColumns = this.getColumns.bind(this);
        this.getDatas = this.getDatas.bind(this);
    }

    //生成列名对象
    getColumns(){
        const { name = "", orgMap = {} } = this.props;
        let columns = [];
        //时间格式化
        const columnsTimeFormat = (value, row, index) => {
            //格式化后的value值
            const formatValue = getDayTimeFromString( value ) || "——";
            //title值
            const title = value || "";

            return {
                children: formatValue,
                props:{
                    title: title
                }
            }
        };

        //协调信息表格，记录obt和tot的
        //协调信息
        if( name == "obtAndTotMap"){
            const { APPFIX = {}, ACCFIX = {} } = orgMap;
            columns = [
                {
                    title: "",
                    dataIndex: "name",
                    align: 'center',
                    key: "name",
                    width: 100
                },{
                    title: "OBT",
                    dataIndex: "OBT",
                    align: 'center',
                    key: "OBT",
                    render: columnsTimeFormat,
                    width: 100
                },{
                    title: "TOT",
                    dataIndex: "TOT",
                    align: 'center',
                    key: "TOT",
                    render: columnsTimeFormat,
                    width: 100
                },{
                    title: APPFIX.value || "APP FIX",
                    dataIndex: "APPFIX",
                    align: 'center',
                    key: "APPFIX",
                    render: columnsTimeFormat,
                    width: 100
                },{
                    title: ACCFIX.value || "ACC FIX",
                    dataIndex: "ACCFIX",
                    align: 'center',
                    key: "ACCFIX",
                    render: columnsTimeFormat,
                    width: 100
                }
            ];
        }else if( name == "flightTrajectorMap" ){//航迹信息
            columns = [
                {
                    title: "",
                    dataIndex: "traID",
                    align: 'center',
                    key: "traID",
                    width: 80
                },{
                    title: "预计(P)",
                    dataIndex: "traP",
                    align: 'center',
                    key: "traP",
                    render: columnsTimeFormat,
                    width: 100
                },{
                    title: "计算(C)",
                    dataIndex: "traC",
                    align: 'center',
                    key: "traC",
                    render: columnsTimeFormat,
                    width: 100
                },
                {
                    title: "实际/修正(E)",
                    dataIndex: "traE",
                    align: 'center',
                    key: "traE",
                    render: columnsTimeFormat,
                    width: 130
                }
            ];
        }else if( name == "flowcontrolMap" ){//受控信息
            columns = [
                {
                    title: "名称",
                    dataIndex: "name",
                    align: 'center',
                    key: "name",
                    width: 180
                },{
                    title: "类型",
                    dataIndex: "type",
                    align: 'center',
                    key: "type",
                    render: (value, row, index) => {
                        //格式化后的value值
                        const formatValue = FlowcontrolUtils.getDetailTypeZh( value ) || "——";
                        return {
                            children: formatValue,
                        }
                    },
                    width: 75
                },{
                    title: "限制值",
                    dataIndex: "value",
                    align: 'center',
                    key: "value",
                    width: 70
                },
                {
                    title: "原因",
                    dataIndex: "reason",
                    align: 'center',
                    key: "reason",
                    render: (value, row, index) => {
                        //格式化后的value值
                        const formatValue = FlowcontrolUtils.getReasonZh( value ) || "——";
                        return {
                            children: formatValue,
                        }
                    },
                    width: 80
                },
                {
                    title: "来源",
                    dataIndex: "source",
                    align: 'center',
                    key: "source",
                    width: 75
                },
                {
                    title: "状态",
                    dataIndex: "status",
                    align: 'center',
                    key: "status",
                    render: (value, row, index) => {
                        //格式化后的value值
                        const formatValue = FlowcontrolUtils.getStatusZh2( value ) || "——";
                        const resDom = (
                            <div className="status">
                                <span>{formatValue}</span>
                                <i className="iconfont icon-effect"></i>
                            </div>
                        );
                        return {
                            children: resDom,
                        }
                    },
                    width: 140

                }
            ];
        }else if( name == "recordMap" ){//协调记录
            columns = [
                {
                    title: "类型",
                    dataIndex: "type",
                    align: 'center',
                    key: "type",
                    width: 140
                },{
                    title: "协调前",
                    dataIndex: "originalValue",
                    align: 'center',
                    key: "originalValue",
                    width: 100
                },{
                    title: "协调后",
                    dataIndex: "value",
                    align: 'center',
                    key: "value",
                    width: 100
                },
                {
                    title: "协调备注",
                    dataIndex: "comments",
                    align: 'center',
                    key: "comments",
                    width: 100
                },
                {
                    title: "协调状态",
                    dataIndex: "status",
                    align: 'center',
                    key: "status",
                    width: 100
                },
                {
                    title: "协调时间",
                    dataIndex: "timestamp",
                    align: 'center',
                    key: "timestamp",
                    render: columnsTimeFormat,
                    width: 100
                },
                {
                    title: "协调用户",
                    dataIndex: "usernameZh",
                    align: 'center',
                    key: "usernameZh",
                    width: 120
                },
                {
                    title: "协调用户IP",
                    dataIndex: "ipAddress",
                    align: 'center',
                    key: "ipAddress",
                    width: 160
                },
            ];
        }
        return columns;
    };

    //生成表数据
    getDatas(){
        const { name = "", orgMap = {} } = this.props;
        let resDatas = [];
        if( name == "obtAndTotMap"){
            const {
                EOBT, ETOT,
                TOBT, TTOT,
                HOBT, HTOT,
                COBT, CTOT,
                NOBT, NTOT,
                AOBT, ATOT,
                APPFIX = {}, ACCFIX = {}
            } = orgMap;
            const appFixMap = APPFIX.processMap || {};
            const accFixMap = ACCFIX.processMap || {};
            resDatas = [
                {
                    name: "FPL(E)",
                    OBT:  EOBT.value || "——",
                    TOT:  ETOT.value || "——",
                    APPFIX: isValidObject(appFixMap["FIX_PREDICT"]) ? appFixMap["FIX_PREDICT"].value : "——",
                    ACCFIX: isValidObject(accFixMap["FIX_PREDICT"]) ? accFixMap["FIX_PREDICT"].value : "——"
                },
                {
                    name: "预计(T)",
                    OBT:  TOBT.value || "——",
                    TOT:  TTOT.value || "——",
                    APPFIX: isValidObject(appFixMap["FIX_ESTIMATED"]) ? appFixMap["FIX_ESTIMATED"].value : "——",
                    ACCFIX: isValidObject(accFixMap["FIX_ESTIMATED"]) ? accFixMap["FIX_ESTIMATED"].value : "——"
                },
                {
                    name: "协调(H)",
                    OBT:  HOBT.value || "——",
                    TOT:  HTOT.value || "——",
                    APPFIX: "",
                    ACCFIX: ""
                },
                {
                    name: "计算(C)",
                    OBT:  COBT.value || "——",
                    TOT:  CTOT.value || "——",
                    APPFIX: isValidObject(appFixMap["FIX_LOCK"]) ? appFixMap["FIX_LOCK"].value : "——",
                    ACCFIX: isValidObject(accFixMap["FIX_LOCK"]) ? accFixMap["FIX_LOCK"].value : "——"
                },
                {
                    name: "全国计算(N)",
                    OBT:  NOBT.value || "——",
                    TOT:  NTOT.value || "——",
                    APPFIX: "",
                    ACCFIX: "",
                },
                {
                    name: "实际(A)",
                    OBT:  AOBT.value || "——",
                    TOT:  ATOT.value || "——",
                    APPFIX: isValidObject(appFixMap["FIX_REALITY"]) ? appFixMap["FIX_REALITY"].value : "——",
                    ACCFIX: isValidObject(accFixMap["FIX_REALITY"]) ? accFixMap["FIX_REALITY"].value : "——"
                }
            ];
        }else if( name == "flightTrajectorMap" ){//航班协调信息
            const { MONITORPOINTINFO = [] } = orgMap;
            resDatas = MONITORPOINTINFO;
        }else if( name == "flowcontrolMap" ){//受控信息
            const { Flowcontrol = {} } = orgMap;
            resDatas = Object.values( Flowcontrol );
        }else if( name == "recordMap" ) {//协调记录
            for(let id in orgMap) {
                //单条协调记录
                const record = orgMap[id] || [];
                //转换为表格数据
                var data = FlightCoordinationRecordGridTableDataUtil.convertData(record);
                if( isValidObject(data) ){
                    //添加到数据集合中
                    resDatas.push(data);
                }
            }
        }
        return resDatas;
    };

    render(){
        //生成列名对象
        const columns = this.getColumns();
        //生成表数据
        const datas = this.getDatas() ;

        return (
            <Table
                columns={ columns }
                dataSource={ datas }
                size="small"
                pagination = { false }
                scroll={{ y: 260 }}
            />
        )
    }

};

export default TableLayoutDetail;