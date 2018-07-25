import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {  updateSidebarStatus, updateSidebarKey } from './Redux';
import Sidebar from './Sidebar';

const mapStateToProps = ( state ) => ({
    sidebarConfig : state.sidebarConfig
});

const mapDispatchTopProps = {
    updateSidebarStatus, updateSidebarKey
};

const SidebarContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(Sidebar);

export default withRouter( SidebarContainer );