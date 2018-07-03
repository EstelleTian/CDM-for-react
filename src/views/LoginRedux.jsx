//action-type
const UPDATE_USERINFO = 'loginUserInfo/update';

//action-creator
//存储用户信息（用户名  密码）
const updateUserInfo = userObj => ({
    type: UPDATE_USERINFO,
    userObj
})


//reducer user info
const obj = {
    username: '',
    password: '',
    loginStatus: false,
    userid :'',
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
                userid : action.userObj.userid || '',
                errmsg: action.userObj.errmsg || '',
            }
        }
        default:
            return state;
    }
}

export { updateUserInfo, loginUserInfo }