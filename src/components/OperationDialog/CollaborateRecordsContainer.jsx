import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CollaborateRecords from './CollaborateRecords'

const mapStateToProps = (state, nextProps) => ({
    userId: state.loginUserInfo.userId || "", //用户id
    clickCloseBtn: nextProps.clickCloseBtn, //关闭按钮事件 Function
    flightid: nextProps.flightid || "", //航班号
    id: nextProps.id || "", //航班id
    x: nextProps.x || 0,
    y: nextProps.y || 0
});

const mapDispatchToProps = {
};


const CollaborateRecordsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CollaborateRecords);


export default withRouter(CollaborateRecordsContainer);