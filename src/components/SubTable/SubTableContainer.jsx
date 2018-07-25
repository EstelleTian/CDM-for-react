import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SubTable from './SubTable';


const mapStateToProps = ( state, props ) => {
    console.log( state, props );
    return {
        
    }
};

const mapDispatchTopProps = {

};

const SubTableContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(SubTable);

export default withRouter( SubTableContainer );