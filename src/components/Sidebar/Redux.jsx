//action-type
//key命名规则：  操作类型（update,add,delete）+ 数据名称 + 操作对象 以下划线分隔,全部大写
//value命名规则： 数据名称 + 操作类型（update,add,delete）+ 操作对象 以左划线分隔,小写

const UPDATE_SIDEBAR_STATUS = 'sidebar/update/status';
const UPDATE_SIDEBAR_KEY = 'sidebar/update/key';
//更新侧边栏显示状态
const updateSidebarStatus = show => ({
    type: UPDATE_SIDEBAR_STATUS,
    show
});

//更新侧边栏当前显示模块的key值
const updateSidebarKey = key => ({
    type: UPDATE_SIDEBAR_KEY,
    key
});

const initSidebar = {
    show : true, // 是否显示 默认显示
    key : 'flowcontrol-info', // 当前显示模块的key值 默认为流控信息模块
};

const sidebarConfig = (state = initSidebar, action) => {
    switch ( action.type ){
        case UPDATE_SIDEBAR_STATUS: {
            if( state.show != action.show ){
                return {
                    ...state,
                    show: action.show
                }
            }
            return state;
        }
        case UPDATE_SIDEBAR_KEY: {
            if( state.key != action.key ){
                return {
                    ...state,
                    key: action.key
                }
            }
            return state;
        }

        default:
            return state;
    }
};

//---------------------------------------------------------------------
export {
    sidebarConfig, updateSidebarStatus, updateSidebarKey

};