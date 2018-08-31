import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RestrictionDetail from "./RestrictionDetail";

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
});

const mapDispatchToProps = {

}

const RestrictionDetailContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(RestrictionDetail);

export default withRouter(RestrictionDetailContainer);