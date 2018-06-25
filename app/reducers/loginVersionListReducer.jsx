//角色列表相关reducers
//角色列表---角色数据 Map结构
const initList = {
    loading: true,
    data: []
}
const sortByVersion = (data) => {
    data = data.sort((a, b) => {
        var nameA = a.clientVersion;
        var nameB = b.clientVersion;
        if (nameA < nameB) {
            return 1;
        }else if (nameA > nameB) {
            return -1;
        }else{
            return 0;
        }
    })
    return data;
}
export const loginVersionList = (state = initList, action) => {
    switch (action.type){
        case "REFRESH_LOGIN_VERSION" : {
            const data = action.data;
            let res = {...state};
            if(undefined != data && data.constructor == Array){
                res = {
                    loading: action.loading,
                    data: data
                }
            }
            res.data = sortByVersion(res.data)
            return res;
        }
        case "UPDATE_LOGIN_VERSION" : {
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
                //添加
                if(!isUpdata){
                    sData.unshift(newDatas);
                }
            }
                sData = sortByVersion(sData);

            return {
                loading: false,
                data: sData
            }
        }
        case "DELETE_ONE_LOGIN_VERSION" : {
            let data = state.data || [];
            const delId = action.id || "";
            for(let n in data){
                if(data[n].id == delId){
                    //删除该id
                    data.splice(n,1);
                }
            }
            return  {
                loading: false,
                data: data
            }
        }
        default:
            return state;
    }
}

//登录控制版本添加、修改模块
let initModalData = {
    visible: false,
    isAdd: true,
    data: {},
    loginData: {}
}
export const loginVersionModal = (state = initModalData, action) => {
    switch (action.type){
        case "OPEN_LOGIN_VERSION_MODAL" : {
            const data = action.data || {};
            const loginData = action.loginData || {};
            //若data是空对象---添加模块
            if( Object.keys(data).length == 0 ){
                return {
                    visible: true,
                    isAdd: true,
                    data: {},
                    loginData
                }
            }else{//修改模块
                return {
                    isAdd: false,
                    visible: true,
                    data: action.data,
                    loginData
                }
            }
        }
        case "CLOSE_LOGIN_VERSION_MODAL" : {
            return {
                ...state,
                visible : false
            }
        }
        default :
            return state;
    }
}

//登录控制版本--自定义搜索--记录搜索值
export const loginVersionSearchValue = (state = "", action) => {
    switch (action.type){
        case "UPDATE_LOGIN_VERSION_SEARCH": {
            return action.value;
        }
        default: return state;
    }
}
