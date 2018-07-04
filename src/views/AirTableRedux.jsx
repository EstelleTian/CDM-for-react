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
const UPDATE_TABLE_DATAS= 'tableDatas/update';
//action-creator
const updateTableDatas = dataMap => ({
    type: UPDATE_TABLE_DATAS,
    dataMap
});
//reducer table data 表格数据
const initData = {
    tableDatasMap: {},
    filters: '',
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
        default:
            return state;
    }
};

export {
    updateTableConfig, tableConfig,
    updateTableDatas, tableDatas
};



//reducer table search 表格查询

