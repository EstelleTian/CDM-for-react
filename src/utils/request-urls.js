
const host = "http://192.168.243.187:8081/airportcdm_facade";

//获取全部航班数据
const getAllAirportsUrl = `${host}/retrieveAirportFlights.bo`;

//获取用户配置数据
const getUserPropertyUrl = `${host}/retrieveNeedBasicParam.bo`;


//获取系统参数
const getSystemConfigUrl = `${host}/retrieveSystemConfig.bo`;



// 用户登录
const loginUrl = `${host}/userLogon.bo`;

export {getSystemConfigUrl, getAllAirportsUrl, getUserPropertyUrl, loginUrl };