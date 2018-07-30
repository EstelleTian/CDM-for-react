import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DetailModule from "./DetailModule";
import { updateDetailModalDatasVisible } from './Redux';

const mapStateToProps = ( state ) => ({
    detailModalDatas: state.detailModalDatas
})

const mapDispatchToProps = {
    updateDetailModalDatasVisible
}

const DetailModuleContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DetailModule);

export default withRouter(DetailModuleContainer);