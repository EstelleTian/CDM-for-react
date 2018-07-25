
const host = "http://192.168.243.187:28180";

//获取全部航班数据
const getAllAirportsUrl = `${host}/retrieveAirportFlights.bo`;

//获取用户配置数据
const getUserPropertyUrl = `${host}/retrieveNeedBasicParam.bo`;


//获取系统参数
const getSystemConfigUrl = `${host}/retrieveSystemConfig.bo`;

//获取流控信息
const getFlowcontrolUrl = `http://192.168.243.120:38181/flow/retrieveFlowcontrols.action`

// 用户登录
const loginUrl = `${host}/userLogon.bo`;
// 用户登出
const logoutUrl = `${host}/userLogout.bo`;



export {getSystemConfigUrl, getAllAirportsUrl, getUserPropertyUrl, loginUrl, getFlowcontrolUrl, logoutUrl };