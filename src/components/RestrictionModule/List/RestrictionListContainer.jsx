import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateRestrictionDatas, updateRestrictionConditionScope,
    updateRestrictionConditionOrderBy, updateRestrictionConditionQuicklyFilters,updateRestrictionGenerateTime} from './Redux';

import RestrictionList from './RestrictionList';
// import { isValidVariable, isValidObject } from 'utils/basic-verify';
// import { isEffective, FlowcontroConstant } from 'utils/flowcontrol-data-util';


/**
 * 过滤流控数据
 * @param restrictionDataMap 除冰限制数据
 * @param restrictionGenerateTime 除冰限制数据生成时间
 * @param scope除冰限制范围 (ALL / EFFECTIVE)
 * @param orderBy 排序规则 (TIME / LEVEL )
 * @param quicklyFilters 过滤关键字
 * */
const  filterFlowoncontrolDatas = (restrictionDataMap, restrictionGenerateTime,  scope,  orderBy, quicklyFilters ) =>{
    let restrictionDatas = Object.values( restrictionDataMap ); //转为数组
    /**
     * 过滤
     *
     * */

    // // 过滤范围
    // if(isValidVariable(scope) && 'ALL' != scope){ // 范围为"ALL"或无效则不进行过滤,反之过滤
    //     // 若范围为"EFFECTIVE"(正在生效)
    //     if('EFFECTIVE' == scope){
    //         // 过滤正在生效流控数据
    //         restrictionDatas = restrictionDatas.filter((item) => {
    //             return isEffective(item,flowGenerateTime);
    //         });
    //     }
    //
    // }
    //
    // /**
    //  *  排序
    //  * */
    // if("TIME" == orderBy){ // 按时间排序
    //     // 时间排序
    //     //失效在下生效在上 ? (原代码未按此规则排序)
    //     // 失效流控按lastModifyTime 降序排
    //     // 生效流控按generateTime 降序排
    //
    //     restrictionDatas.sort((d1,d2) =>{
    //         if(isValidObject(d1) && isValidObject(d2)){
    //             const d1Time = d1.lastModifyTime || d1.generateTime;
    //             const d2Time = d2.lastModifyTime || d2.generateTime;
    //
    //             return (d1Time * 1 > d2Time *1) ? -1 : 1 ;
    //         }
    //     });
    //
    // }else if("LEVEL" == orderBy){ // 按程度排序
    //     restrictionDatas.sort((d1,d2) =>{
    //         if(isValidObject(d1) && isValidObject(d2)){
    //             // LDR 排在最后
    //             if(d1.placeType == FlowcontroConstant.TYPE_LDR
    //                 && d2.placeType != FlowcontroConstant.TYPE_LDR  ){
    //                 return -1;
    //             }
    //             // 按程度标记降序排序
    //             let d1Value = calculateLevelValue(d1);
    //             let d2Value = calculateLevelValue(d2);
    //             return (d1Value *1 > d2Value *1) ? -1 : 1;
    //
    //         }
    //     });
    //
    // }

    return restrictionDatas;
}

/**
 * 计算流控单个数据程度
 * */
const calculateLevelValue = (data) => {
    const { type, value, assignSlot } = data;
    let res = 0;
    if(type == FlowcontroConstant.TYPE_MIT ){ // 距离
        res = parseInt( value, 10) / 13;
    }else if(type == FlowcontroConstant.TYPE_TIME){ // 时间
        res = value;
    }else if(type == FlowcontroConstant.TYPE_GS){ // 地面停止
        res = 0;
    }else if(type == FlowcontroConstant.TYPE_ASSIGN){ // 指定时隙
        res = assignSlot;
    }else if(type == FlowcontroConstant.TYPE_RESERVE){ // 预留时隙
        res = assignSlot;
    }

    return res;

}

const mapStateToProps = ( state ) => {
    //除冰限制信息数据
    const { restrictionDataMap } = state.restrictionDatas;
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
        restrictionDataMap, //除冰限制数据
        // 除冰限制显示数据
        restrictionViewMap :  filterFlowoncontrolDatas(restrictionDataMap, restrictionGenerateTime, scope, orderBy, quicklyFilters ),
        scope,
        orderBy,
        quicklyFilters,
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