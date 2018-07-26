//action-type
//key命名规则：  操作类型（update,add,delete）+ 数据名称 + 操作对象 以下划线分隔,全部大写
//value命名规则： 数据名称 + 操作类型（update,add,delete）+ 操作对象 以左划线分隔,小写
import { isValidVariable } from "../../utils/basic-verify";

const UPDATE_OPERATION_DATAS_SHOWNAME_AND_POSITION= 'operationDatas/update/showNameAndPosition';
//action-creator
//更新显示协调窗口名称和位置
const updateOperationDatasShowNameAndPosition = ( name, x, y ) => ({
    type: UPDATE_OPERATION_DATAS_SHOWNAME_AND_POSITION,
    name,
    x,
    y
});


//reducer 协调窗口数据
const initData = {
    showName: '', //需要展示的协调窗口名称
    x: 0, //需要展示窗口x坐标值
    y: 0, //需要展示窗口y坐标值
    flightid: "", //航班号
    auth: {}, //航班对应权限对象集合
};
//store 协调窗口数据--
const operationDatas = ( state = initData, action) => {
    switch ( action.type ){
        case UPDATE_OPERATION_DATAS_SHOWNAME_AND_POSITION: {
            return {
                ...state,
                showName: action.name || "",
                x: action.x || 0,
                y: action.y || 0,
            }
        }
        default:
            return state;
    }
};

export {
    operationDatas,
    updateOperationDatasShowNameAndPosition
};