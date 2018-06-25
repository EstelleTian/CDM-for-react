//角色列表相关reducers
//角色列表---角色数据 Map结构
const initList = {
    loading: true,
    data: []
}
const sortByName = (data) => {
    data = data.sort((a, b) => {
        var nameA = a.categoryCode.toUpperCase();
        var nameB = b.categoryCode.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }else if (nameA > nameB) {
            return 1;
        }else{
            return 0;
        }
    })
    return data;
}
export const loginCategoryList = (state = initList, action) => {
    switch (action.type){
        case "REFRESH_LOGIN_CATEGORY" : {
            const data = action.data;
            let res = {...state};
            if(undefined != data && data.constructor == Array){
                res = {
                    loading: action.loading,
                    data: data
                }
            }
            res.data = sortByName(res.data)
            return res;
        }
        case "UPDATE_LOGIN_CATEGORY" : {
            let sData = state.data;
            let newDatas = action.value || {};
            //数据id
            const newId = newDatas.id || "";
            if( "" != newId ){
                let isUpdata = false;
                //遍历组，补充key和操作列
                for(let index in sData){
                    if(sData[index].id == newId){
                        isUpdata = true;
                        //做修改，替换数据
                        sData.splice(index, 1, newDatas);
                        break;
                    }
                }
                sData = sortByName(sData);
                //添加
                if(!isUpdata){
                    sData.unshift(newDatas);
                }
            }else{
                sData = sortByName(sData);
            }
            return {
                loading: false,
                data: sData
            }
        }
        default:
            return state;
    }
}

//登录控制类型添加、修改模块
let initModalData = {
    visible: false,
    isAdd: true,
    optType: '',
    data: {}
}
export const loginCategoryModal = (state = initModalData, action) => {
    switch (action.type){
        case "OPEN_LOGIN_CATEGORY_MODAL" : {
            const data = action.data || {};
            const optType = action.optType || '';
            //若data是空对象---添加模块
            if( Object.keys(data).length == 0 ){
                return {
                    visible: true,
                    isAdd: true,
                    optType,
                    data: {}
                }
            }else{//修改模块
                return {
                    isAdd: false,
                    visible : true,
                    optType,
                    data
                }
            }
        }
        case "CLOSE_LOGIN_CATEGORY_MODAL" : {
            return {
                ...state,
                visible : false,
            }
        }
        default :
            return state;
    }
}

//登录控制类型--自定义搜索--记录搜索值
export const loginCategorySearchValue = (state = "", action) => {
    switch (action.type){
        case "UPDATE_LOGIN_CATEGORY_SEARCH": {
            return action.value;
        }
        default: return state;
    }
}
