import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateScopeFilter, updateStatusFilter } from './NavMenuRedux';
import { userLogout } from '../views/LoginRedux'
import { updateTableConditionQuicklyFilters } from '../components/FlightsSortModule/Redux';
import { updateSidebarKey,updateSidebarStatus } from '../components/Sidebar/Redux';
import NavMenu from './NavMenu';

const mapStateToProps = ( state ) => ({
    systemConfig : state.systemConfig,
    loginUserInfo : state.loginUserInfo,
    filterMatches : state.filterMatches,
    sidebarConfig : state.sidebarConfig,
});

const mapDispatchTopProps = {
    updateTableConditionQuicklyFilters,
    updateScopeFilter,
    updateStatusFilter,
    userLogout,
    updateSidebarStatus,
    updateSidebarKey
};

const NavMenuContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(NavMenu);

export default withRouter( NavMenuContainer );