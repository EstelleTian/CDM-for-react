import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateFlowcontrolDatas,  updateFlowcontrolConditionShieldLong,
    updateFlowcontrolConditionScope, updateFlowcontrolConditionPlaceType,
    updateFlowcontrolConditionOrderBy, updateFlowcontrolConditionQuicklyFilters,
    updateFlowGenerateTime, } from './Redux';

import FlowcontrolList from './FlowcontrolList';
import { isValidVariable, isValidObject } from '../../utils/basic-verify';
import { isEffective, FlowcontroConstant } from '../../utils/flowcontrol-data-util';


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
                return isEffective(item,flowGenerateTime);
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
        //失效在下生效在上 ? (原代码未按此规则排序)
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
                if(d1.placeType == FlowcontroConstant.TYPE_LDR
                    && d2.placeType != FlowcontroConstant.TYPE_LDR  ){
                    return -1;
                }
                // 按程度标记降序排序
                let d1Value = calculateLevelValue(d1);
                let d2Value = calculateLevelValue(d2);
                return (d1Value *1 > d2Value *1) ? -1 : 1;

            }
        });

    }

    return flowcontrolDatas;
}

/**
 * 计算流控单个数据程度
 * */
const calculateLevelValue = (data) => {
    const { type, value, assignSlot } = data;
    debugger
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
    const { flowcontrolDataMap , flowcontrolViewMap} = state.flowcontrolDatas;

    const {  shieldLong = false,
        scope = 'EFFECTIVE',
        placeType = 'ALL',
        orderBy = 'TIME',
        quicklyFilters = ''
    } = state.flowcontrolCondition;

    const {time:flowGenerateTime} = state.flowGenerateTime;

    return ({
        flowGenerateTime, // 流控数据生成时间
        flowcontrolDataMap, // 流控数据
        flowcontrolViewMap :  filterFlowoncontrolDatas(flowcontrolDataMap, flowGenerateTime, shieldLong, scope, placeType, orderBy, quicklyFilters ), // 流控显示数据
        shieldLong,
        scope,
        placeType,
        orderBy,
        quicklyFilters,
    } )
};

const mapDispatchTopProps = {
    updateFlowcontrolDatas, updateFlowcontrolConditionShieldLong,
    updateFlowcontrolConditionScope, updateFlowcontrolConditionPlaceType,
    updateFlowcontrolConditionOrderBy, updateFlowcontrolConditionQuicklyFilters,
    updateFlowGenerateTime,
};

const FlowcontrolListContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(FlowcontrolList);

export default withRouter( FlowcontrolListContainer );