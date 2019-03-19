import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import FlowcontrolItem from './FlowcontrolItem';

const mapStateToProps = ( state ) => ({
    flowGenerateTime : state.flowGenerateTime,
    systemConfig: state.systemConfig || {},
});

const mapDispatchToProps = {
    // updateGenerateTime,
};

const FlowcontrolItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(FlowcontrolItem);

export default withRouter( FlowcontrolItemContainer );