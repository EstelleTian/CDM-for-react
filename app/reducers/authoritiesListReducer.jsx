//权限列表相关reducers
//权限列表---权限数据 Map结构
const initList = {
    loading: true,
    data: []
}
const sortByCode = (data) => {
    data = data.sort((a1, a2) => {
        return (a1.code*1) - (a2.code*1)
    })
    return data;
}
export const authoritiesList = (state = initList, action) => {
    switch (action.type){
        case "REFRESH_AUTHS" : {
            const data = action.data;
            if(undefined == data){
                return state;
            }else if( data.constructor == Array ){
                return {
                    loading: action.loading,
                    data: sortByCode(action.data)
                }
            }
            return state;
        }
        case "UPDATE_AUTHS" : {
            let sData = state.data;
            let newDatas = action.dataObj || {};
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
                sData = sortByCode(sData);
                //添加
                if(!isUpdata){
                    sData.unshift(newDatas);
                }
            }else{
                sData = sortByCode(sData);
            }
            return {
                loading: false,
                data: sData
            }
        }
        case "DELETE_ONE_AUTH" : {
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

//权限添加、修改模块
let initModalData = {
    visible: false,
    isAdd: true,
    data: {}
}
export const authoritiesModal = (state = initModalData, action) => {
    switch (action.type){
        case "OPEN_AUTH_MODAL" : {
            const data = action.data || {};
            //若data是空对象---添加模块
            if( Object.keys(data).length == 0 ){
                return {
                    visible: true,
                    isAdd: true,
                    data: {}
                }
            }else{//修改模块
                return {
                    isAdd: false,
                    visible : true,
                    data: action.data
                }
            }
        }
        case "CLOSE_AUTH_MODAL" : {
            return {
                ...state,
                visible : false
            }
        }
        default :
            return state;
    }
}

//权限--自定义搜索--记录搜索值
export const authSearchValue = (state = "", action) => {
    switch (action.type){
        case "UPDATE_AUTH_SEARCH": {
            return action.value+"";
        }
        default: return state;
    }
}