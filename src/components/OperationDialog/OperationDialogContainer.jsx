import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import OperationDialog from "./OperationDialog";
import { updateOperationDatasShowNameAndPosition } from './Redux';

const mapStateToProps = ( state ) => ({
    userId: state.loginUserInfo.userId || "",
    operationDatas: state.operationDatas
})

const mapDispatchToProps = {
    updateOperationDatasShowNameAndPosition
}

const OperationDialogContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(OperationDialog);

export default withRouter(OperationDialogContainer);