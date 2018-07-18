//action-type
//key命名规则：  操作类型（update,add,delete）+ 数据名称 + 操作对象 以下划线分隔,全部大写
//value命名规则： 数据名称 + 操作类型（update,add,delete）+ 操作对象 以左划线分隔,小写
const UPDATE_FLOWCONTROL_DATAS= 'flowcontrolDatas/update/datas';
const UPDATE_FLOWCONTROL_VIEWMAP= 'flowcontrolDatas/update/viewMap';

//action-creator
//更新流控数据集合
const updateFlowcontrolDatas = dataMap => ({
    type: UPDATE_FLOWCONTROL_DATAS,
    dataMap
});
//reducer flowcontrol data 流控数据
const initData = {
    flowcontrolDataMap: {}, // 流控数据
};

// 更新流控显示数据集合
const updateFlowcontrolViewMap = viewMap => ({
    type: UPDATE_FLOWCONTROL_VIEWMAP,
    viewMap
});


//store flowcontrol data 流控数据
const flowcontrolDatas = ( state = initData, action) => {
    switch ( action.type ){
        case UPDATE_FLOWCONTROL_DATAS: {
            const flowcontrolDataMap = state.flowcontrolDataMap;
            let dataMap = action.dataMap || {};
            dataMap = { ...flowcontrolDataMap, ...dataMap};
            return {
                ...state,
                flowcontrolDataMap: dataMap
            }
        }
        default:
            return state;
    }
};



//--------------------------------------------------------------------

const UPDATE_FLOWCONTROL_CONDITION_SHIELD_LONG= 'flowcontrolCondition/update/shieldLong ';
const UPDATE_FLOWCONTROL_CONDITION_SCOPE= 'flowcontrolCondition/update/scope';
const UPDATE_FLOWCONTROL_CONDITION_PLACE_TYPE= 'flowcontrolCondition/update/placeType';
const UPDATE_FLOWCONTROL_CONDITION_ORDER_BY= 'flowcontrolCondition/update/orderBy';
const UPDATE_FLOWCONTROL_CONDITION_QUICKLY_FILTERS= 'flowcontrolCondition/update/quicklyFilters';
//更新流控列表当前是否屏蔽长期
const updateFlowcontrolConditionShieldLong = flag => ({
    type: UPDATE_FLOWCONTROL_CONDITION_SHIELD_LONG,
    flag
});
//更新流控列表当前范围(正在生效/今日全部)
const updateFlowcontrolConditionScope = scope => ({
    type: UPDATE_FLOWCONTROL_CONDITION_SCOPE,
    scope
});
//更新流控列表当前类型(机场/航路/全部)
const updateFlowcontrolConditionPlaceType = placeType => ({
    type: UPDATE_FLOWCONTROL_CONDITION_PLACE_TYPE,
    placeType
});
//更新表格当前排序值
const updateFlowcontrolConditionOrderBy = data => ({
    type: UPDATE_FLOWCONTROL_CONDITION_ORDER_BY,
    data
});
//更新表格当前快速查询条件值
const updateFlowcontrolConditionQuicklyFilters = data => ({
    type: UPDATE_FLOWCONTROL_CONDITION_QUICKLY_FILTERS,
    data
});
const initFlowcontrolCondition = {
    shieldLong : true, // 是否屏蔽长期
    scope: 'ALL', //流控列表范围 EFFECTIVE ALL
    placeType: 'ALL', //流控类型
    orderBy: 'TIME', //流控列表排序字段
    quicklyFilters: '', //流控列表快速过滤数值
};
//store table data 表格数据-- 数据生成时间、统计各个数值
const flowcontrolCondition = (state = initFlowcontrolCondition, action) => {
    switch ( action.type ){
        case UPDATE_FLOWCONTROL_CONDITION_SHIELD_LONG: {
            if( state.shieldLong != action.flag ){
                return {
                    ...state,
                    shieldLong: action.flag
                }
            }
        }
        case UPDATE_FLOWCONTROL_CONDITION_SCOPE: {
            if( state.scope != action.scope ){
                return {
                    ...state,
                    scope: action.scope
                }
            }
        }
        case UPDATE_FLOWCONTROL_CONDITION_PLACE_TYPE: {
            if( state.placeType != action.placeType ){
                return {
                    ...state,
                    placeType: action.placeType
                }
            }
        }
        case UPDATE_FLOWCONTROL_CONDITION_ORDER_BY: {
            if( state.orderBy != action.data ){
                return {
                    ...state,
                    orderBy: action.data
                }
            }
        }
        case UPDATE_FLOWCONTROL_CONDITION_QUICKLY_FILTERS: {
            return {
                ...state,
                quicklyFilters: action.data
            }
        }

        default:
            return state;
    }
};

//---------------------------------------------------------------------
const UPDATE_FLOW_GENERATE_TIME= 'flowcontrolGenerateTime/update';

//更新数据生成时间
const updateFlowGenerateTime = time => ({
    type : UPDATE_FLOW_GENERATE_TIME,
    time
});
const initFlowGenerateTime = {
    time : '', // 流控数据生成时间
};

//流控数据生成时间数值
const flowGenerateTime = (state = initFlowGenerateTime, action) => {
    switch ( action.type ){
        case UPDATE_FLOW_GENERATE_TIME: {
            const { time } = action;
            return{
                ...state,
                time: time
            }
        }
        default:
            return state;
    }
};



//---------------------------------------------------------------------
export {
    flowcontrolDatas, updateFlowcontrolDatas,
    flowcontrolCondition, updateFlowcontrolConditionShieldLong,
    updateFlowcontrolConditionScope, updateFlowcontrolConditionPlaceType,
    updateFlowcontrolConditionOrderBy, updateFlowcontrolConditionQuicklyFilters,
    flowGenerateTime, updateFlowGenerateTime,
};