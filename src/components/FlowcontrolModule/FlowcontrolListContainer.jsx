import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateFlowcontrolDatas,  updateFlowcontrolConditionShieldLong,
    updateFlowcontrolConditionScope, updateFlowcontrolConditionPlaceType,
    updateFlowcontrolConditionOrderBy, updateFlowcontrolConditionQuicklyFilters,
    updateFlowGenerateTime, } from './Redux';

import FlowcontrolList from './FlowcontrolList';
import { isValidVariable, isValidObject } from '../../utils/basic-verify';
import { isEffective } from '../../utils/flowcontrol-data-util';


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
        // 失效流控按lastModifyTime倒叙排
        // 生效流控按generateTime倒叙排排

        flowcontrolDatas.sort((d1,d2) =>{
            if(isValidObject(d1) && isValidObject(d2)){
                const d1Time = d1.lastModifyTime || d1.generateTime;
                const d2Time = d2.lastModifyTime || d2.generateTime;

                return (d1Time * 1 > d2Time *1) ? -1 : 1 ;
            }
        });

    }else if("LEVEL" == orderBy){ // 按程度排序
        // LDR 排在最后
        //


    }


    return flowcontrolDatas;
}

const mapStateToProps = ( state ) => {
    const { flowcontrolDataMap , flowcontrolViewMap} = state.flowcontrolDatas;

    const {  shieldLong = false,
        scope = 'effective',
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