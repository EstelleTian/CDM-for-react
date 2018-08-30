import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FlowcontrolDetail from "./FlowcontrolDetail";

const mapStateToProps = ( state, nextProps ) =>({
    loginUserInfo: state.loginUserInfo || {},
    systemConfig: state.systemConfig || {},
    generateTime : state.generateTime,
    titleName: nextProps.titleName,
    dialogName: nextProps.type,
    clickCloseBtn: nextProps.clickCloseBtn,
    width: nextProps.width,
    x: nextProps.x,
    id:nextProps.id,
    placeType : nextProps.placeType,

});

const mapDispatchToProps = {

}

const FlowcontrolDetailContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(FlowcontrolDetail);

export default withRouter(FlowcontrolDetailContainer);