import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import OperationDialog from "./OperationDialog";
import { updateOperationDatasShowNameAndPosition } from './Redux';
import { updateMultiTableDatas } from "components/FlightsSortModule/Redux";
import {isValidObject} from "utils/basic-verify";

const getDeicePosition = (state) => {
    const { basicConfigInfo = {}, loginUserInfo = {} } = state;
    const { airportConfigurationMap = {} } = basicConfigInfo;
    const { airports = "" } = loginUserInfo;
    const airportsMap = airportConfigurationMap[airports] || {};
    if(isValidObject(airportsMap)){
        const { deicePosition = "" } = airportsMap;
        return deicePosition.split("/");
    }else{
        return [];
    }

};

const mapStateToProps = ( state ) => ({
    userId: state.loginUserInfo.userId || "",
    deiceGroupName: state.loginUserInfo.deiceGroupName || "",
    deicePositionArray: getDeicePosition( state ), //冰坪下拉框
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