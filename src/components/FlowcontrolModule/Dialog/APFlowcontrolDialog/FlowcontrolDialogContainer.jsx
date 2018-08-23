import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FlowcontrolDialog from "./FlowcontrolDialog";

const mapStateToProps = ( state, nextProps ) =>({
    loginUserInfo: state.loginUserInfo || {},
    systemConfig: state.systemConfig || {},
    generateTime : state.generateTime,
    titleName: nextProps.titleName,
    dialogName: nextProps.type,
    clickCloseBtn: nextProps.clickCloseBtn,
    width: nextProps.width,
    x: nextProps.x

});

const mapDispatchToProps = {

}

const FlowcontrolDialogContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(FlowcontrolDialog);

export default withRouter(FlowcontrolDialogContainer);