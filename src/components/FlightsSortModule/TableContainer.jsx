import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {isValidObject, isValidVariable} from 'utils/basic-verify';
import { updateTableDatas, updateTableDatasProperty, updateTableDatasColumns, updateTableConditionScrollId, updateGenerateInfo, updateGenerateTime, updateTableConditionRangeByKey, updateTableConditionRange, updateBasicConfigInfo } from './Redux';
import { updateSubTableDatasProperty, updateSubTableDatas } from '../SubTable/Redux';
import { updateOperationDatasShowNameAndPosition, updateOperationDatasAuth } from '../OperationDialog/Redux';
import { updateDetailModalDatasVisible, updateDetailModalDatasByName } from '../DetailModule/Redux';
import {updateTableConditionScroll} from "components/FlightsSortModule/Redux";
import Table from './Table';

//表格排序，针对初始化后表格根据sortArr值依次排序
const sortTableDatas = ( tableDatasMap, quicklyFilters, scopeFilter, statusFilter, start, end, scrollId, scroll ) => {
     if( !isValidObject(tableDatasMap) ){
         return [];
     }
     // console.log("sortTableDatas!!!!");

    //高级过滤 scopeFilter  时间过滤 30 45 60min
    if( scopeFilter != "all" ){

    }
    //高级过滤 statusFilter 高级过滤（已起飞、已落地）
    const statusFilterTableDatasMap = statusFilterFunc( tableDatasMap, statusFilter );

    //对象转为数组
    let tableDatas = Object.values( statusFilterTableDatasMap );
    //如果快速查询有值，则先进行过滤，后排序
    //根据条件过滤
    tableDatas = quicklyFilterFunc( tableDatas, quicklyFilters );

    //排序行数据 队列
    tableDatas = sortDataMap( tableDatas );

    //如果自动滚动开启，根据定位航班id获取在排序数据中index
    if( scroll ){
        for(let i = 0, len = tableDatas.length; i < len; i++){
            const tableData = tableDatas[i];
            if( isValidVariable(tableData["ID"]) && tableData["ID"] == scrollId ){
                start = ( i - 25 ) < 0 ? 0 : ( i - 25 );
                end = ( i + 25 ) > len ? len : ( i + 25 );
                break;
            }
        };
    }

    //根据start和end截取数据
    // console.log("当前截取数据:", start, end );
    start = start < 0 ? 0 : start;
    end = end > tableDatas.length ? tableDatas.length : end;
    if( start >= end ){
        start = 0;
    }
    tableDatas = tableDatas.slice(start, end);
    return tableDatas;
};

//条件过滤查询
const quicklyFilterFunc = ( tableDatas, quicklyFilters ) => {
    if( isValidVariable(quicklyFilters) ){
        tableDatas = tableDatas.filter( ( item ) => {
            let flag = false;
            for(let i in item){
                if( i.indexOf("_style") == -1 && i.indexOf("_title") == -1 ){
                    const itemVal = item[i] + "" || "";
                    //若值包含过滤条件，则中，否则不显示
                    if( isValidVariable(itemVal) ){
                        if( itemVal.toLowerCase().indexOf( quicklyFilters.toLowerCase() ) > -1 ){
                            flag = true;
                        }
                    }
                }
            }
            return flag;
        })
    }
    return tableDatas;
};

//高级过滤 statusFilter 高级过滤（已起飞、已落地）
const statusFilterFunc = ( tableDatasMap, statusFilter ) => {
    let statusFilterTableDatasMap = {};
    if( statusFilter.length > 0 ){
        //遍历航班
        for( let id in tableDatasMap ){
            //一条航班对象
            const flightObj = tableDatasMap[id];
            const { flightFieldViewMap = {} } = flightObj.originalData || {};
            //屏蔽已起飞
            if( statusFilter.indexOf('dep') > -1 ){
                //判断航班是否已起飞,若已起飞，不加入过滤后集合中
                if( flightFieldViewMap["HADDEP"].value == "true"){
                    continue;
                }
            }
            //屏蔽已落地
            if( statusFilter.indexOf('arr') > -1 ){
                //判断航班是否已落地,若已落地，不加入过滤后集合中
                if( flightFieldViewMap["HADARR"].value == "true"){
                    continue;
                }
            }
            //屏蔽已取消
            if( statusFilter.indexOf('cnl') > -1 ){
                //判断航班是否已取消,若已取消，不加入过滤后集合中
                if( flightFieldViewMap["HADCNL"].value == "true"){
                    continue;
                }
            }
            //屏蔽未发FPL
            if( statusFilter.indexOf('nofpl') > -1 ){
                //判断航班是否已发FPL,若已发FPL，加入过滤后集合中
                if( flightFieldViewMap["HADFPL"].value == "false"){
                    continue;
                }
            }
            statusFilterTableDatasMap[id] = flightObj;
        }
    }else{
        statusFilterTableDatasMap = tableDatasMap;
    }
    return statusFilterTableDatasMap;
};

//表格数据排序
const sortDataMap = ( tableDatas ) => {
    //默认排序队列
    const sortArr = ["ATOT", "CTOT", "TOBT", "EOBT", "SOBT", "ID"];
    //排序
    tableDatas = tableDatas.sort((d1, d2) => {
        for (let index in sortArr) {
            let sortColumnName = sortArr[index];
            let data1 = d1[sortColumnName] + "";
            let data2 = d2[sortColumnName] + "";
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
                continue;
            }
        }
    });
    return tableDatas;
};

const mapStateToProps = ( state ) =>{
    const { tableColumns = [], tableDatasMap = {}, tableWidth = 0, property = {} } = state.tableDatas;
    const { scroll = true, orderBy = 'ATOT', scrollId = '', quicklyFilters = '', start, end } = state.tableCondition;
    const { userId = '' } = state.loginUserInfo;
    const { scopeFilter = 'all', statusFilter = [] } = state.filterMatches;
    const tableDatas = sortTableDatas(tableDatasMap, quicklyFilters, scopeFilter, statusFilter, start, end, scrollId, scroll );
    return ({
        property,
        tableDatas: tableDatas,
        tableColumns,
        scrollX: tableWidth,
        autoScroll: scroll,
        orderBy,
        scrollId,
        userId
    })
};

const mapDispatchToProps = {
    updateTableDatas,
    updateTableDatasProperty,
    updateTableDatasColumns,
    updateTableConditionScrollId,
    updateGenerateInfo,
    updateGenerateTime,
    updateSubTableDatasProperty,
    updateSubTableDatas,
    updateTableConditionRangeByKey,
    updateTableConditionRange,
    updateOperationDatasShowNameAndPosition,
    updateOperationDatasAuth,
    updateDetailModalDatasVisible,
    updateDetailModalDatasByName,
    updateTableConditionScroll,
    updateBasicConfigInfo
};

const TableContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Table);

export default withRouter( TableContainer );