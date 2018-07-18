import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateFlowcontrolDatas, updateFlowcontrolViewMap, updateFlowcontrolConditionShieldLong,
    updateFlowcontrolConditionScope, updateFlowcontrolConditionPlaceType,
    updateFlowcontrolConditionOrderBy, updateFlowcontrolConditionQuicklyFilters,
    updateFlowGenerateTime, } from './Redux';

import FlowcontrolList from './FlowcontrolList';

const mapStateToProps = ( state ) => {
    const { flowcontrolDataMap , flowcontrolViewMap} = state.flowcontrolDatas;

    const {  shieldLong = false,
        scope = 'effective',
        placeType = 'ALL',
        orderBy = 'TIME',
        quicklyFilters = ''
    } = state.flowcontrolCondition;

    const {time:generateTime} = state.flowGenerateTime;

    return ({
        generateTime, // 流控数据生成时间
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
    updateFlowcontrolDatas, updateFlowcontrolViewMap, updateFlowcontrolConditionShieldLong,
    updateFlowcontrolConditionScope, updateFlowcontrolConditionPlaceType,
    updateFlowcontrolConditionOrderBy, updateFlowcontrolConditionQuicklyFilters,
    updateFlowGenerateTime,
};

const FlowcontrolListContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(FlowcontrolList);

export default withRouter( FlowcontrolListContainer );