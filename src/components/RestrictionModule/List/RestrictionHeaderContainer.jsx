import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {updateRestrictionDatas,updateRestrictionConditionScope,
    updateRestrictionConditionOrderBy, updateRestrictionConditionQuicklyFilters,
    updateRestrictionGenerateTime, } from './Redux';
import RestrictionHeader from './RestrictionHeader';

const mapStateToProps = ( state ) => {
    // 除冰限制信息数据集合
    const { restrictionDataMap } = state.restrictionDatas;

    const {
        scope = 'EFFECTIVE', // 过滤条件--正在生效
        orderBy = 'TIME', // 过滤条件 -- 排序 -- 时间
        quicklyFilters = '' // 过滤条件 -- 过滤关键字
    } = state.restrictionCondition;
    // 除冰限制信息数据生成时间
    const restrictionGenerateTime = state.restrictionGenerateTime;
    return ({
        restrictionGenerateTime, // 除冰限制信息数据生成时间
        restrictionDataMap, // 除冰限制数据
        scope, // 过滤条件--正在生效
        orderBy, // 过滤条件 -- 排序 -- 时间
        quicklyFilters, // 过滤条件 -- 过滤关键字
    } )
};

const mapDispatchToProps = {
    updateRestrictionDatas,updateRestrictionConditionScope,
    updateRestrictionConditionOrderBy, updateRestrictionConditionQuicklyFilters,
    updateRestrictionGenerateTime,
};

const RestrictionHeaderContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(RestrictionHeader);

export default withRouter( RestrictionHeaderContainer );