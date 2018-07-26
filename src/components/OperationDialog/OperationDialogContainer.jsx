import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import OperationDialog from "./OperationDialog";
import { updateOperationDatasShowNameAndPosition } from './Redux';

const mapStateToProps = ( state ) => ({
    operationDatas: state.operationDatas
})

const mapDispatchToProps = {

}

const OperationDialogContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(OperationDialog);

export default withRouter(OperationDialogContainer);