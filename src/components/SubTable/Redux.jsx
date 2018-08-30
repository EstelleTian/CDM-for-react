//action-type
//key命名规则：  操作类型（update,add,delete）+ 数据名称 + 操作对象 以下划线分隔,全部大写
//value命名规则： 数据名称 + 操作类型（update,add,delete）+ 操作对象 以左划线分隔,小写
import {isValidVariable} from "../../utils/basic-verify";

const UPDATE_SUB_TABLE_DATAS= 'subTableDatas/update/datas';
const UPDATE_SUB_TABLE_DATAS_PROPERTY= 'subTableDatas/update/property';
//action-creator
//更新表格数据集合
const updateSubTableDatas = (name, datas) => ({
    type: UPDATE_SUB_TABLE_DATAS,
    name,
    datas
});
//更新表格数据样式集合
const updateSubTableDatasProperty = property => ({
    type: UPDATE_SUB_TABLE_DATAS_PROPERTY,
    property
});
//reducer sub table data 表格数据
const initData = {
    expired: {
        datas: {},
        colDisplay: {},
        colNames: {},
        colTitle: {},
        colEdit: {},
        colStyle: {}
    },
    special: {
        datas: {},
        colDisplay: {},
        colNames: {},
        colTitle: {},
        colEdit: {},
        colStyle: {}
    },
    pool: {
        datas: {},
        colDisplay: {},
        colNames: {},
        colTitle: {},
        colEdit: {},
        colStyle: {}
    },
    alarm: {
        datas: {},
        colDisplay: {},
        colNames: {},
        colTitle: {},
        colEdit: {},
        colStyle: {}
    },
    todo: {
        datas: {},
        colDisplay: {},
        colNames: {},
        colTitle: {},
        colEdit: {},
        colStyle: {}
    }
};
//store sub table data 表格数据--
const subTableDatas = ( state = initData, action) => {
    switch ( action.type ){
        case UPDATE_SUB_TABLE_DATAS: {
            let dataMap = action.datas || {};
            const name = action.name || "";
            if( isValidVariable(name) ){
                const res = {
                    ...state,
                    [name]: {
                        ...( state[name] ),
                        datas: dataMap
                    }
                };
                return res
            }
            return state;
        }
        case UPDATE_SUB_TABLE_DATAS_PROPERTY: {
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
    subTableDatas, updateSubTableDatas, updateSubTableDatasProperty
};