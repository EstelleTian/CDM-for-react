import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import APFlowcontrolDialog from "./APFlowcontrolDialog";

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

const APFlowcontrolDialogContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(APFlowcontrolDialog);

export default withRouter(APFlowcontrolDialogContainer);