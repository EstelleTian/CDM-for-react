import React from 'react';
import { Popover, Table } from 'antd';
import {getDayTimeFromString, isValidVariable} from "utils/basic-verify";

class HoverPopover extends React.Component{
    constructor(props){
        super(props);
        this.getColumns = this.getColumns.bind(this);
        this.getDatas = this.getDatas.bind(this);
    };

    //生成列名对象
    getColumns(){
        //时间格式化
        const columnsTimeFormat = (value, row, index) => {
            //格式化后的value值
            let sub = value.substring(14);
            const formatValue = getDayTimeFromString( value.substring(0,12) ) || "——";
            //title值
            const title = value.replace(",true","") || "";

            //根据source下的true判断是否显示橙色标记
            if( sub.indexOf("true") > -1 ){
                return {
                    children: formatValue,
                    props:{
                        style: {
                            backgroundColor: '#f0ad4e'
                        },
                        title: title
                    }
                }
            }else{
                return {
                    children: formatValue,
                    props:{
                        title: title
                    }
                }
            }
        };
        //时间格式化
        const columnsTimeFormat2 = (value, row, index) => {
            //格式化后的value值
            let sub = value.substring(14);
            const formatValue = getDayTimeFromString( value.substring(0,12) ) || "——";
            //title值
            const title = value.replace(",true","") || "";
            //根据source下的true判断是否显示橙色标记
            if( sub.indexOf("true") > -1 ){
                sub = sub.replace(",true","");
                return {
                    children: formatValue + sub,
                    props:{
                        style: {
                            backgroundColor: '#f0ad4e'
                        },
                        title: title
                    }
                }
            }else{
                return {
                    children: formatValue + sub,
                    props:{
                        title: title
                    }
                }
            }
        };
        let columns = [
            {
                title: "",
                dataIndex: "ID",
                align: 'center',
                key: "ID",
                width: 80
            },{
                title: "预计(P)",
                dataIndex: "PREDICT",
                align: 'center',
                key: "PREDICT",
                render: columnsTimeFormat,
                width: 100
            },{
                title: "计算(C)",
                dataIndex: "CALCULATE",
                align: 'center',
                key: "CALCULATE",
                render: columnsTimeFormat,
                width: 100
            },
            {
                title: "实际(A)/修正(E)",
                dataIndex: "CHANGEDVALUE",
                align: 'center',
                key: "CHANGEDVALUE",
                render: columnsTimeFormat2,
                width: 130
            }
        ];
        return columns;
    };
    //生成表数据
    getDatas(){
        const { rowData } = this.props;
        const { MONITORPOINTINFO = [] } = rowData;
        let resDatas = [];
        //航班航迹信息
        for(let id in MONITORPOINTINFO) {
            const trajectMap = MONITORPOINTINFO[id];
            let obj = {};
            const { ID = {}, CALCULATE = {}, PREDICT = {}, CHANGEDVALUE = {}, } = trajectMap;
            obj["ID"] = ID.value || "";
            //计算
            const CALCULATESource = CALCULATE.source || "";
            let CALCULATEValue = CALCULATE.value || "";
            if( isValidVariable(CALCULATESource) && isValidVariable(CALCULATEValue) ){
                CALCULATEValue += "(" + CALCULATESource +")"
            }
            obj["CALCULATE"] = CALCULATEValue || "";
            //预计
            const PREDICTSource = PREDICT.source || "";
            let PREDICTValue = PREDICT.value || "";
            if( isValidVariable(PREDICTSource) && isValidVariable(PREDICTValue) ){
                PREDICTValue += "(" + PREDICTSource +")"
            }
            obj["PREDICT"] = PREDICTValue || "";
            //实际
            const CHANGEDVALUESource = CHANGEDVALUE.source || "";
            let CHANGEDVALUEValue = CHANGEDVALUE.value || "";
            if( isValidVariable(CHANGEDVALUESource) && isValidVariable(CHANGEDVALUEValue) ){
                CHANGEDVALUEValue += "(" + CHANGEDVALUESource +")"
            }
            obj["CHANGEDVALUE"] = CHANGEDVALUEValue;
            resDatas.push(obj);
        }
        return resDatas;
    };

    render(){
        const { rowData } = this.props;
        const { ID = "", FLIGHTID = "" } = rowData;
        const text = (<span>{FLIGHTID} ID:{ID}</span>);
        const columns = this.getColumns();
        const tableDatas = this.getDatas();
        const content = (
            <Table
                columns={ columns }
                dataSource={ tableDatas }
                size="small"
                pagination = { false }
            />
        );
        return (
            <Popover placement="left" title={text} content={content}>
                { this.props.children }
            </Popover>
        )
    }
};

export default HoverPopover;