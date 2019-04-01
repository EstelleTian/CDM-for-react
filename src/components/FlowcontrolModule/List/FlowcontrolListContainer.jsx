import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateFlowcontrolDatas,  updateFlowcontrolConditionShieldLong,
    updateFlowcontrolConditionScope, updateFlowcontrolConditionPlaceType,
    updateFlowcontrolConditionOrderBy, updateFlowcontrolConditionQuicklyFilters,
    updateFlowGenerateTime, } from './Redux';

import FlowcontrolList from './FlowcontrolList';
import { isValidVariable, isValidObject } from 'utils/basic-verify';
import  { FlowcontrolDataUtil } from 'utils/flowcontrol-data-util';


/**
 * 过滤流控数据
 * @param flowcontrolDataMap 流控数据
 * @param flowGenerateTime 流控数据生成时间
 * @param shieldLong 是否屏蔽长期流控
 * @param scope 流控范围 (ALL / EFFECTIVE)
 * @param placeType 流控类型 (ALL / AP / POINT)
 * @param orderBy 排序规则 (TIME / LEVEL )
 * @param quicklyFilters 过滤关键字
 * */
const  filterFlowoncontrolDatas = (flowcontrolDataMap, flowGenerateTime, shieldLong, scope, placeType, orderBy, quicklyFilters ) =>{
    let flowcontrolDatas = Object.values( flowcontrolDataMap ); //转为数组
    /**
     * 过滤
     *
     * */

    // 过滤是否屏蔽长期
    if(shieldLong){ // 不屏蔽长期则不进行过滤,反之过滤
        flowcontrolDatas = flowcontrolDatas.filter((item) => {
            // 0 : 长期  1 : 非长期
            if( 0 == item.flowcontrolType*1){
                return false
            }else{
                return true
            }
        })
    }

    // 过滤范围
    if(isValidVariable(scope) && 'ALL' != scope){ // 范围为"ALL"或无效则不进行过滤,反之过滤
        // 若范围为"EFFECTIVE"(正在生效)
        if('EFFECTIVE' == scope){
            // 过滤正在生效流控数据
            flowcontrolDatas = flowcontrolDatas.filter((item) => {
                return FlowcontrolDataUtil.isEffective(item,flowGenerateTime);
            });
        }

    }
    // 过滤类型
    if(isValidVariable(placeType) && 'ALL' != placeType){ // 类型为"ALL"或无效则不进行过滤,反之过滤
        flowcontrolDatas = flowcontrolDatas.filter((item) => placeType == item.placeType);
    }

    /**
     *  排序
     * */
    if("TIME" == orderBy){ // 按时间排序
        // 时间排序
        //失效在下生效在上
        // 失效流控按lastModifyTime 降序排
        // 生效流控按generateTime 降序排

        flowcontrolDatas.sort((d1,d2) =>{
            if(isValidObject(d1) && isValidObject(d2)){
                const d1Time = d1.lastModifyTime || d1.generateTime;
                const d2Time = d2.lastModifyTime || d2.generateTime;

                return (d1Time * 1 > d2Time *1) ? -1 : 1 ;
            }
        });

    }else if("LEVEL" == orderBy){ // 按程度排序
        flowcontrolDatas.sort((d1,d2) =>{
            if(isValidObject(d1) && isValidObject(d2)){
                // LDR 排在最后
                if(d1.placeType == FlowcontrolDataUtil.TYPE_LDR
                    && d2.placeType != FlowcontrolDataUtil.TYPE_LDR  ){
                    return -1;
                }
                // 按程度标记降序排序
                let d1Value = calculateLevelValue(d1);
                let d2Value = calculateLevelValue(d2);
                return (d1Value *1 > d2Value *1) ? -1 : 1;

            }
        });

    }
    //条件过滤查询
    if( isValidVariable(quicklyFilters) ){
        flowcontrolDatas = flowcontrolDatas.filter( ( item ) => {
            let flag = false;
            for(let i in item){
                const itemVal = item[i] + "" || "";
                //若值包含过滤条件，则中，否则不显示
                if( isValidVariable(itemVal) ){
                    if( itemVal.toLowerCase().indexOf( quicklyFilters.toLowerCase() ) > -1 ){
                        flag = true;
                    }
                }
            }
            return flag;
        })
    }

    return flowcontrolDatas;
}

/**
 * 计算流控单个数据程度
 * */
const calculateLevelValue = (data) => {
    const { type, value, assignSlot } = data;
    let res = 0;
    if(type == FlowcontrolDataUtil.TYPE_MIT ){ // 距离
        res = parseInt( value, 10) / 13;
    }else if(type == FlowcontrolDataUtil.TYPE_TIME){ // 时间
        res = value;
    }else if(type ==FlowcontrolDataUtil.TYPE_GS){ // 地面停止
        res = 0;
    }else if(type == FlowcontrolDataUtil.TYPE_ASSIGN){ // 指定时隙
        res = assignSlot;
    }else if(type == FlowcontrolDataUtil.TYPE_RESERVE){ // 预留时隙
        res = assignSlot;
    }

    return res;

}

const mapStateToProps = ( state ) => {
    const { flowcontrolDataMap } = state.flowcontrolDatas;
    // 流控过滤规则
    const {
        shieldLong = false, // 是否屏蔽长期
        scope = 'EFFECTIVE', // 范围
        placeType = 'ALL', // 类型
        orderBy = 'TIME', // 排序依据
        quicklyFilters = '' // 快速过滤
    } = state.flowcontrolCondition;
    // 流控数据生成时间
    const {time:flowGenerateTime} = state.flowGenerateTime;
    // 获取流控数据请求中所需参数
    const flowcontrolParams = state.flowcontrolParams;
    // 用户id
    const { userId } = state.loginUserInfo;
    return ({
        userId, // 用户id
        flowcontrolParams, // 获取流控数据所需参数
        flowGenerateTime, // 流控数据生成时间
        flowcontrolDataMap, // 全部流控数据
        flowcontrolViewMap :  filterFlowoncontrolDatas(flowcontrolDataMap, flowGenerateTime, shieldLong, scope, placeType, orderBy, quicklyFilters ), // 流控显示数据
        shieldLong,
        scope,
        placeType,
        orderBy,
        quicklyFilters,
        systemConfig: state.systemConfig || {},
        loginUserInfo : state.loginUserInfo || {}
    } )
};

const mapDispatchToProps = {
    updateFlowcontrolDatas, updateFlowcontrolConditionShieldLong,
    updateFlowcontrolConditionScope, updateFlowcontrolConditionPlaceType,
    updateFlowcontrolConditionOrderBy, updateFlowcontrolConditionQuicklyFilters,
    updateFlowGenerateTime,
};

const FlowcontrolListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(FlowcontrolList);

export default withRouter( FlowcontrolListContainer );