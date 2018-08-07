import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateRestrictionDatas, updateRestrictionConditionScope,
    updateRestrictionConditionOrderBy, updateRestrictionConditionQuicklyFilters,updateRestrictionGenerateTime} from './Redux';

import RestrictionList from './RestrictionList';
import { isValidVariable, isValidObject } from 'utils/basic-verify';
import { isEffective } from 'utils/restriction-data-util';


/**
 * 过滤流控数据
 * @param restrictionDataMap 限制数据
 * @param restrictionGenerateTime 限制数据生成时间
 * @param scope限制范围 (ALL / EFFECTIVE)
 * @param orderBy 排序规则 (TIME / LEVEL )
 * @param quicklyFilters 过滤关键字
 * */
const  filterFlowoncontrolDatas = (restrictionDataMap, restrictionGenerateTime,  scope,  orderBy, quicklyFilters ) =>{
    let restrictionDatas = Object.values( restrictionDataMap ); //转为数组
    /**
     * 过滤
     *
     * */

    // 过滤范围
    if(isValidVariable(scope) && 'ALL' != scope){ // 范围为"ALL"或无效则不进行过滤,反之过滤
        // 若范围为"EFFECTIVE"(正在生效)
        if('EFFECTIVE' == scope){
            // 过滤正在生效流控数据
            restrictionDatas = restrictionDatas.filter((item) => {
                return isEffective(item);
            });
        }
    }

    /**
     *  排序
     * */
    if("TIME" == orderBy){ // 按时间排序
        // 时间排序
        //失效在下生效在上 ? (原代码未按此规则排序)
        // 失效流控按lastModifyTime 降序排
        // 生效流控按generateTime 降序排

        restrictionDatas.sort((d1,d2) =>{
            if(isValidObject(d1) && isValidObject(d2)){
                const d1Time = d1.lastModifyTime || d1.generateTime;
                const d2Time = d2.lastModifyTime || d2.generateTime;
                return (d1Time * 1 > d2Time *1) ? -1 : 1 ;
            }
        });

    }else if("LEVEL" == orderBy){ // 按程度排序
        restrictionDatas.sort((d1,d2) =>{
            if(isValidObject(d1) && isValidObject(d2)){
                // 按限制数值降序排序
                let d1Value = d1.value;
                let d2Value = d2.value;
                return (d1Value *1 > d2Value *1) ? -1 : 1;
            }
        });
    }
    return restrictionDatas;
}
const mapStateToProps = ( state ) => {
    //限制信息数据
    const { restrictionDataMap } = state.restrictionDatas;
    //限制过滤规则
    const {
        scope = 'EFFECTIVE',
        orderBy = 'TIME',
        quicklyFilters = ''
    } = state.restrictionCondition;

    //限制数据生成时间
    const {time:restrictionGenerateTime} = state.restrictionGenerateTime;

    // 用户id
    const { userId } = state.loginUserInfo;

    return ({
        userId, // 用户id
        restrictionGenerateTime, //限制数据生成时间
        restrictionDataMap, //限制数据
        // 限制显示数据
        restrictionViewMap :  filterFlowoncontrolDatas(restrictionDataMap, restrictionGenerateTime, scope, orderBy, quicklyFilters ),
        scope, // 范围
        orderBy, // 排序规则
        quicklyFilters, // 关键字
    } )
};

const mapDispatchToProps = {
    updateRestrictionDatas, updateRestrictionConditionScope,
    updateRestrictionConditionOrderBy, updateRestrictionConditionQuicklyFilters,
    updateRestrictionGenerateTime,
};

const RestrictionListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(RestrictionList);

export default withRouter( RestrictionListContainer );