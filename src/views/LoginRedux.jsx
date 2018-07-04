//action-type
const UPDATE_USERINFO = 'loginUserInfo/update';
const UPDATE_SYSTEMCONFIG = 'systemConfig/update';

//action-creator
//存储用户信息（用户名  密码）
const updateUserInfo = userObj => ({
    type: UPDATE_USERINFO,
    userObj
})


//reducer user info
const obj = {
    username: '',
    loginStatus: false,
    userId :'',
    errmsg: '',
}
const loginUserInfo = ( state = obj, action ) => {
    switch( action.type ){
        case UPDATE_USERINFO:{
            return {
                ...state,
                username: action.userObj.username || '',
                password: action.userObj.password || '',
                loginStatus: action.userObj.loginStatus || '',
                userId : action.userObj.userId || '',
                errmsg: action.userObj.errmsg || '',
            }
        }
        default:
            return state;
    }
}


//存储系统参数配置
const updateSystemConfig = configObj => ({
    type: UPDATE_SYSTEMCONFIG,
    configObj
})

//reducer system config
const config = {
    system: '',
    systemAirport: '',
    systemElem: '',
    systemName: '',
}

const systemConfig = ( state = config, action ) => {
    switch( action.type ){
        case UPDATE_SYSTEMCONFIG:{
            return {
                ...state,
                system: action.configObj.system ||'',
                systemAirport: action.configObj.systemAirport ||'',
                systemElem: action.configObj.systemElem || '',
                systemName: action.configObj.systemName ||'',
            }
        }
        default:
            return state;
    }
}

export { updateUserInfo, loginUserInfo, updateSystemConfig, systemConfig }