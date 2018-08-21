import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateTableConditionOrderBy, updateGenerateInfo, updateTableConditionScroll, updateTableConditionQuicklyFilters  } from './Redux';
import TableMenu from './TableMenu';

// 计算未起飞航班数据
const calculateGroundNumber = (generateInfo) => {
    const { SCH_NUM = '', FPL_NUM = ''  } = generateInfo;
    const GROUND_NUM = (SCH_NUM *1 + FPL_NUM * 1 ) || '';
    return {
        ...generateInfo,
        GROUND_NUM : GROUND_NUM,
    }

}
const mapStateToProps = ( state ) => ({
    generateInfo: calculateGroundNumber(state.generateInfo),
    autoScroll: state.tableCondition.scroll
});

const mapDispatchToProps = {
    updateTableConditionOrderBy,
    updateGenerateInfo,
    updateTableConditionScroll,
    updateTableConditionQuicklyFilters
};

const TableMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TableMenu);

export default withRouter( TableMenuContainer );