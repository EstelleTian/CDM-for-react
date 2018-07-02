const host = "http://192.168.243.120:8081/cdm-analysis";

//获取全部航班数据
// const getAllAirportsUrl = `${host}/retrieveFlights/ZUUU/201806220900/201806222300.action`;
const getAllAirportsUrl = `${host}/retrieveFlights/ZUUU/201807020800/2018007021200.action`;
// const getAllAirportsUrl = `http://192.168.217.233:28180/CDMDATA/Flights/ZUUU?start=201806281400&end=201806281500`;

//获取用户配置数据
const getUserPropertyUrl = `${host}/retrieve_user_property.action`;

export { getAllAirportsUrl, getUserPropertyUrl };