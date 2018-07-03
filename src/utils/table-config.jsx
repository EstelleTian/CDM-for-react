//表格列名
import React from 'react';
import {isValidObject, isValidVariable} from "./basic-verify";
import { Icon, Input, Button, Checkbox } from 'antd';

//需要日期格式话的列
const DataColumns = [ "SOBT", "EOBT", "TOBT", "HOBT", "ASBT", "AGCT", "COBT", "AOBT", "CTOT", "ATOT", "ALDT", "POSITION", "APPFIX", "CTO2", "ACCFIX", "CTO", "SLOT_STATUS", "TAXI_WAIT", "FLOWCONTROL_POINT_PASSTIME", "FLIGHT_APP_POINT_PASSTIME", "FLIGHT_ACC_POINT_PASSTIME", "EFPS_REQTIME", "EFPS_PUSTIME", "EFPS_LINTIME", "EFPS_IN_DHLTIME", "EFPS_OUT_DHLTIME", "EFPS_IN_ICETIME", "EFPS_OUT_ICETIME", "EFPS_TAXTIME", "GSOBT", "TOBT_UPDATE_TIME"];

//处理单元格样式方法
const handleStyleFunc = ( style ) => {
    const styleArr = style.split(';');
    //将样式由字符串转化为需要的对象格式
    let styleObj = {};
    //遍历每个样式值
    for(let i = 0, len = styleArr.length; i < len; i++){
        const item = styleArr[i];
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
        // styleObj["backgroundColor"]  ==
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
    if( colunmName == "MULTI_OPERATE" && isValidVariable(value) ){
        const className = "clear-locked-time clear-" + value;
        return {
            children: <Checkbox className= {className} ></Checkbox>,
            props:{
                title: title
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
    return {
        children: value,
        props:{
            title: title,
            style: styleObj
        }
    }
};

//根据表格列名，配置表格专用列数据格式
const TableColumns = ( colDisplay, colNames ) => {
    let width = 0;
    let columns = [];
    let i = 0;
    for(let key in colNames){
        const colunmName = key;
        //如果colEdit当前的列名值为1，则添加，否则不添加
        if( !isValidObject(colDisplay)){
            continue;
        }else if( !isValidVariable(colDisplay[colunmName]) || colDisplay[colunmName]['display']*1 != 1){ //为0不显示
            continue;
        }
        const title = colNames[colunmName].cn || colunmName;

        let obj = {
            title: title,
            dataIndex: colunmName,
            align: 'center',
            // key: colunmName,
            // width: 100,
            render: (value, row, index) => {
                return handleColumnRender(value, row, index, colunmName);
            },
            sorter: (d1, d2) => {
                return handleColumnSort(d1, d2, colunmName);
            }
        };
        if( title.length < 5 ){
            obj['width'] = 90;
            width += 90;
        }else{
            obj['width'] = title.length * 18;
            width += title.length * 18;
        }

        if( i < 3){
            obj['fixed'] = 'left';
        }

        // if( colunmName == "TOBT") {
        // //     console.log(1111);
        //     obj["defaultSortOrder"] = 'ascend';
        // //     // obj["sorter"] = handleDataSort;
        // }
            // obj["sorter"] = handleDataSort;
        // }else{
        //     obj["sorter"] = (d1, d2) => {
        //         let data1 = d1[colunmName] + "";
        //         let data2 = d2[colunmName] + "";
        //         if (isValidVariable(data1) && isValidVariable(data2)) {
        //             let res = data1.localeCompare(data2);
        //             if (0 != res) {
        //                 return res;
        //             }
        //         } else if (isValidVariable(data1)) {
        //             return -1;
        //         } else if (isValidVariable(data2)) {
        //             return 1;
        //         } else {
        //             return 0;
        //         }
        //
        //     };
        // }

        // if( colunmName == "FLIGHTID"){
        //     //过滤是否可见
        //     obj["filterDropdownVisible"] = true;
        //     //过滤图标
        //     obj["filterIcon"] = <Icon type="search" style={{ color: true ? '#108ee9' : '#aaa' }} />
        //     obj["filterDropdown"] = (
        //         <div className="custom-filter-dropdown">
        //             <Input
        //                 placeholder="请输入航班号"
        //                 onPressEnter={onSearch}
        //             />
        //             <Button type="primary" onClick={onSearch}>查询</Button>
        //         </div>
        //     );
        // }


        columns.push( obj );
        i++;
    }
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