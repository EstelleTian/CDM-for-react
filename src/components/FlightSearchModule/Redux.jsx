//action-type
//key命名规则：  操作类型（update,add,delete）+ 数据名称 + 操作对象 以下划线分隔,全部大写
//value命名规则： 数据名称 + 操作类型（update,add,delete）+ 操作对象 以左划线分隔,小写
import {isValidVariable} from "../../utils/basic-verify";

const UPDATE_SEARCH_TABLE_DATAS= 'searchTableDatas/update/datas';
const UPDATE_SEARCH_TABLE_DATAS_PROPERTY= 'searchTableDatas/update/property';
//action-creator
//更新表格数据集合
const updateSearchTableDatas = (datas) => ({
    type: UPDATE_SEARCH_TABLE_DATAS,
    datas
});
//更新表格数据样式集合
const updateSearchTableDatasProperty = property => ({
    type: UPDATE_SEARCH_TABLE_DATAS_PROPERTY,
    property
});
//reducer sub table data 表格数据
const initData = {
    flightSearch: {
        datas: {},
        colDisplay: {},
        colNames: {},
        colTitle: {},
        colEdit: {},
        colStyle: {}
    }
};
//store sub table data 表格数据--
const searchTableDatas = ( state = initData, action) => {
    switch ( action.type ){
        case UPDATE_SEARCH_TABLE_DATAS: {
            let dataMap = action.datas || {};
                const res = {
                    ...state,
                    datas: dataMap
                };
                return res
            return state;
        }
        case UPDATE_SEARCH_TABLE_DATAS_PROPERTY: {
            return {
                ...state,
                ...( action.property )
            }
        }
        default:
            return state;
    }
};

export {
    searchTableDatas, updateSearchTableDatas, updateSearchTableDatasProperty
};