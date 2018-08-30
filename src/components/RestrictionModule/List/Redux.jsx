//action-type
//key命名规则：  操作类型（update,add,delete）+ 数据名称 + 操作对象 以下划线分隔,全部大写
//value命名规则： 数据名称 + 操作类型（update,add,delete）+ 操作对象 以左划线分隔,小写
const UPDATE_RESTRICTION_DATAS= 'restrictionDatas/update/datas';

//action-creator
//更新除冰限制数据集合
const updateRestrictionDatas = dataMap => ({
    type: UPDATE_RESTRICTION_DATAS,
    dataMap
});
//reducer restriction data 除冰限制数据
const initData = {
    restrictionDataMap: {}, // 除冰限制数据
};

//store restriction data 除冰限制数据
const restrictionDatas = ( state = initData, action) => {
    switch ( action.type ){
        case UPDATE_RESTRICTION_DATAS: {
            const restrictionDataMap = state.restrictionDataMap;
            let dataMap = action.dataMap || {};
            dataMap = { ...restrictionDataMap, ...dataMap};
            return {
                ...state,
                restrictionDataMap: dataMap
            }
        }
        default:
            return state;
    }
};

//--------------------------------------------------------------------

const UPDATE_RESTRICTION_CONDITION_SCOPE= 'restrictionCondition/update/scope';
const UPDATE_RESTRICTION_CONDITION_ORDER_BY= 'restrictionCondition/update/orderBy';
const UPDATE_RESTRICTION_CONDITION_QUICKLY_FILTERS= 'restrictionCondition/update/quicklyFilters';

//更新除冰限制列表当前范围(正在生效/今日全部)
const updateRestrictionConditionScope = scope => ({
    type: UPDATE_RESTRICTION_CONDITION_SCOPE,
    scope
});
//更新表格当前排序值
const updateRestrictionConditionOrderBy = data => ({
    type: UPDATE_RESTRICTION_CONDITION_ORDER_BY,
    data
});
//更新表格当前快速查询条件值
const updateRestrictionConditionQuicklyFilters = data => ({
    type: UPDATE_RESTRICTION_CONDITION_QUICKLY_FILTERS,
    data
});
const initRestrictionCondition = {
    scope: 'EFFECTIVE', // 除冰限制列表范围 EFFECTIVE ALL
    orderBy: 'TIME', // 除冰限制列表排序字段
    quicklyFilters: '', // 除冰限制列表快速过滤数值
};
//store restriction 除冰限制条件数据-- 范围、排序规则数值
const restrictionCondition = (state = initRestrictionCondition, action) => {
    switch ( action.type ){

        case UPDATE_RESTRICTION_CONDITION_SCOPE: {
            if( state.scope != action.scope ){
                return {
                    ...state,
                    scope: action.scope
                }
            }
            return state;
        }
        case UPDATE_RESTRICTION_CONDITION_ORDER_BY: {
            if( state.orderBy != action.data ){
                return {
                    ...state,
                    orderBy: action.data
                }
            }
            return state;
        }
        case UPDATE_RESTRICTION_CONDITION_QUICKLY_FILTERS: {
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
const UPDATE_RESTRICTION_GENERATE_TIME= 'restrictionGenerateTime/update';

//更新数据生成时间
const updateRestrictionGenerateTime = time => ({
    type : UPDATE_RESTRICTION_GENERATE_TIME,
    time
});
const initRestrictionGenerateTime = {
    time : '', // 除冰限制数据生成时间
};

//除冰限制数据生成时间数值
const restrictionGenerateTime = (state = initRestrictionGenerateTime, action) => {
    switch ( action.type ){
        case UPDATE_RESTRICTION_GENERATE_TIME: {
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
    restrictionDatas, updateRestrictionDatas,
    restrictionCondition,
    updateRestrictionConditionScope,
    updateRestrictionConditionOrderBy, updateRestrictionConditionQuicklyFilters,
    restrictionGenerateTime, updateRestrictionGenerateTime,
};