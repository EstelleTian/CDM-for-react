import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateScopeFilter, updateStatusFilter } from './NavMenuRedux';
import { userLogout } from '../views/LoginRedux'
import { updateTableConditionQuicklyFilters } from 'components/FlightsSortModule/Redux';
import { updateSearchTableDatas ,updateSearchTableDatasProperty } from 'components/FlightSearchModule/Redux';
import { updateSidebarKey,updateSidebarStatus } from 'components/Sidebar/Redux';
import {updateDetailModalDatasByName, updateDetailModalDatasVisible} from "components/DetailModule/Redux";
import { updateOperationDatasShowNameAndPosition, updateOperationDatasAuth } from '../components/OperationDialog/Redux';
import NavMenu from './NavMenu';

const mapStateToProps = ( state ) => ({
    systemConfig : state.systemConfig,
    loginUserInfo : state.loginUserInfo,
    filterMatches : state.filterMatches,
    sidebarConfig : state.sidebarConfig,
    searchTableDatas : state.searchTableDatas,
    userId:state.loginUserInfo.userId,
    dialogName:state.operationDatas.dialogName
});

const mapDispatchTopProps = {
    updateTableConditionQuicklyFilters,
    updateScopeFilter,
    updateStatusFilter,
    userLogout,
    updateSidebarStatus,
    updateSidebarKey,
    updateSearchTableDatas,
    updateSearchTableDatasProperty,
    updateDetailModalDatasByName,
    updateDetailModalDatasVisible,
    updateOperationDatasAuth,
    updateOperationDatasShowNameAndPosition
};

const NavMenuContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(NavMenu);

export default withRouter( NavMenuContainer );