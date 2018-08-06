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
const getSingleAirportUrl = `${host}/retrieveFlightDetailById.bo`;

const flowcontrolHost = "http://192.168.243.120:38181";
//获取全部流控信息
const getFlowcontrolUrl = `${flowcontrolHost}/flow/retrieveFlowcontrols.action`;
//依据机场获取流控点(受控点)数据
const getPointByAirportUrl = `${flowcontrolHost}/flowcontrolPoints/retrievePointsByAirport.action`
// 获取通告信息
const getNoticeUrl = `${host}/retrieveNoticeInformation.bo`;
// 获取除冰限制信息
const getRestrictionUrl = `${host}/retrieveRestriction.bo`;


export {
    host,
    loginUrl, logoutUrl,
    getSystemConfigUrl, getUserPropertyUrl,
    getAllAirportsUrl, getSingleAirportUrl,
    getFlowcontrolUrl, getNoticeUrl,
    getPointByAirportUrl, getRestrictionUrl
};