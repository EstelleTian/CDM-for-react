import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateNoticeDatas } from './Redux';

import NoticeItem from './NoticeItem';

const mapStateToProps = ( state ) => ({
    noticeGenerateTime : state.noticeGenerateTime
});

const mapDispatchToProps = {
    updateNoticeDatas
};

const NoticeItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NoticeItem);

export default withRouter( NoticeItemContainer );