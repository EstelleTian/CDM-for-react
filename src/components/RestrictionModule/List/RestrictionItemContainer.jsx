import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import RestrictionItem from './RestrictionItem';

const mapStateToProps = ( state ) => ({
    flowGenerateTime : state.flowGenerateTime
});

const mapDispatchToProps = {
    // updateGenerateTime,
};

const RestrictionItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(RestrictionItem);

export default withRouter( RestrictionItemContainer );