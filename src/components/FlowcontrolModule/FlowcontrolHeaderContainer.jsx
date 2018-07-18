import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {  updateFlowcontrolConditionShieldLong,
    updateFlowcontrolConditionScope, updateFlowcontrolConditionPlaceType,
    updateFlowcontrolConditionOrderBy, updateFlowcontrolConditionQuicklyFilters,
    } from './Redux';
import FlowcontrolHeader from './FlowcontrolHeader';

const mapStateToProps = ( state ) => {
    const { flowcontrolDataMap , flowcontrolViewMap} = state.flowcontrolDatas;

    const {  shieldLong = true,
        scope = 'EFFECTIVE',
        placeType = 'ALL',
        orderBy = 'TIME',
        quicklyFilters = ''
    } = state.flowcontrolCondition;

    const flowGenerateTime = state.flowGenerateTime;
    return ({
        flowGenerateTime, // 流控数据生成时间
        flowcontrolDataMap, // 流控数据
        flowcontrolViewMap, // 流控显示数据
        shieldLong,
        scope,
        placeType,
        orderBy,
        quicklyFilters,
    } )
};

const mapDispatchTopProps = {
    updateFlowcontrolConditionShieldLong,
    updateFlowcontrolConditionScope, updateFlowcontrolConditionPlaceType,
    updateFlowcontrolConditionOrderBy, updateFlowcontrolConditionQuicklyFilters,
};

const FlowcontrolHeaderContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(FlowcontrolHeader);

export default withRouter( FlowcontrolHeaderContainer );