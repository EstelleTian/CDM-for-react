import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import APFlowcontrolDialog from "./APFlowcontrolDialog";

const mapStateToProps = ( state ) => ({
    loginUserInfo: state.loginUserInfo || {},
})

const mapDispatchToProps = {

}

const APFlowcontrolDialogContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(APFlowcontrolDialog);

export default withRouter(APFlowcontrolDialogContainer);