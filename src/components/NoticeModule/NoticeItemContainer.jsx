import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import NoticeItem from './NoticeItem';

const mapStateToProps = ( state ) => ({
    // flowGenerateTime : state.flowGenerateTime
});

const mapDispatchToProps = {

};

const NoticeItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NoticeItem);

export default withRouter( NoticeItemContainer );