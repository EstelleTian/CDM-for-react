const host = "http://192.168.243.67:28180";
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
//航班查询
const getFlightDetailUrl = `${host}/retrieveFlightDetailByFlightId.bo`;
//根据航班id获取单条航班协调记录数据
const getSingleCollaborateRecordUrl = `${host}/retrieveRecordById.bo`;
//根据航班id获取前段航班信息
const getSingleFormerFlightUrl = `${host}/retrieveFormerFlightById.bo`;
//指定前序航班
const updateFormerFlightUrl = `${host}/updateFormerFlight.bo`;
//通过流控ID获取流控影响航班信息
const retrieveFlowcontrolImpactFlightsUrl = `${host}/retrieveFlowcontrolImpactFlights.bo`;

const flowcontrolHost = "http://192.168.243.120:38181";
//获取全部流控信息
const getFlowcontrolUrl = `${flowcontrolHost}/flow/retrieveFlowcontrols.action`;
// 根据流控ID获取流控信息
const getFlowcontrolByIdUrl = `${flowcontrolHost}/flow/retrieveFlowcontrolById.action`;
// 获取流控信息详情
const getFlowcontrolDetailUrl = `${flowcontrolHost}/flow/retrieveflowcontrolDetail.action`;
//依据用户名获取流控模板
const getFlowcontrolTemplateUrl = `${flowcontrolHost}/flowTemplate/retrieveByUsername`;

//依据机场获取流控点(受控点)数据
const getPointByAirportUrl = `${flowcontrolHost}/flowcontrolPoints/retrievePointsByAirport.action`;
// 发布流控
const publishFlowcontrolUrl = `${flowcontrolHost}/flow/publish.action`;
// 修改流控
const updateFlowcontrolUrl = `${flowcontrolHost}/flow/update.action`;
// 终止流控
const terminateFlowcontrolUrl = `${flowcontrolHost}/flow/terminate.action`;

//-----通告模块-------//
const noticeHost = "http://192.168.243.108:8098";
//发布通告信息
const publishNoticeUrl = `${noticeHost}/noticeInformation/publish`
// 获取通告信息
const getNoticeUrl = `${noticeHost}/noticeInformation/retrieveAll`;
// 通告详情
const getNoticeDetailUrl = `${noticeHost}/noticeInformation/retrieveById`;
//更新通告信息
const updateNoticeUrl = `${noticeHost}/noticeInformation/update`;
// 终止通告信息
const terminateNoticeUrl = `${noticeHost}/noticeInformation/terminate`;
// 阅读重要通告信息
const readSpecialNoticeUrl = `${noticeHost}/noticeInformation/readSpecialNotice`;
// 获取接受用户信息列表
const getUserBySystemUrl = `${noticeHost}/noticeInformation/retrieveUsersBySystem`;


// 获取限制信息
const getRestrictionUrl = `${host}/retrieveRestriction.bo`;
// 获取限制信息详情
const getRestrictionDetailUrl = `${host}/retrieveRestrictionById.bo`;


export {
    host,
    loginUrl, logoutUrl,
    getSystemConfigUrl, getUserPropertyUrl,
    getAllAirportsUrl, getSingleAirportUrl, getSingleCollaborateRecordUrl, getSingleFormerFlightUrl, updateFormerFlightUrl,getFlightDetailUrl,
    getFlowcontrolUrl, getNoticeUrl,terminateNoticeUrl,readSpecialNoticeUrl,getUserBySystemUrl,updateNoticeUrl,
    getPointByAirportUrl, getRestrictionUrl,
    publishFlowcontrolUrl, updateFlowcontrolUrl, getFlowcontrolTemplateUrl, getFlowcontrolByIdUrl,
    getFlowcontrolDetailUrl, terminateFlowcontrolUrl, retrieveFlowcontrolImpactFlightsUrl, getNoticeDetailUrl, getRestrictionDetailUrl,publishNoticeUrl
};