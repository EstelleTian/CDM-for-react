import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SubTable from './SubTable';


const mapStateToProps = ( state, props ) => {
    console.log( state, props );
    return {
        
    }
};

const mapDispatchToProps = {

};

const SubTableContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SubTable);

export default withRouter( SubTableContainer );