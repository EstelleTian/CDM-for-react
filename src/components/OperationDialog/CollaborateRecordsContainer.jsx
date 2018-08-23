import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CollaborateRecords from './CollaborateRecords'
import {updateCollaborateRecords} from "./Redux";

const mapStateToProps = (state, nextProps) => ({
    userId: state.loginUserInfo.userId || "", //用户id
    collaborateRecords: state.collaborateRecords, //协调记录
    clickCloseBtn: nextProps.clickCloseBtn, //关闭按钮事件 Function
    flightid: nextProps.flightid || "", //航班号
    id: nextProps.id || "", //航班id
});

const mapDispatchToProps = {
    updateCollaborateRecords
};


const CollaborateRecordsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CollaborateRecords);


export default withRouter(CollaborateRecordsContainer);