import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateScopeFilter, updateStatusFilter } from './NavMenuRedux'
import { updateTableConditionQuicklyFilters } from '../components/FlightsSortModule/Redux';
import NavMenu from './NavMenu';

const mapStateToProps = ( state ) => ({
    filterMatches : state.filterMatches
});

const mapDispatchTopProps = {
    updateTableConditionQuicklyFilters,
    updateScopeFilter,
    updateStatusFilter
};

const NavMenuContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(NavMenu);

export default withRouter( NavMenuContainer );