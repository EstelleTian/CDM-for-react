import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { updateTableSorterData, updateTotalInfo, updateTableAutoScroll } from './Redux';
import TableHeader from './TableHeader';

const mapStateToProps = ( state ) => ({

});

const mapDispatchTopProps = {

};

const TableHeaderContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(TableHeader);

export default withRouter( TableHeaderContainer );