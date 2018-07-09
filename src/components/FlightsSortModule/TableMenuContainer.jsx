import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateTableSorterData, updateGenerateInfo, updateTableAutoScroll } from './Redux';
import TableMenu from './TableMenu';

// 计算未起飞航班数据
const calculateGroundNumber = (generateInfo) => {
    const { SCH_NUM = '', FPL_NUM = '' , CHART_DLA_NUM = ''  } = generateInfo;
    const GROUND_NUM = (SCH_NUM *1 + FPL_NUM * 1 + CHART_DLA_NUM *1) || '';
    return {
        ...generateInfo,
        GROUND_NUM : GROUND_NUM,
    }

}
const mapStateToProps = ( state ) => ({
    isAutoScroll:  state.tableDatas.isAutoScroll,
    generateInfo: calculateGroundNumber(state.generateInfo),
});

const mapDispatchTopProps = {
    updateTableSorterData,
    updateGenerateInfo,
    updateTableAutoScroll
};

const TableMenuContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(TableMenu);

export default withRouter( TableMenuContainer );