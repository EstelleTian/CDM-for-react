const host = "http://192.168.243.187:28180";
// 用户登录
const loginUrl = `${host}/userLogon.bo`;
// 用户登出
const logoutUrl = `${host}/userLogout.bo`;
//获取系统参数
const getSystemConfigUrl = `${host}/retrieveSystemConfig.bo`;
//获取用户配置数据
const getUserPropertyUrl = `${host}/retrieveNeedBasicParam.bo`;
//获取全部航班数据
const getAllAirportsUrl = `${host}/retrieveAirportFlights.bo`;
//根据航班id获取单条航班数据
const getSingleAirportUrl = `${host}/retrieveDetailById.bo`;

const flowcontrolHost = "http://192.168.243.120:38181";
//获取全部流控信息
const getFlowcontrolUrl = `${flowcontrolHost}/flow/retrieveFlowcontrols.action`



export {
    host,
    loginUrl, logoutUrl,
    getSystemConfigUrl, getUserPropertyUrl,
    getAllAirportsUrl, getSingleAirportUrl,
    getFlowcontrolUrl
};