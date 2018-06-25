// import path from 'path';

//测试地址
// const host = "http://172.25.142.67:8080/uuma-server"
// const host = "http://192.168.208.22:8080/uuma-server"
// const host = "http://192.168.208.21:8081/uuma-server"
const host = "http://192.168.217.233:18380/uuma-server"
// const host = "/uuma-server"
//新疆生产地址
// const host = "http://10.27.10.16:18080/uuma-server"
//西南生产地址
// const host = "http://175.17.200.52:18080/uuma-server"
//登录
export const loginUrl = `${host}/uuma/login`
//登出
export const logoutUrl = `${host}/uuma/logout`
//定时刷新用户信息
export const getUserInfoUrl = `${host}/uuma/user`
//在线用户 获取在线用户列表
export const getOnlineUserListUrl = `${host}/online/list`
//在线用户 删除
export const sendLogoutUrl = `${host}/online/del`
//在线用户 根据token获取在线用户详情
export const getOnlineUserByTokenUrl = `${host}/online/user-bytoken`
//在线用户 多条件查询
export const sendMultiFiltersUrl = `${host}/online/filtered-list`
// 检测在线用户
export const violationClientUrl = `${host}/online/violation-client`
//查询所有角色
export const getRolesListUrl = `${host}/roles/list`
//查询所有权限
export const getAuthoritiesListUrl = `${host}/authorities/list`
//查询所有组
export const getGroupsListUrl = `${host}/groups/list`
//查询所有用户
export const getUsersListUrl = `${host}/users/list`
//添加/修改组
export const updateGroupstUrl = `${host}/groups`
//添加/修改权限
export const updateAuthoritiesUrl = `${host}/authorities`
//添加/修改角色
export const updateRolesUrl = `${host}/roles`
//添加/修改用户
export const updateUsesrUrl = `${host}/users`

//删除组
export const deleteGroupstUrl = `${host}/groups/`
//删除权限
export const deleteAuthoritiesUrl = `${host}/authorities/`
//删除角色
export const deleteRolesUrl = `${host}/roles/`
//删除用户
export const deleteUsesrUrl = `${host}/users/`

// 查询所有登录控制类型
export const getAllLoginCategoryUrl = `${host}/loginCategory/list`
// 查询一个登录控制类型
export const getSingleLoginCategoryUrl = `${host}/loginCategory`
// 修改登录控制类型
export const updateLoginCategoryUrl = `${host}/loginCategory`

// 查询一个登录控制版本
export const getSingleLoginVersionUrl = `${host}/loginVersion/`
// 通过登录控制类型id查询登录控制版本
// export const getLoginVersionByCategoryIdUrl = `${host}/loginVersion/loginTypeId/`
// 通过登录控制类型id查询登录控制版本－－测试用
export const getLoginVersionByCategoryIdUrl = `${host}/loginVersion/loginTypeId/`
// 修改登录控制版本
export const updateLoginVersionUrl = `${host}/loginVersion`
// 保存登录控制版本
export const saveLoginVersionByCategoryIdUrl = `${host}/loginVersion`
// 删除登录控制版本
export const deleteLoginVersionUrl = `${host}/loginVersion/`


export const parseHalfFullTime = ( str ) => {
    let newStr = "";
    if(str.length == 14 && str*1 > 0 ){
        let month = str.substring(4, 6);
        let day = str.substring(6, 8);
        let hour = str.substring(8, 10);
        let mins = str.substring(10, 12);
        newStr = month + "-" + day + " " + hour + ":" + mins;
    }else if(str.indexOf("-")>-1 && str.indexOf(":")>-1){
        newStr = str;
    }
    return newStr;
}

export const parseFullTime = ( str ) => {
    let newStr = "";
    if(str.length == 14 && str*1 > 0 ){
        let year = str.substring(0, 4);
        let month = str.substring(4, 6);
        let day = str.substring(6, 8);
        let hour = str.substring(8, 10);
        let mins = str.substring(10, 12);
        let secs = str.substring(12, 14);
        newStr = year + "-" + month + "-" + day + " " + hour + ":" + mins + ":" + secs;
    }else if(str.indexOf("-")>-1 && str.indexOf(":")>-1){
        newStr = str;
    }
    return newStr;
}