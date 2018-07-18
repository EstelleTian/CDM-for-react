import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import FlowcontrolItem from './FlowcontrolItem';

const mapStateToProps = ( state ) => ({
    flowGenerateTime : state.flowGenerateTime
});

const mapDispatchTopProps = {
    // updateGenerateTime,
};

const FlowcontrolItemContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(FlowcontrolItem);

export default withRouter( FlowcontrolItemContainer );