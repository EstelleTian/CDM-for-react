import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import NoticeHeader from './NoticeHeader';

const mapStateToProps = ( state ) => {

    return (
        {}
    )
};

const mapDispatchToProps = {

};

const NoticeHeaderContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NoticeHeader);

export default withRouter( NoticeHeaderContainer );