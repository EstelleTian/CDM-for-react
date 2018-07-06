//action-type
const UPDATE_TABLE_CONFIG= 'tableConfig/update';
//action-creator
const updateTableConfig = params => ({
    type: UPDATE_TABLE_CONFIG,
    params
});
//reducer table config 表格配置
const initConfig = {
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
const tableConfig = ( state = initConfig, action) => {
    switch ( action.type ){
        case UPDATE_TABLE_CONFIG: {
            const params = action.params;
            return {
                colNames: params.colNames || {},
                colTitle: params.colTitle || {},
                colDisplay: params.colDisplay || {},
                displayStyle: params.displayStyle || {},
                displayStyleComment: params.displayStyleComment || {},
                colEdit: params.colEdit || {},
                colFontSize: params.colFontSize || {},
                colStyle: params.colStyle || {},
                invalidDataStyle: params.invalidDataStyle || ''
            }
        }
        default:
            return state;
    }
}


//action-type
const UPDATE_TABLE_DATAS= 'tableDatas/update/datas';
const UPDATE_TABLE_COLUMNS= 'tableDatas/update/columns';
const UPDATE_TABLE_SORTER_DATA= 'tableDatas/update/sorterData';
const UPDATE_TABLE_SCROLL_ID= 'tableDatas/update/scrollId';
//action-creator
//更新表格数据集合
const updateTableDatas = dataMap => ({
    type: UPDATE_TABLE_DATAS,
    dataMap
});
//更新表格列名值和表列宽度和
const updateTableColumns = ( columns, width ) => ({
    type: UPDATE_TABLE_COLUMNS,
    columns,
    width
});
//更新表格当前排序值
const updateTableSorterData = ( data ) => ({
    type: UPDATE_TABLE_SORTER_DATA,
    data
});
//更新表格当前自动滚动定位航班id
const updateTableScrollId = ( data ) => ({
    type: UPDATE_TABLE_SCROLL_ID,
    data
});
//reducer table data 表格数据
const initData = {
    tableDatasMap: {}, //表格数据
    tableColumns: [], //表格列名
    tableWidth: 0, //表格宽
    filters: '', //表格过滤数据
    sorterData: 'ATOT', //表格排序字段
    scrollTargetId: '', //表格滚动定位航班id
    isloading: false
};
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
        case UPDATE_TABLE_COLUMNS: {
            return {
                ...state,
                tableColumns: action.columns || [],
                tableWidth: action.width || 0,
            }
        }
        case UPDATE_TABLE_SORTER_DATA: {
            return {
                ...state,
                sorterData: action.data
            }
        }
        case UPDATE_TABLE_SCROLL_ID: {
            return {
                ...state,
                scrollTargetId: action.data
            }
        }
        default:
            return state;
    }
};

const initTotalInfo = {
    generateTime :'', // 数据生成时间
    generateInfo : {}
}
//action-type
const UPDATE_TOTALINFO= 'totalInfo/update';
const updateTotalInfo = totalObj => ({
    type : UPDATE_TOTALINFO,
    totalObj
});


const totalInfo = (state = initTotalInfo, action) => {
    switch ( action.type ){
        case UPDATE_TOTALINFO: {
            return{
                ...state,
                generateTime : action.totalObj.generateTime,
                generateInfo : action.totalObj.generateInfo
            }
        }
        default:
            return state;
    }
}

export {
    tableConfig, updateTableConfig,
    tableDatas, updateTableDatas, updateTableColumns, updateTableSorterData, updateTableScrollId,
    totalInfo, updateTotalInfo
};



//reducer table search 表格查询

