//登录--记录登录名、密码、登录状态、提示错误
const intiLoginState = {
    username: "",
    password: "",
    optsAuths: "",
    loginStatus: false,
    user : {},
    errmsg: ""
};
export const login = ( state = intiLoginState, action ) => {
    switch( action.type ){
        case "USER_LOGIN" : {
            if( action.loginStatus ){
                return {
                    username: action.username || "",
                    password: action.password || "",
                    optsAuths: action.optsAuths || "",
                    loginStatus: action.loginStatus || false,
                    user : action.user || {},
                    errmsg: action.errmsg || ""
                }
            }else{
                return {
                    ...intiLoginState,
                    errmsg: action.errmsg
                }
            }
        }
        case "UPDATE_USER_AUTHS" : {
            return {
                    username: action.username || "",
                    password: action.password || "",
                    optsAuths: action.optsAuths || "",
                    loginStatus: action.loginStatus || false,
                    user : action.user || {},
                    errmsg: action.errmsg || ""
                }

        }
        default:
            return state
    }

}