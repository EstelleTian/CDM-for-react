import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import OperationDialog from "./OperationDialog";
import { updateOperationDatasShowNameAndPosition } from './Redux';
import { updateMultiTableDatas } from "components/FlightsSortModule/Redux";

const mapStateToProps = ( state ) => ({
    userId: state.loginUserInfo.userId || "",
    operationDatas: state.operationDatas,
    property: state.tableDatas.property
})

const mapDispatchToProps = {
    updateOperationDatasShowNameAndPosition,
    updateMultiTableDatas
}

const OperationDialogContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(OperationDialog);

export default withRouter(OperationDialogContainer);