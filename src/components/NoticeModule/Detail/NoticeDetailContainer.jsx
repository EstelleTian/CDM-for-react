import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import NoticeDetail from "./NoticeDetail";

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

const NoticeDetailContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NoticeDetail);

export default withRouter(NoticeDetailContainer);