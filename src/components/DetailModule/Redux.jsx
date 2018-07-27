//action-type
//key命名规则：  操作类型（update,add,delete）+ 数据名称 + 操作对象 以下划线分隔,全部大写
//value命名规则： 数据名称 + 操作类型（update,add,delete）+ 操作对象 以左划线分隔,小写
import { isValidVariable } from "../../utils/basic-verify";

const UPDATE_DETAIL_MODAL_DATAS_VISIBLE= 'detailModalDatas/update/visible';
const UPDATE_DETAIL_MODAL_DATAS_BY_NAME= 'detailModalDatas/update/orgData';
//action-creator
//根据指定名称更新详情窗口显隐
const updateDetailModalDatasVisible = ( name, show ) => ({
    type: UPDATE_DETAIL_MODAL_DATAS_VISIBLE,
    name,
    show
});
//根据指定名称更新详情窗口数据
const updateDetailModalDatasByName = ( name, data ) => ({
    type: UPDATE_DETAIL_MODAL_DATAS_BY_NAME,
    name,
    data
});

//reducer 协调窗口数据
const initData = {
    flight: {
        show: false,
        orgData: {}
    }

};
//store 协调窗口数据--
const detailModalDatas = ( state = initData, action) => {
    switch ( action.type ){
        case UPDATE_DETAIL_MODAL_DATAS_VISIBLE: {
            const { name = "", show = false } = action;
            if( isValidVariable(name) ){
                const res = {
                    ...state,
                    [name]: {
                        ...( state[name] ),
                        show
                    }
                };
                return res
            }
        }
        case UPDATE_DETAIL_MODAL_DATAS_BY_NAME: {
            const { name = "", data = {} } = action;
            if( isValidVariable(name) ){
                const res = {
                    ...state,
                    [name]: {
                        ...( state[name] ),
                        orgData: data
                    }
                };
                return res
            }
        }
        default:
            return state;
    }
};

export {
    detailModalDatas,
    updateDetailModalDatasVisible, updateDetailModalDatasByName
};