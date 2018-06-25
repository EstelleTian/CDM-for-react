//用户登录
export const userLogin = param => ({
    type: 'USER_LOGIN',
    ...param
})
//用户权限更新
export const updateUserAuths = param => ({
    type: 'UPDATE_USER_AUTHS',
    ...param
})
//---------------------在线用户---------------------------------
//在线用户列表--退出
export const forceLogout = token => ({
    type: 'FORCELOGOUT',
    token,
})
//在线用户列表--更新
export const updateOnlineUserList = (userList, isUpdateActived) => ({
    type: "UPDATE_USERLIST",
    userList,
    isUpdateActived
})
//在线用户--根据token查询
export const selectedUser = token => ({
    type: "SELECTED_USER",
    token
})
//在线用户--自定义查询过滤
export const filterList = text => ({
    type: "FILTER_LIST",
    text
})
//在线用户--侧边栏切换
export const toggleSlider = userObj => ({
    type: "TOGGLE_SLIDER",
    userObj
})
//在线用户--多条件查询
export const updateMultiFilter = obj => ({
    type: "UPDATE_MULTI_FILTER",
    result: obj
})
export const toggleFilterPopover = () => ({
    type: "TOGGLE_FILTER_POPOVER"
})

export const closeFilterPopover = () => ({
    type: "CLOSE_FILTER_POPOVER"
})
//在线用户--关闭侧边栏
export const closeSlider = () => ({
    type: "CLOSE_SLIDER"
})
//------------------------角色-------------------------------
//角色--模态框切换--显示模态框--修改传选中角色对象，添加传{}
export const openRoleModal = data => ({
    type: "OPEN_ROLE_MODAL",
    data
})
//角色--模态框切换--隐藏模态框
export const closeRoleModal = () => ({
    type: "CLOSE_ROLE_MODAL"
})
//角色--更新全部角色数据
export const refreshRoles = params => ({
    type: "REFRESH_ROLES",
    ...params
})
//角色--更新角色(一条)
export const updateRoles = dataObj => ({
    type: "UPDATE_ROLES",
    dataObj
})
//角色--删除一个角色
export const delOneRole = id => ({
    type: "DELETE_ONE_ROLE",
    id
})
//角色--添加修改选择权限checkbox状态维护，id为选择的权限id
export const chooseAuthCheckbox = id => ({
    type: "CHOOSE_AUTH_CHECKBOX",
    id
})
//角色--记录默认值
export const setDefaultData = str => ({
    type: "SET_DEFAULT_DATA",
    defaultStr: str
})
//角色--添加修改选择权限checkbox状态维护，id为选择的权限id
export const resetChooseData = () => ({
    type: "RESET_CHOOSE_DATA"
})
//角色--自定义搜索
export const updateRoleSearch = value => ({
    type: "UPDATE_ROLE_SEARCH",
    value
})
//----------------------权限--------------------------------
//权限--模态框切换--显示模态框--修改传选中权限对象，添加传{}
export const openAuthModal = data => ({
    type: "OPEN_AUTH_MODAL",
    data
})
//权限--模态框切换--隐藏模态框
export const closeAuthModal = () => ({
    type: "CLOSE_AUTH_MODAL"
})
//权限--更新全部权限数据
export const refreshAuths = params => ({
    type: "REFRESH_AUTHS",
    ...params
})
//权限--更新权限(一条)
export const updateAuths = dataObj => ({
    type: "UPDATE_AUTHS",
    dataObj
})
//权限--删除一个权限
export const delOneAuth = id => ({
    type: "DELETE_ONE_AUTH",
    id
})
//权限--自定义搜索
export const updateAuthSearch = value => ({
    type: "UPDATE_AUTH_SEARCH",
    value
})
//----------------------组--------------------------------
//组--模态框切换--显示模态框--修改传选中组对象，添加传{}
export const openGroupModal = data => ({
    type: "OPEN_GROUP_MODAL",
    data
})
//组--模态框切换--隐藏模态框
export const closeGroupModal = () => ({
    type: "CLOSE_GROUP_MODAL"
})
//组--更新全部组数据
export const refreshGroups = params => ({
    type: "REFRESH_GROUPS",
    ...params
})
//组--更新组(一条)
export const updateGroups = dataObj => ({
    type: "UPDATE_GROUPS",
    dataObj
})
//组--删除一个组
export const delOneGroup = id => ({
    type: "DELETE_ONE_GROUP",
    id
})
//组--自定义搜索
export const updateGroupSearch = value => ({
    type: "UPDATE_GROUP_SEARCH",
    value
})
//----------------------用户--------------------------------
//用户--模态框切换--显示模态框--修改传选中用户对象，添加传{}
export const openUserModal = data => ({
    type: "OPEN_USER_MODAL",
    data
})
//用户--模态框切换--隐藏模态框
export const closeUserModal = () => ({
    type: "CLOSE_USER_MODAL"
})
//用户--更新全部用户数据
export const refreshUsers = params => ({
    type: "REFRESH_USERS",
    ...params
})
//用户--更新用户(一条)
export const updateUsers = dataObj => ({
    type: "UPDATE_USERS",
    dataObj
})
//用户--删除一个用户
export const delOneUser = id => ({
    type: "DELETE_ONE_USER",
    id
})

//用户--添加修改选择角色checkbox状态维护，id为选择的角色id
export const chooseRoleCheckbox = id => ({
    type: "CHOOSE_ROLE_CHECKBOX",
    id
})
//用户--记录角色默认值
export const setRoleDefaultData = str => ({
    type: "SET_ROLE_DEFAULT_DATA",
    defaultStr: str
})
//用户--添加修改选择角色checkbox状态维护，id为选择的角色id
export const resetRoleChooseData = () => ({
    type: "RESET_ROLE_CHOOSE_DATA"
})

//用户--添加修改选择角色checkbox状态维护，id为选择的角色id
export const chooseGroupCheckbox = id => ({
    type: "CHOOSE_GROUP_CHECKBOX",
    id
})
//用户--记录角色默认值
export const setGroupDefaultData = str => ({
    type: "SET_GROUP_DEFAULT_DATA",
    defaultStr: str
})
//用户--添加修改选择角色checkbox状态维护，id为选择的角色id
export const resetGroupChooseData = () => ({
    type: "RESET_GROUP_CHOOSE_DATA"
})
//用户--自定义搜索
export const updateUserSearch = value => ({
    type: "UPDATE_USER_SEARCH",
    value
})
//按钮loading--按钮loading显隐切换
export const showBtnLoading = obj => ({
    type: "SHOW_BTN_LOADING",
    ...obj
})

//登录控制--更新所有登录控制类型
export const refreshLoginCategory = params => ({
    type: "REFRESH_LOGIN_CATEGORY",
    ...params
})

//登录控制类型--自定义搜索
export const updateLoginCategorySearch = value => ({
    type: "UPDATE_LOGIN_CATEGORY_SEARCH",
    value
})

//登录控制类型－－修改
export const updateLoginCategory = value => ({
    type: "UPDATE_LOGIN_CATEGORY",
    value
})

//登录控制类型--模态框切换--显示模态框--修改、查看传选中用户对象，添加传{}
export const openLoginCategoryModal = ( optType, data ) => ({
    type: "OPEN_LOGIN_CATEGORY_MODAL",
    optType,
    data
})
//登录控制类型--模态框切换--隐藏模态框
export const closeLoginCategoryModal = () => ({
    type: "CLOSE_LOGIN_CATEGORY_MODAL"
})


//登录控制版本--通过登录控制类型id查询登录控制版本
export const refreshLoginVersion = params => ({
    type: "REFRESH_LOGIN_VERSION",
    ...params
})

//登录控制版本--添加、修改
export const updateLoginVersion = value => ({
    type: "UPDATE_LOGIN_VERSION",
    value
})

//登录控制版本--删除一个登录控制版本
export const delOneLoginVersion = id => ({
    type: "DELETE_ONE_LOGIN_VERSION",
    id
})

//登录控制版本--自定义搜索
export const updateLoginVersionSearch = value => ({
    type: "UPDATE_LOGIN_VERSION_SEARCH",
    value
})

//登录控制版本--模态框切换--显示模态框--修改传选中用户对象，添加传{}
export const openLoginVersionModal = ( data, loginData ) => ({
    type: "OPEN_LOGIN_VERSION_MODAL",
    data,
    loginData
})

//登录控制版本--模态框切换--隐藏模态框
export const closeLoginVersionModal = () => ({
    type: "CLOSE_LOGIN_VERSION_MODAL"
})

