// const host = "http://192.168.243.120:8081/cdm-analysis";
const host = "http://192.168.243.187:8081/airportcdm_facade";

//获取全部航班数据
const getAllAirportsUrl = `${host}/retrieveAirportFlights.bo`;

//获取用户配置数据
const getUserPropertyUrl = `${host}/retrieveNeedBasicParam.bo`;

export { getAllAirportsUrl, getUserPropertyUrl };