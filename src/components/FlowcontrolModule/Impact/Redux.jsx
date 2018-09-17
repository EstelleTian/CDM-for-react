//action-type
//key命名规则：  操作类型（update,add,delete）+ 数据名称 + 操作对象 以下划线分隔,全部大写
//value命名规则： 数据名称 + 操作类型（update,add,delete）+ 操作对象 以左划线分隔,小写
const UPDATE_FLOW_TABLE_DATAS= 'flowTableDatas/update/datas';
const UPDATE_MULTI_FLOW_TABLE_DATAS= 'flowTableDatas/update/multidatas';
const UPDATE_FLOW_TABLE_DATAS_PROPERTY= 'flowTableDatas/update/property';
const UPDATE_FLOW_TABLE_DATAS_COLUMNS= 'flowTableDatas/update/columns';
//action-creator
//更新表格数据集合
const updateFlowTableDatas = dataMap => ({
    type: UPDATE_FLOW_TABLE_DATAS,
    dataMap
});
//更新表格单条或多条数据集合
const updateMultiFlowTableDatas = multiDataMap => ({
    type: UPDATE_MULTI_FLOW_TABLE_DATAS,
    multiDataMap
});
//更新表格配置属性值
const updateFlowTableDatasProperty = property => ({
    type: UPDATE_FLOW_TABLE_DATAS_PROPERTY,
    property
});
//更新表格列名值和表列宽度和
const updateFlowTableDatasColumns = ( columns, width ) => ({
    type: UPDATE_FLOW_TABLE_DATAS_COLUMNS,
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
        invalidDataStyle: "", //失效航班样式
        colPoolDisplay: {},
    }
};
//store table data 表格数据-- 包含：表格列名、数据、样式配置字段
const flowTableDatas = ( state = initData, action) => {
    switch ( action.type ){
        case UPDATE_FLOW_TABLE_DATAS: {
            const tableDatasMap = state.tableDatasMap;
            let dataMap = action.dataMap || {};
            dataMap = { ...tableDatasMap, ...dataMap};
            return {
                ...state,
                tableDatasMap: dataMap
            }
        }
        case UPDATE_MULTI_FLOW_TABLE_DATAS: {
            let multiDataMap = action.multiDataMap || {};
            let newTableDatasMap = state.tableDatasMap;
            for(let id in multiDataMap){
                //若有该航班，更新;没有添加
                newTableDatasMap[id] = multiDataMap[id];
            }
            return {
                ...state,
                tableDatasMap: newTableDatasMap
            }
        }
        case UPDATE_FLOW_TABLE_DATAS_PROPERTY: {
            const { property = {} } = action;
            return {
                ...state,
                property: {
                    ...property
                }

            }
        }
        case UPDATE_FLOW_TABLE_DATAS_COLUMNS: {
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
export {
    flowTableDatas, updateFlowTableDatas, updateMultiFlowTableDatas, updateFlowTableDatasProperty, updateFlowTableDatasColumns
};