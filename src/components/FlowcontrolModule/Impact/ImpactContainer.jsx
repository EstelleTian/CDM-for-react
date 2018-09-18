import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import Impact from './Impact'
import { updateOperationDatasShowNameAndPosition, updateOperationDatasAuth } from "../../OperationDialog/Redux";
import {updateDetailModalDatasByName, updateDetailModalDatasVisible} from "components/DetailModule/Redux";

const mapStateToProps = ( state, nextProps ) => ({
    userId: state.loginUserInfo.userId || "",
    systemConfig: state.systemConfig || {},
    formatData: nextProps.formatData, //格式化后的流控数据
    clickCloseBtn: nextProps.clickCloseBtn,
    dialogName: state.operationDatas.dialogName,
    id: nextProps.id,
    type: nextProps.type,
    x: nextProps.x || 0,
    y: nextProps.y || 0
});

const mapDispatchToProps = {
    updateOperationDatasShowNameAndPosition,
    updateOperationDatasAuth,
    updateDetailModalDatasByName,
    updateDetailModalDatasVisible
};

const ImpactContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Impact);

export default withRouter(ImpactContainer);