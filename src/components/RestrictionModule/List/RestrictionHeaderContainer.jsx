import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {updateRestrictionDatas,updateRestrictionConditionScope,
    updateRestrictionConditionOrderBy, updateRestrictionConditionQuicklyFilters,
    updateRestrictionGenerateTime, } from './Redux';
import RestrictionHeader from './RestrictionHeader';

const mapStateToProps = ( state ) => {
    //除冰限制过滤规则
    const {
        scope = 'EFFECTIVE',
        orderBy = 'TIME',
        quicklyFilters = ''
    } = state.restrictionCondition;

    //除冰限制数据生成时间
    const {time:restrictionGenerateTime} = state.restrictionGenerateTime;

    // 用户id
    const { userId } = state.loginUserInfo;

    return ({
        userId, // 用户id
        restrictionGenerateTime, //除冰限制数据生成时间
        scope,
        orderBy,
        quicklyFilters,
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