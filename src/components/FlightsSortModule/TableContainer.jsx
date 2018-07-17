import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isValidVariable } from '../../utils/basic-verify';
import { updateTableDatas, updateTableDatasProperty, updateTableDatasColumns, updateTableConditionScrollId, updateGenerateInfo, updateGenerateTime } from './Redux';
import { updateSubTableDatasProperty, updateSubTableDatas } from '../SubTable/Redux';
import Table from './Table';

//表格排序，针对初始化后表格根据sortArr值依次排序
const sortTableDatas = ( tableDatasMap, quicklyFilters ) => {
    let tableDatas = Object.values( tableDatasMap ); //转为数组
    //如果快速查询有值，则先进行过滤，后排序
    if( isValidVariable(quicklyFilters) ){
        tableDatas = tableDatas.filter( ( item ) => {
            let flag = false;
            for(let i in item){
                if( i.indexOf("_style") == -1 && i.indexOf("_title") == -1 ){
                    const itemVal = item[i] || "";
                    //若值包含过滤条件，则中，否则不显示
                    if( isValidVariable(itemVal) && itemVal.toLowerCase().indexOf( quicklyFilters.toLowerCase() ) > -1 ){
                        flag = true;
                    }
                }
            }
            return flag;
        })
    }


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
}

const mapStateToProps = ( state ) =>{
    const { tableColumns = [], tableDatasMap = {}, tableWidth = 0, property = {} } = state.tableDatas;
    const { scroll = true, orderBy = 'ATOT', scrollId = '', quicklyFilters = '' } = state.tableCondition;
    const { userId = '' } = state.loginUserInfo;
    return ({
        property,
        tableDatas: sortTableDatas(tableDatasMap, quicklyFilters),
        tableColumns,
        scrollX: tableWidth,
        autoScroll: scroll,
        orderBy,
        scrollId,
        userId
    })
};

const mapDispatchTopProps = {
    updateTableDatas,
    updateTableDatasProperty,
    updateTableDatasColumns,
    updateTableConditionScrollId,
    updateGenerateInfo,
    updateGenerateTime,
    updateSubTableDatasProperty,
    updateSubTableDatas,
};

const TableContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(Table);

export default withRouter( TableContainer );