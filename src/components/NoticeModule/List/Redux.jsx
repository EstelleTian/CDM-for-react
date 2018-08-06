//action-type
//key命名规则：  操作类型（update,add,delete）+ 数据名称 + 操作对象 以下划线分隔,全部大写
//value命名规则： 数据名称 + 操作类型（update,add,delete）+ 操作对象 以左划线分隔,小写
const UPDATE_NOTICE_DATAS= 'noticeDatas/update/datas';

//action-creator
//更新通告信息数据集合
const updateNoticeDatas = dataMap => ({
    type: UPDATE_NOTICE_DATAS,
    dataMap
});
//reducer notice data 通告信息数据
const initData = {
    noticeDataMap: {}, // 通告信息数据
};

//store notice data 通告信息数据
const noticeDatas = ( state = initData, action) => {
    switch ( action.type ){
        case UPDATE_NOTICE_DATAS: {
            const noticeDataMap = state.noticeDataMap;
            let dataMap = action.dataMap || {};
            dataMap = { ...noticeDataMap, ...dataMap};
            return {
                ...state,
                noticeDataMap: dataMap
            }
        }
        default:
            return state;
    }
};


//---------------------------------------------------------------------
const UPDATE_NOTICE_GENERATE_TIME= 'noticeGenerateTime/update';

//更新数据生成时间
const updateNoticeGenerateTime = time => ({
    type : UPDATE_NOTICE_GENERATE_TIME,
    time
});
const initNoticeGenerateTime = {
    time : '', // 通告信息数据生成时间
};

//通告信息数据生成时间数值
const noticeGenerateTime = (state = initNoticeGenerateTime, action) => {
    switch ( action.type ){
        case UPDATE_NOTICE_GENERATE_TIME: {
            const { time } = action;
            return{
                ...state,
                time: time
            }
        }
        default:
            return state;
    }
};

//---------------------------------------------------------------------
export {
    noticeDatas, updateNoticeDatas,
    noticeGenerateTime, updateNoticeGenerateTime,
};