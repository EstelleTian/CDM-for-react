import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateTableSorterData, updateTotalInfo, updateTableConditionScroll, updateTableConditionQuicklyFilters } from './Redux';
import TableMenu from './TableMenu';

const mapStateToProps = ( state ) => ({
    isAutoScroll:  state.tableCondition.scroll,
    totalInfo: state.totalInfo
});

const mapDispatchTopProps = {
    updateTableSorterData,
    updateTotalInfo,
    updateTableConditionScroll,
    updateTableConditionQuicklyFilters
};

const TableMenuContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(TableMenu);

export default withRouter( TableMenuContainer );