import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateTableConfig, updateTableDatas,updateTotalInfo } from './AirTableRedux';
import AirTable from '../components/Table/Table';
import {isValidVariable} from "../utils/basic-verify";

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

const mapStateToProps = ( state ) => ({
    tableConfig: state.tableConfig,
    tableDatas: sortTableDatas(state.tableDatas.tableDatasMap),
    totalInfo: state.totalInfo
});

const mapDispatchTopProps = {
    updateTableConfig,
    updateTableDatas,
    updateTotalInfo
};

const AirTableContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(AirTable);

export default withRouter( AirTableContainer );