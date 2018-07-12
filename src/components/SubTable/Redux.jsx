//action-type
//key命名规则：  操作类型（update,add,delete）+ 数据名称 + 操作对象 以下划线分隔,全部大写
//value命名规则： 数据名称 + 操作类型（update,add,delete）+ 操作对象 以左划线分隔,小写
const UPDATE_SUB_TABLE_DATAS= 'subTableDatas/update/datas';
const UPDATE_SUB_TABLE_DATAS_PROPERTY= 'subTableDatas/update/property';
//action-creator
//更新表格数据集合
const updateSubTableDatas = datas => ({
    type: UPDATE_SUB_TABLE_DATAS,
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
        colTitle: {}
    },
    special: {
        datas: {},
        colDisplay: {},
        colNames: {},
        colTitle: {}
    },
    pool: {
        datas: {},
        colDisplay: {},
        colNames: {},
        colTitle: {}
    },
    alarm: {
        datas: {},
        colDisplay: {},
        colNames: {},
        colTitle: {}
    },
    todo: {
        datas: {},
        colDisplay: {},
        colNames: {},
        colTitle: {}
    }
};
//store sub table data 表格数据--
const subTableDatas = ( state = initData, action) => {
    switch ( action.type ){
        case UPDATE_SUB_TABLE_DATAS: {
            let dataMap = action.datas || {};
            let nState = {
                ...state
            };
            let flag = false;
            //比较新旧数据，如若一样，则不更新
            for( let key in dataMap ){
                let oldData = Object.keys(state[key].datas);
                let oldDataStr = oldData.sort().join('-');
                let newData = Object.keys(dataMap[key]);
                let newDataStr = newData.sort().join('-');
                if( oldDataStr != newDataStr ){
                    nState[key].ids = newData;
                    flag = true;
                }
            }
            if( flag ){
                return {
                    ...nState
                }
            }

        }
        case UPDATE_SUB_TABLE_DATAS_PROPERTY: {
            const nProperty = action.property;
            let nState = {
                ...state
            };
            //遍历，更新每个表的属性值
            for( let key in nProperty ){
                nState[key] = {
                    ...( nState[key] ),
                    ...( nProperty[key] )
                }
            }
        }
        default:
            return state;
    }
};



export {
    subTableDatas, updateSubTableDatas
};