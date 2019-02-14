import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateNoticeDatas,deleteNoticeDatas } from '../List/Redux';

import NoticePublishPage from './Publish';
const mapStateToProps = ( state ) => ({
    loginUserInfo:state.loginUserInfo,
    systemConfig:state.systemConfig,
});

const mapDispatchToProps = {
    updateNoticeDatas,
    deleteNoticeDatas
};

const NoticePublisContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NoticePublishPage);

export default withRouter( NoticePublisContainer );