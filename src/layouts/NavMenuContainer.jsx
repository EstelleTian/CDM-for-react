import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateScopeFilter, updateStatusFilter } from './NavMenuRedux';
import { userLogout } from '../views/LoginRedux'
import { updateTableConditionQuicklyFilters } from 'components/FlightsSortModule/Redux';
import NavMenu from './NavMenu';

const mapStateToProps = ( state ) => ({
    systemConfig : state.systemConfig,
    loginUserInfo : state.loginUserInfo,
    filterMatches : state.filterMatches
});

const mapDispatchToProps = {
    updateTableConditionQuicklyFilters,
    updateScopeFilter,
    updateStatusFilter,
    userLogout
};

const NavMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NavMenu);

export default withRouter( NavMenuContainer );