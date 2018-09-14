import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import Impact from './Impact'

const mapStateToProps = ( state, nextProps ) => ({
    loginUserInfo: state.loginUserInfo || {},
    systemConfig: state.systemConfig || {},
    formatData: nextProps.formatData, //格式化后的流控数据
    clickCloseBtn: nextProps.clickCloseBtn,
    x: nextProps.x || 0,
    y: nextProps.y || 0
});

const mapDispatchToProps = {

};

const ImpactContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Impact);

export default withRouter(ImpactContainer);