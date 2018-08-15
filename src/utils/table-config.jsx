//表格列名
import React from 'react';
import $ from 'jquery';
import {isValidObject, isValidVariable} from "./basic-verify";
import { getSingleAirportUrl } from "utils/request-urls";
import { requestGet } from "utils/request-actions";
import { Checkbox } from 'antd';

//需要日期格式化的列
const DataColumns = [ "SOBT", "EOBT", "TOBT", "HOBT", "ASBT", "AGCT", "COBT", "AOBT", "CTOT", "ATOT", "ALDT", "POSITION","CTO2", "CTO", "SLOT_STATUS", "TAXI_WAIT", "FLOWCONTROL_POINT_PASSTIME", "FLIGHT_APP_POINT_PASSTIME", "FLIGHT_ACC_POINT_PASSTIME", "EFPS_REQTIME", "EFPS_PUSTIME", "FORMER_CTOT", "FORMER_DEP", "FORMER_ARR", "EFPS_LINTIME", "EFPS_IN_DHLTIME", "EFPS_OUT_DHLTIME", "EFPS_IN_ICETIME", "EFPS_OUT_ICETIME", "EFPS_TAXTIME", "GSOBT", "TOBT_UPDATE_TIME"];
//需要排序的列
const SortColumns = [ "FLIGHTID", "AGCT", "AOBT", "COBT", "CTOT", "ATOT", "ALDT" ];

//处理单元格样式方法
const handleStyleFunc = ( style ) => {
    if( !isValidVariable(style) ){
        return {};
    }
    const styleArr = style.split(';');
    //将样式由字符串转化为需要的对象格式
    let styleObj = {};
    //遍历每个样式值
    for(let i = 0, len = styleArr.length; i < len; i++){
        const item = styleArr[i];
        if( !isValidVariable(item) ){
            continue;
        }
        const itemArr = item.split(':');
        //每个样式的key/value
        const key = itemArr[0];
        const value = itemArr[1] || "";
        //以-分割，前一个值不变，后一个首字母大写
        const wordArr = key.split("-");
        let newKey = wordArr[0];
        if(wordArr.length > 1){
            let secWord = wordArr[1];
            //首字母大写
            secWord = secWord.substring(0,1).toUpperCase() + secWord.substring(1);
            newKey += secWord;
        }
        styleObj[newKey] = value;
     }
    const backgroundColor = styleObj["backgroundColor"];


    if( ( backgroundColor == '' || backgroundColor == "transparent" )){
        // 如果字体颜色是黑色，改为灰色
        if( styleObj["color"] == '#000000' ){
            styleObj["color"] = '#cccccc';
        }

    }
    return styleObj;
};

//处理单元格日期类数据格式化
const handleDateFormat = ( value ) => {
    if( isValidVariable( value ) && value.length == 12){
        return value.substring(8, 12)
    }
    return "";
};

//排序方法，根据sortArr逐一进行排序
const handleColumnSort = (d1, d2, colunmName) => {
    let data1 = d1[colunmName] + "";
    let data2 = d2[colunmName] + "";
    if (isValidVariable(data1) && isValidVariable(data2)) {
        let res = data1.localeCompare(data2);
        if (0 != res) {
            return res;
        }
    } else if (isValidVariable(data1)) {
        return -1;
    } else if (isValidVariable(data2)) {
        return 1;
    } else {
        return 0;
    }
};
//处理单元格样式，用于增加单元格字体大小，背景色，字体颜色
const handleColumnRender = (value, row, index, colunmName) => {
    if( colunmName == "ID" ){
        return {
            children: index*1+1
        }
    };
    //获取标题
    const title = row[colunmName + "_title"] || "";
    //若是多选操作，转换为dom
    if( colunmName == "MULTI_OPERATE" && isValidVariable(value)){
        if( value == "1" || value == '2' ){
            const className = "clear-locked-time clear-" + value;
            return {
                children: <Checkbox className= {className}></Checkbox>,
                props:{
                    title: title
                }
            }
        }else{
            return {
                children: "",
                props:{
                    title: title
                }
            }
        }
    }

    //处理样式
    const style = row[colunmName + "_style"] || "";
    const styleObj = handleStyleFunc(style);

    //处理数据格式化，当列是DateColumns，且value为12位时间格式，做日期格式化
    if( DataColumns.indexOf(colunmName) > -1 ){
        value = handleDateFormat( value );
    }

    // let resStyleObj = styleObj;

    let resStyleObj = {};
    if( isValidVariable(row[colunmName]) ){
        //如果背景色不是transparent,加圆点
        const { backgroundColor = "", fontSize = "" } = styleObj;
        if( colunmName == "COBT" || colunmName == "CTOT" ){
            if( backgroundColor == "#FF99FF"){ //锁定
                value = (<span style={{fontSize: fontSize}}><i className="iconfont icon-lock" style={{color: backgroundColor}}></i>{value}</span>);
            }else if( backgroundColor == "#FFFF00"){ //预锁
                value = (<span style={{fontSize: fontSize}}><i className="iconfont icon-unlock" style={{color: backgroundColor}}></i>{value}</span>);
            }else{
                value = (<span style={{fontSize: fontSize}}><i className="iconfont icon-circle-m" style={{color: backgroundColor}}></i>{value}</span>);
            }
        }else if( colunmName == "FLIGHTID" ){
            value = (<span style={{fontSize: fontSize, color: backgroundColor}}>{value}</span>);

        }else if( isValidVariable(backgroundColor) && backgroundColor != "transparent"){
            value = (<span style={{fontSize: fontSize}}><i className="iconfont icon-circle-m" style={{color: backgroundColor}}></i>{value}</span>);
        }
    }
    resStyleObj['fontSize'] = styleObj['fontSize'] || "";


    return {
        children: value,
        props:{
            title: title,
            style: resStyleObj
        }
    }
};
//处理每列列宽，type为识别是主表还是其他表
const handleColumnWidth = ( type, title ) => {
    let width = 0;
    const numReg = new RegExp("[A-Za-z]+");
    if( title == 'CallSign' || title == 'ACWakes' ){
        width = 108;
    }else if( title == 'ACType' ){
        width = 85;
    }else if( title == 'RWY' ){
        width = 65;
    }else if( !numReg.test(title) && title.length == 4 ){ //不是字母且是4位
        width = 90;
    }else if( numReg.test(title) && title.length == 4 ){ //是字母且是4位
        width = 85;
    }else if( title.length == 3 ){
        width = 80;
    }else if( title == 'ID' || title.length < 3 ){
        width = 55;
    }else if( title.length == 0 ){
        width = 35;
    }else{
        width = title.length * 20;
    }
    switch (type){
        case "pool": {
            if( title.length == 4 ){
                width = 70;
            }else if( title == 'ID' ){
                width = 50;
            }
            break;
        }
        case "alarm": {
            if( title == '描述' || title == '告警原因' ){
                width = 100;
            }else if(title == '类型'){
                width = 65;
            }else if( title == 'ID' ){
                width = 50;
            }
            break;
        }
        case "expired": {
            if( title == '备注' ){
                width = 100;
            }else if( title.length == 4 ){
                width = 70;
            }else if( title == 'ID' ){
                width = 50;
            }
            break;
        }
        case "special": {
            if( title == '备注' ){
                width = 100;
            }else if( title.length == 4 ){
                width = 70;
            }else if( title == 'ID' ){
                width = 50;
            }
            break;
        }
        case "todo": {
            if( title == '备注' ){
                width = 100;
            }else if( title.length == 4 ){
                width = 85;
            }else if( title == 'ID' ){
                width = 50;
            }
            break;
        }
    }

    return width;


};

/*
 * 右键点击事件功能
 * colunmName  列名
 * record  行对象
 */
const handleRightClickFunc = function( thisProxy, colunmName, record, x, y){
    if( isValidVariable(colunmName) ){
        const { updateOperationDatasShowNameAndPosition, updateOperationDatasAuth } = thisProxy.props;
        //根据列名和行对象，获取选中单元格的值
        const optValue = record["FLIGHTIDOPERATION"] || [];
        //显示航班协调窗口
        updateOperationDatasAuth(optValue, record);
        //更新数据，需要展开的协调窗口名称和位置
        updateOperationDatasShowNameAndPosition( "", 0, 0 );
        //更新数据，需要展开的协调窗口名称和位置
        setTimeout(()=>{
            updateOperationDatasShowNameAndPosition( colunmName, x, y );
        }, 0)


    }

};
//处理每列航班协调操作按钮
const handleOperationColumn = function (value, row, index) {
    let optval = "";
    const len = value.length;
    if( len > 0 ){
        optval = (
            <div className="opt-canvas">
                {
                    value.map((item, index) => {
                        return (
                            <span key = {index} title={item.cn}>
                                <i className={`iconfont icon-${item.type}`}></i>
                                <span className="word">{item.simple}</span>
                            </span>
                        )
                    })
                }
            </div>
        );
    }
    return {
        children: optval
    }
}

//处理点击航班出现航班详情
const showDetailModal = function( thisProxy, record ){
    const { updateDetailModalDatasVisible, updateDetailModalDatasByName, userId } = thisProxy.props;
    const id = record["ID"] || "";

    //根据航班id获取单条航班数据
    requestGet( getSingleAirportUrl, {id, userId}, function(res){
        updateFlightDetailData(res, updateDetailModalDatasByName, updateDetailModalDatasVisible);
    } );


};

const updateFlightDetailData = function( res, updateDetailModalDatasByName, updateDetailModalDatasVisible ){
    // console.log( res );
    updateDetailModalDatasByName("flight", res);
    //打开详情窗口
    updateDetailModalDatasVisible("flight", true);
};


//根据表格列名，配置表格专用列数据格式
const TableColumns = function( type, colDisplay, colNames, colTitle ){
    let thisProxy = this;
    let width = 0;
    let columns = [];
    let i = 0;
    for(let key in colNames){
        const colunmName = key;
        //去掉ID列
        if( colunmName == "ID" ){
            continue;
        }
        //如果colEdit当前的列名值为1，则添加，否则不添加
        if( !isValidObject(colDisplay)){
            continue;
        }else if( !isValidVariable(colDisplay[colunmName]) || colDisplay[colunmName]['display']*1 != 1){ //为0不显示
            continue;
        }
        let title = colNames[colunmName].cn || colunmName;
        if( title == "批量操作"){
            title = "";
        }

        let obj = {
            title: title,
            dataIndex: colunmName,
            align: 'center',
            key: colunmName,
            render: (value, row, index) => {
                return handleColumnRender(value, row, index, colunmName);
            },
            onHeaderCell: ( column ) => {
                //配置表头属性，增加title值
                return {
                    title: colTitle[colunmName]
                }
            }

        };
        //处理表格右键功能
        obj["onCell"] = (record) =>{
            return {
                //右键
                onContextMenu: ( e ) => {
                    e.preventDefault();
                    //点击时候的位置
                    const targetParent = e.target.parentElement;
                    const offsetLeft = targetParent.offsetLeft;
                    const offsetTop = targetParent.offsetTop;
                    const targetHeight = targetParent.clientHeight;
                    const targetWidth = targetParent.clientWidth;
                    const $scrollDom = $(".ant-table-body");
                    //滚动条滚动高度
                    const orgTop = $scrollDom[0].scrollTop;
                    const orgLeft = $scrollDom[0].scrollLeft;
                    //加上指示箭头宽度的1/2
                    let x = offsetLeft - orgLeft + targetWidth + 6;
                    //加上表格头和表格查询栏高度
                    let y = offsetTop - orgTop + 68;

                    if( x < 0 ){
                        x = targetWidth + 6;
                    }

                    handleRightClickFunc(thisProxy, colunmName, record, x, y);
                },
                //左键
                onClick: ( e )=>{
                    showDetailModal(thisProxy, record);
                }
            }
        }
        //处理数据格式化，当列是DateColumns，且value为12位时间格式，做日期格式化
        if( SortColumns.indexOf(colunmName) > -1 ){
            obj["sorter"] = (d1, d2) => {
                return handleColumnSort(d1, d2, colunmName);
            }
        }

        //调整每列宽度
        const w = handleColumnWidth( type, title );
        obj['width'] = w;
        width += w;

        // 冻结列,等待池不加冻结
        if( type == ""){
            if( colunmName == "ID" || colunmName == "FLIGHTID" || colunmName == "MULTI_OPERATE" ){
                obj['fixed'] = 'left';
            }
        }

        columns.push( obj );
        i++;
    }
    //增加一列操作列
    // if( type == ""){
    //     let optObj = {
    //         title: "操作",
    //         dataIndex: "OPERATION",
    //         align: 'center',
    //         key: "OPERATION",
    //         width: 260,
    //         fixed: 'right',
    //         render: (value, row, index) => {
    //             return handleOperationColumn( value, row, index );
    //         },
    //         onHeaderCell: ( column ) => {
    //             //配置表头属性，增加title值
    //             return {
    //                 title: "操作"
    //             }
    //         }
    //     };
    //     columns.push(optObj);
    //     width += 260;
    //     i++;
    // }

    return {
        columns,
        width
    } ;
};

const getColEdit = ( gridEditData ) => {
    // 合并后的配置
    let combineOperationValue = {};
    // 合并数据
    for ( let key in gridEditData) {
        //添加报文
        if (key == 'OPEN_TELE_DETAIL') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        // TOBT
        if (key == 'APPLY_TOBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'CANCEL_TOBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'APPROVE_TOBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'REFUSE_TOBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }

        // HOBT
        if (key == 'APPLY_HOBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'CANCEL_HOBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'APPROVE_HOBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'REFUSE_HOBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }

        // COBT
        if (key == 'UPDATE_COBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'CLEAR_COBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        // CTD CTOT
        if (key == 'UPDATE_CTOT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'CLEAR_CTOT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }

        // 等待池
        if (key == 'DIRECT_IN_POOL') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'APPLY_OUT_POOL') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'APPROVE_OUT_POOL') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'REFUSE_OUT_POOL') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'DIRECT_OUT_POOL') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }

        // FLOWCONTROL_POINT_PASSTIME
        if(key == 'UPDATE_FLOWCONTROL_POINT_PASSTIME') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if(key == 'CLEAR_FLOWCONTROL_POINT_PASSTIME') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }

        // PRIORITY
        if (key == 'APPLY_PRIORITY') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'CANCEL_PRIORITY') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'APPROVE_PRIORITY') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'REFUSE_PRIORITY') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }

        if (key == 'MARK_EXEMPT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'MARK_EXEMPT_CANCEL') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }

        //ASBT
        if (key == 'UPDATE_ASBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'CLEAR_ASBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        // AGCT
        if (key == 'UPDATE_AGCT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'CLEAR_AGCT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        // AOBT
        if (key == 'UPDATE_AOBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'CLEAR_AOBT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        // POSITION
        if (key == 'UPDATE_POSITION') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'CLEAR_POSITION') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        // RUNWAY
        if (key == 'UPDATE_RUNWAY') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'CLEAR_RUNWAY') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        // DELAY_REASON
        if (key == 'UPDATE_DELAY_REASON') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'CLEAR_DELAY_REASON') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        // DEICE_POSITION
        if (key == 'UDPATE_DEICE_POSITION') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'CLEAR_DEICE_POSITION') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        // DEICE_STATUS
        if (key == 'UDPATE_DEICE_STATUS') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'CLEAR_DEICE_STATUS') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }

        // FLIGHTID
        if (key == 'MARK_CLEARANCE') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'MARK_UN_CLEARANCE') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'READY-COMPLETE') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'READY-UN-COMPLETE') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'MARK_CANCEL') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'MARK_UN_CANCEL') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'UPDATE_FORMER_FLIGHT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'MARK_ASSIGN_SLOT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'MARK_UN_ASSIGN_SLOT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'OPEN_FLIGHT_RECORD') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        if (key == 'OPEN_FLIGHT_DETAIL') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        //APPLY_CTOT
        if (key == 'APPLY_CTOT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
        //APPROVE_CTOT
        if (key == 'APPROVE_CTOT') {
            combineOperationValue[key] = gridEditData[key]['edit'] == 1;
        }
    }
    return combineOperationValue;
};

export { TableColumns, getColEdit };