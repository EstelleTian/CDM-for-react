import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isValidVariable } from '../../utils/basic-verify';
import { updateTableDatas, updateTableDatasProperty, updateTableDatasColumns, updateTableConditionScrollId, updateTotalInfo } from './Redux';
import Table from './Table';

//表格排序，针对初始化后表格根据sortArr值依次排序
const sortTableDatas = ( tableDatasMap ) => {
    let tableDatas = Object.values( tableDatasMap );
    const sortArr = ["ATOT", "CTOT", "TOBT", "EOBT", "SOBT", "ID"];
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
    const { tableColumns = [], tableDatasMap = {}, tableWidth = 0, property = {}} = state.tableDatas;
    const { scroll = true, orderBy = 'ATOT', scrollId = '' } = state.tableCondition;
    return ({
        property,
        tableDatas: sortTableDatas(tableDatasMap),
        tableColumns,
        scrollX: tableWidth,
        autoScroll: scroll,
        orderBy,
        scrollId
    })
};

const mapDispatchTopProps = {
    updateTableDatas,
    updateTableDatasProperty,
    updateTableDatasColumns,
    updateTableConditionScrollId,
    updateTotalInfo
};

const TableContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(Table);

export default withRouter( TableContainer );