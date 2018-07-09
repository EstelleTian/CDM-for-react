//action-type
//key命名规则：  操作类型（update,add,delete）+ 数据名称 + 操作对象 以下划线分隔,全部大写
//value命名规则： 数据名称 + 操作类型（update,add,delete）+ 操作对象 以左划线分隔,小写
const UPDATE_TABLE_DATAS= 'tableDatas/update/datas';
const UPDATE_TABLE_DATAS_PROPERTY= 'tableDatas/update/property';
const UPDATE_TABLE_DATAS_COLUMNS= 'tableDatas/update/columns';
//action-creator
//更新表格数据集合
const updateTableDatas = dataMap => ({
    type: UPDATE_TABLE_DATAS,
    dataMap
});
//更新表格配置属性值
const updateTableDatasProperty = property => ({
    type: UPDATE_TABLE_DATAS_PROPERTY,
    property
});
//更新表格列名值和表列宽度和
const updateTableDatasColumns = ( columns, width ) => ({
    type: UPDATE_TABLE_DATAS_COLUMNS,
    columns,
    width
});
//reducer table data 表格数据
const initData = {
    tableDatasMap: {}, //表格数据
    tableColumns: [], //表格列名
    tableWidth: 0, //表格宽
    property: {
        colNames: {},
        colTitle: {},
        colDisplay: {},
        displayStyle: {},
        displayStyleComment: {},
        colEdit: {},
        colFontSize: {},
        colStyle: {},
        invalidDataStyle: "" //失效航班样式
    }
};
//store table data 表格数据-- 包含：表格列名、数据、样式配置字段
const tableDatas = ( state = initData, action) => {
    switch ( action.type ){
        case UPDATE_TABLE_DATAS: {
            const tableDatasMap = state.tableDatasMap;
            let dataMap = action.dataMap || {};
            dataMap = { ...tableDatasMap, ...dataMap};
            return {
                ...state,
                tableDatasMap: dataMap
            }
        }
        case UPDATE_TABLE_DATAS_PROPERTY: {
            const { property = {} } = action;
            return {
                ...state,
                property: {
                    ...property
                }

            }
        }
        case UPDATE_TABLE_DATAS_COLUMNS: {
            return {
                ...state,
                tableColumns: action.columns || [],
                tableWidth: action.width || 0,
            }
        }
        default:
            return state;
    }
};
//---------------------------------------------------------------------
// 航班数据统计信息
//action-type
const UPDATE_GENERATE_INFO= 'generateInfo/update';
//更新数据航班统计值字段
const updateGenerateInfo = generateObj => ({
    type : UPDATE_GENERATE_INFO,
    generateObj
});
const initGenerateInfo = {
    CHART_CNL_NUM : '',
    CHART_DLA_NUM : '',
    CHART_FPL_NUM : '',
    CNL_NUM : '',
    CPL_NUM : '',
    ALL_NUM : '', // 全部航班数
    ARR_NUM : '', // 已落地航班数
    DEP_NUM : '', // 已起飞航班数
    FPL_NUM : '',
    SCH_NUM : '',
    GROUND_NUM: '' // 未起飞航班数
};
//航班数据统计各个数值
const generateInfo = (state = initGenerateInfo, action) => {
    switch ( action.type ){
        case UPDATE_GENERATE_INFO: {
            const { generateObj } = action;
            return{
                ...state,
                ...generateObj
            }
        }
        default:
            return state;
    }
};

//---------------------------------------------------------------------
//数据生成时间
//action-type
const UPDATE_GENERATE_TIME= 'GENERATETIME/update';
//更新数据生成时间
const updateGenerateTime = time => ({
    type : UPDATE_GENERATE_TIME,
    time
});
const initGenerateTime = {
    time : ''
};
//数据生成时间数值
const generateTime = (state = initGenerateTime, action) => {
    switch ( action.type ){
        case UPDATE_GENERATE_TIME: {
            const { time } = action;
            return{
                ...state,
                ...time
            }
        }
        default:
            return state;
    }
};
//---------------------------------------------------------------------
const UPDATE_TABLE_CONDITION_SCROLL= 'tableCondition/update/scroll';
const UPDATE_TABLE_CONDITION_SCROLL_ID= 'tableCondition/update/scrollId';
const UPDATE_TABLE_CONDITION_ORDER_BY= 'tableCondition/update/orderBy';
const UPDATE_TABLE_CONDITION_QUICKLY_FILTERS= 'tableCondition/update/quicklyFilters';
//更新表格当前是否是自动滚动
const updateTableConditionScroll = flag => ({
    type: UPDATE_TABLE_CONDITION_SCROLL,
    flag
});
//更新表格当前自动滚动定位航班id
const updateTableConditionScrollId = id => ({
    type: UPDATE_TABLE_CONDITION_SCROLL_ID,
    id
});
//更新表格当前排序值
const updateTableConditionOrderBy = data => ({
    type: UPDATE_TABLE_CONDITION_ORDER_BY,
    data
});
//更新表格当前快速查询条件值
const updateTableConditionQuicklyFilters = data => ({
    type: UPDATE_TABLE_CONDITION_QUICKLY_FILTERS,
    data
});
const initTableCondition = {
    scroll : true, // 是否自动滚动
    scrollId: '', //表格自动滚动定位航班id
    orderBy: 'ATOT', //表格排序字段
    quicklyFilters: '', //表格快速过滤数值
};
//store table data 表格数据-- 数据生成时间、统计各个数值
const tableCondition = (state = initTableCondition, action) => {
    switch ( action.type ){
        case UPDATE_TABLE_CONDITION_SCROLL: {
            if( state.scroll != action.flag ){
                return {
                    ...state,
                    scroll: action.flag
                }
            }
        }
        case UPDATE_TABLE_CONDITION_SCROLL_ID: {
            if( state.scrollId != action.id ){
                return {
                    ...state,
                    scrollId: action.id
                }
            }
        }
        case UPDATE_TABLE_CONDITION_ORDER_BY: {
            if( state.orderBy != action.data ){
                return {
                    ...state,
                    orderBy: action.data
                }
            }
        }
        case UPDATE_TABLE_CONDITION_QUICKLY_FILTERS: {
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
export {
    tableDatas, updateTableDatas, updateTableDatasProperty, updateTableDatasColumns,
    generateInfo, updateGenerateInfo, generateTime, updateGenerateTime,
    tableCondition, updateTableConditionScroll, updateTableConditionScrollId, updateTableConditionOrderBy
};