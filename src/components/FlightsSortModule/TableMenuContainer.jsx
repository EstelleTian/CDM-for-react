import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateTableSorterData, updateTotalInfo, updateTableAutoScroll } from './Redux';
import TableMenu from './TableMenu';

const mapStateToProps = ( state ) => ({
    isAutoScroll:  state.tableDatas.isAutoScroll,
    totalInfo: state.totalInfo
});

const mapDispatchTopProps = {
    updateTableSorterData,
    updateTotalInfo,
    updateTableAutoScroll
};

const TableMenuContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(TableMenu);

export default withRouter( TableMenuContainer );