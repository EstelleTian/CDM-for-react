import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FlowcontrolDialog from "./FlowcontrolDialog";

const mapStateToProps = ( state, nextPorps ) =>({
    loginUserInfo: state.loginUserInfo || {},
    generateTime : state.generateTime,
    titleName: nextPorps.titleName,
    dialogName: nextPorps.type,
    clickCloseBtn: nextPorps.clickCloseBtn,
    width: nextPorps.width,
    x: nextPorps.x

});

const mapDispatchToProps = {

}

const FlowcontrolDialogContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(FlowcontrolDialog);

export default withRouter(FlowcontrolDialogContainer);