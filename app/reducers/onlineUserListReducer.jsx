//在线用户--在线用户模块数据记录
const sortByFinalRefreshTime = (data) => {
    data = data.sort((a, b) => {
        var timeA = a.finalRefreshTime * 1;
        var timeB = b.finalRefreshTime * 1;
        if (timeA < timeB) {
            return 1;
        }else if (timeA > timeB) {
            return -1;
        }else{
            return 0;
        }
    })
    return data;
}
export const onlineUserList = ( state = [], action) => {
    switch (action.type){
        //退出
        case "FORCELOGOUT" :{
            let list = [];
            for(let index in state){
                let userObj = state[index];
                if( action.token.indexOf(userObj.token) == -1){
                    list.push(userObj);
                }
            }
            return list;
        }
        //更新
        case "UPDATE_USERLIST" : {
            //isUpdateActived为false则不更新active状态，checkbox状态更新全部为false
            let aTokens = [];
            if(!action.isUpdateActived){
                //取出是active的token集合
                for(let index in state){
                    let userObj = state[index];
                    if(userObj.isActived){
                        aTokens.push(userObj.token);
                    }
                }
            }

            let userList = action.userList;
            for(let index in userList){
                let userObj = userList[index];
                userObj['online'] = true;
                if(aTokens.indexOf(userObj.token)>-1){
                    userObj['isActived'] = true;
                }else{
                    userObj['isActived'] = false;
                }
            }
            userList = sortByFinalRefreshTime(userList);
            return userList;

        }
        //多选选择切换
        case "SELECTED_USER" : {
            let list = [];
            for(let index in state){
                let userObj = state[index];
                if(userObj.token == action.token){
                    userObj.isActived = !userObj.isActived;
                }
                list.push(userObj);
            }
            return list;
        }
        //重置
        case "RESET_STATUS" : {
            let newUserList = [];
            state.map( user => {
                user['online'] = true;
                user['isActived'] = false;
                newUserList.push(user);
            })
            return newUserList;
        }
        default:
            return state
    }
}
//在线用户--侧边栏--记录侧边栏显隐和详情数据
const initInfo = {
    visible: false,
    userObj: {
        token: ""
    }
};
export const sliderBar = (state = initInfo, action) => {
    switch (action.type){
        case "TOGGLE_SLIDER" : {
            //如果选中token一样，切换显隐
            if(action.userObj.token == state.userObj.token){
                return {
                    visible: !state.visible,
                    userObj: state.userObj
                }
            }else{//如果选中token不一样，显示，修改userObj
                return {
                    visible: true,
                    userObj : action.userObj
                }
            }
        }
        case "CLOSE_SLIDER" : {
            return {
                visible: false,
                userObj: state.userObj
            }
        }
        default : return state
    }
}

//在线用户--自定义查询--记录查询数据
export const filterKey = ( state = "all", action) =>{
    switch (action.type){
        case "FILTER_LIST":
            return action.text || 'all';
        default :
            return state;
    }
}
//在线用户--多条件查询--记录查询数据
const init = {
    username: "",
    clientVersion: "",
    ipAddress: "",
    startTime: "",
    endTime: ""
}
export const multiFilterKey = (state = init, action) => {
    switch (action.type){
        case "UPDATE_MULTI_FILTER" : {
            if(Object.keys(action.result).length == 0){
                return {
                    ...init
                }
            }else{
                return {
                    ...action.result
                }
            }
        }
        default : return state
    }
}
//在线用户--多条件查询查询框显隐
export const filterPopover = (state = false, action) => {
    switch (action.type){
        case "TOGGLE_FILTER_POPOVER":
            return !state;
        case "CLOSE_FILTER_POPOVER" :
            return false;
        default :
            return state;
    }
}