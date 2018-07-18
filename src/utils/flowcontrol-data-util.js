/**
 * 流控数据转换工具
 */

import { isValidVariable, isValidObject, addStringTime } from './basic-verify';
/**
 * Flowcontrol对象常量
 */
const FlowcontroConstant = {

    FLOWCONTROL_TYPE_LONG: 0, // 跨日流控
    FLOWCONTROL_TYPE_NORMAL: 1, // 常规流控

    COMPOSITE_VALUE: 100, // 复合流控
    FLOWCONTROL_STATUS_PUBLISH: 'PUBLISH',
    FLOWCONTROL_STATUS_FUTURE: 'FUTURE',
    FLOWCONTROL_STATUS_RUNNING: 'RUNNING',
    FLOWCONTROL_STATUS_STOP: 'STOP',
    FLOWCONTROL_STATUS_FINISHED: 'FINISHED',
    FLOWCONTROL_STATUS_DISCARD: 'DISCARD', // 已废弃
    FLOWCONTROL_STATUS_PRE_UPDATE: 'PRE_UPDATE', // 预更新状态
    FLOWCONTROL_STATUS_PRE_PUBLISH: 'PRE_PUBLISH', // 预发布状态
    FLOWCONTROL_STATUS_PRE_TERMINATED: 'PRE_TERMINATED', // 预终止状态
    FLOWCONTROL_STATUS_PREVIEW: 'PREVIEW', // 流控预演

    FLOWCONTROL_STATUS_TERMINATED: 'TERMINATED',
    FLOWCONTROL_STATUS_DELAY_TERMINATED: 'DELAY_TERNINATED',

    PLACE_TYPE_AP: 'AP', // 机场
    PLACE_TYPE_POINT: 'POINT', // 航路

    TYPE_MIT: 'MIT', // 距离
    TYPE_TIME: 'TIME', // 时间
    TYPE_GS: 'GS', // 地面停止
    TYPE_REQ: 'REQ', // 开车申请
    TYPE_ASSIGN: 'ASSIGN', // 指定时隙
    TYPE_RESERVE: 'RESERVE',//预留时隙
    TYPE_LDR: 'LDR', // 大规模延误
    TYPE_TRANSLATION: 'TRANSLATION', // 成都版大规模延误

    //==========================================================
    REASON_ACC:'ACC',//空管
    REASON_WEATHER:'WEATHER',//天气
    REASON_AIRPORT:'AIRPORT',//机场
    REASON_CONTROL:'CONTROL',//航班时刻
    REASON_EQUIPMENT:'EQUIPMENT',//设备
    REASON_MILITARY:'MILITARY',//其他空域用户
    REASON_OTHERS:'OTHERS',//其他

//=============================================================================

    DOUBLEHEB_VALUE: "100", // doubleHEB唯一标识

    FLOW_TYPE_ARR: "ARR", //流控类型 降落流控
    FLOW_TYPE_DEP: "DEP", //流控类型 起飞流控

    COMPRESS_TYPE_ON: 'ON',
    COMPRESS_TYPE_OFF: 'OFF',

};

// 流控数据转换
const convertFlowcontrolData =(data, generateTime) => {
    // 校验数据
    if(!isValidObject(data)){
        return {};
    }

    // 原因转换
    const setReason =(data) => {
        // 原因
        let { reason } = data;
        // 转换后的结果
        let res = '';
        switch (reason) {
            case FlowcontroConstant.REASON_WEATHER:
                res = '天气';
                break;
            case FlowcontroConstant.REASON_MILITARY:
                res = '其他空域用户';//军方
                break;
            case FlowcontroConstant.REASON_CONTROL:
                res = '航班时刻';//流量
                break;
            case FlowcontroConstant.REASON_EQUIPMENT:
                res = '设备';
                break;
            case FlowcontroConstant.REASON_ACC:
                res = '空管';
                break;
            case FlowcontroConstant.REASON_AIRPORT:
                res = '机场';
                break;
            case FlowcontroConstant.REASON_OTHERS:
                res = '其他';
                break;
            default:
                res = reason;
                break;
        }
        return res;
    };

    // 流控类型转换
    const setPlaceType =(data) => {
        // 流控类型
        let { placeType } = data;
        // 转换后的结果
        let res = '';
        switch (placeType) {
            case FlowcontroConstant.PLACE_TYPE_AP:
                res = '机场';
                break;
            case FlowcontroConstant.PLACE_TYPE_POINT:
                res = '航路';
                break;
            default:
                res = '';
                break;
        }
        return res;
    };
    // 流控限制类型转换
    const setType =(data) => {
        // 流控限制类型
        let { type, typeSubclass } = data;
        // 转换后的结果
        let res = '';

        if(type == FlowcontroConstant.TYPE_MIT){
            res = '限制距离';
        }else if(type == FlowcontroConstant.TYPE_TIME){
            res = '限制时间';
        }else if(type == FlowcontroConstant.TYPE_GS){
            res = '地面停止';
            if(typeSubclass == "GS_DEP"){
                res = '低能见度';
            }
        }else if(type == FlowcontroConstant.TYPE_REQ){
            res = '开车申请';
        }else if(type == FlowcontroConstant.TYPE_ASSIGN){
            res = '指定时隙';
        }else if(type == FlowcontroConstant.TYPE_RESERVE){
            res = '预留时隙';
        }else if(type == FlowcontroConstant.TYPE_LDR){
            res = '大规模延误恢复';
        }else if(type == FlowcontroConstant.TYPE_TRANSLATION){
            res = '大规模延误恢复';
        }
        return res;
    };

    /**
     * 流控开始时间
     * @param data 数据对象
     * @param generateTime 数据生成时间
     *
     * */
    const setDataTime= (data, generateTime) => {
        debugger
        // 流控
        let { status,  startTime = "", endTime = "",  placeType, relativeStartTime, relativeStatus } = data;


        // 转换后的结果
        let res = {};
        let sTime = '';
        let eTime = '';
        let startDate = '';
        let endDate = '';


        // 相对状态时间
        if(placeType == 'POINT' && relativeStatus != status) {

            if(isValidVariable(relativeStartTime) && startTime != relativeStartTime){
                sTime = `(${formatTime4(relativeStartTime)})`;
                startDate = formatDate(relativeStartTime);
            }

            if(isValidVariable(relativeEndTime) && endTime != relativeEndTime){
                eTime = `(${formatTime4(relativeEndTime)})`;
                endDate = formatDate(relativeEndTime);
            }

        }else {
            sTime = formatTime4(startTime);
            startDate = formatDate(startTime);
            eTime = formatTime4(endTime);
            endDate = formatDate(endTime);
        }

        res = {
            startTime : sTime,
            endTime : eTime,
            startDate : startDate,
            endDate :  endDate
        }

        return res;
    };


    // 时间格式化 hh:mm
    const formatTime4 = (time) => {
        let result = '';
        if(time && 12 == time.length){
            const hh = time.substring(8,10);
            const mm = time.substring(10,12);
            result = `${hh}:${mm}`;
        }
        return result;
    }
    // 日期格式化 yy-mm-dd
    const formatDate = (datetime) => {
        let result = '';
        if(datetime && 12 == datetime.length){
            const yy = datetime.substring(0,4);
            const mm = datetime.substring(4,6);
            const dd = datetime.substring(6,8);
            result = `${yy}-${mm}-${dd}`;
        }
        return result;
    }


    /**
     * 流控状态
     * @param data 数据对象
     * @param generateTime 数据生成时间
     *
     * */
    const setStatus= (data, generateTime) => {
        // 流控
        let { status, type, startTime = "", endTime = "", value, placeType, relativeStartTime, relativeStatus } = data;


        // 转换后的结果
        let res = '';
        if (status == FlowcontroConstant.FLOWCONTROL_STATUS_PRE_PUBLISH) {
            res = '将要发布';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_FUTURE
            || status == FlowcontroConstant.FLOWCONTROL_STATUS_PUBLISH) {
            res = '将要执行';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_RUNNING) {
            res = '正在执行';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_STOP) {
            res = '系统终止';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_TERMINATED) {
            res = '人工终止';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_PRE_TERMINATED
            || status == FlowcontroConstant.FLOWCONTROL_STATUS_PRE_UPDATE
        ) {
            res = '将要终止';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_DISCARD) {
            res = '已废弃';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_FINISHED) {
            res = '正常结束';
            if(type == FlowcontroConstant.TYPE_TRANSLATION && isValidVariable(endTime)){ // 成都版大规模延误
                // 求得终止时间
                let tempEndTime = addStringTime(endTime, value *60 * 60 * 1000 );
                if(tempEndTime*1 > generateTime*1){ // 若数据生成时间早于终止时间,则显示"恢复中"
                    res = '恢复中';
                }
            }
        } else if( !endTime){
            res = '已取消';
        }
        // 相对状态
        if(placeType == 'POINT'
            && isValidVariable(relativeStartTime)
            && startTime != relativeStartTime
            && relativeStatus != status
        ){
            if(relativeStatus == FlowcontroConstant.FLOWCONTROL_STATUS_RUNNING){
                res = '(正在执行)'
            }else if(relativeStatus == FlowcontroConstant.FLOWCONTROL_STATUS_FINISHED){
                res = '(正常结束)'
            }
        }
        return res;
    };

    /**
     * 流控计算状态
     * @param data 数据对象
     *
     * */
    const setCasaStatus= (data, generateTime) => {
        // 流控
        let { status, type, endTime = "", value, previewId, startFlowCasaTime } = data;


        // 转换后的结果
        let res = '';
        // 预演流控发布正式流控 默认显已计算
        if(isValidVariable(previewId) && !isValidVariable(startFlowCasaTime)){
            res = '已计算';
        }

        if(status == FlowcontroConstant.FLOWCONTROL_STATUS_FUTURE
            || status == FlowcontroConstant.FLOWCONTROL_STATUS_PUBLISH
            || status == FlowcontroConstant.FLOWCONTROL_STATUS_RUNNING ){
            if(isValidVariable(startFlowCasaTime)){
                res = '已计算';
            }else {
                res = '计算中';
            }
        }

        if(type == FlowcontroConstant.TYPE_TRANSLATION && isValidVariable(endTime)){ // 成都版大规模延误
            // 求得终止时间
            let tempEndTime = addStringTime(endTime, value *60 * 60 * 1000 );
            if(tempEndTime*1 > generateTime*1 && status == FlowcontroConstant.FLOWCONTROL_STATUS_FINISHED){ // 若数据生成时间早于终止时间,
                if(isValidVariable(startFlowCasaTime)){
                    res = '已计算';
                }else {
                    res = '计算中';
                }
            }
        }

        return res;
    };

    /**
     * 流控状态对应的class名称
     * @param data 数据对象
     *
     * */
    const setstatusClassName= (data, generateTime) => {
        // 流控
        let { status, type, endTime, value} = data;

        // 转换后的结果
        let res = '';
        if (status == FlowcontroConstant.FLOWCONTROL_STATUS_PRE_PUBLISH) { // 将要发布
            res = 'running';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_FUTURE
            || status == FlowcontroConstant.FLOWCONTROL_STATUS_PUBLISH) { // 将要执行
            res = 'future';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_RUNNING) { // 正在执行
            res = 'running';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_STOP) { // 系统终止
            res = 'terminated';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_TERMINATED) { // 人工终止
            res = 'terminated';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_PRE_TERMINATED
            || status == FlowcontroConstant.FLOWCONTROL_STATUS_PRE_UPDATE
        ) { // 将要终止
            res = 'terminated';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_DISCARD) { // 已废弃
            res = 'cancel';
        } else if (status == FlowcontroConstant.FLOWCONTROL_STATUS_FINISHED) { // 正常结束
            res = 'finished';
            if(type == FlowcontroConstant.TYPE_TRANSLATION && isValidVariable(endTime)){ // 成都版大规模延误
                // 求得终止时间
                let tempEndTime = addStringTime(endTime, value *60 * 60 * 1000 );
                if(tempEndTime*1 > generateTime *1 ){  // 恢复中
                    res = 'finished';
                }
            }
        } else if( !endTime){ // 已取消
            res = 'cancel';
        }
        return res;
    };


    /**
     * 流控限制数值
     * @param data 数据对象
     * @
     *
     * */
    const setValue= (data) => {
        // 流控
        let { type, value, assignSlot } = data;

        // 转换后的结果
        let res = '';
        if (type == FlowcontroConstant.TYPE_MIT) {
            res = value ? `${value}(公里)` : '';
        } else if (type == FlowcontroConstant.TYPE_TIME) {
            res = value ? `${value}(分钟)` : '';
        } else if (type == FlowcontroConstant.TYPE_ASSIGN) {
            res = assignSlot ? `${assignSlot}(各分配1架)` : '';
        } else if (type == FlowcontroConstant.TYPE_RESERVE) {
            res = assignSlot ? `${assignSlot}(各预留1架)` : '';
        }  else {
            res = value ? `${value}` : '';
        }
        return res;
    };

    // 转换后的结果对象
    let result = {};
    // 流控名称
    result.name = data.name || '';
    // 流控id
    result.id = data.id || '';
    // 发布者
    result.publishUser = data.publishUser || '';
    // 发布者中文
    result.publishUserZh = data.publishUserZh || '';
    // 限制数值
    result.value = setValue(data);
    // 受控航路点
    result.controlPoints = data.controlPoints || '';
    // 受控降落机场
    result.controlDirection = data.controlDirection || '';
    // 原因
    result.reason = setReason(data);
    // 流控类型
    result.placeType = setPlaceType(data);
    // 限制类型
    result.type = setType(data);
    // 流控时间
    result.dataTime = setDataTime(data);

    // 流控生效时间
    result.effectiveTime = `${result.dataTime.startTime}-${result.dataTime.endTime}`;
    // 流控生效日期
    result.effectiveDate = (result.dataTime.endDate) ? `${result.dataTime.startDate}/${result.dataTime.endDate}`: `${result.dataTime.startDate}`;
    // 流控状态
    result.status = setStatus(data, generateTime);
    // 流控计算状态
    result.casaStatus = setCasaStatus(data, generateTime);
    // 状态对应的样式名称
    result.statusClassName = setstatusClassName(data, generateTime);

    return result
};

// 校验流控是否为正在生效状态
const isEffective = (data, generateTime) => {
    // 标记 默认为true, 即是正在生效状态
    let flag = true;
    let { status, endTime, type, value } = data;
    if(!isValidVariable(status)){ // 状态无效
        flag = false;
        return flag;
    }


    if(type == FlowcontroConstant.TYPE_TRANSLATION && isValidVariable(endTime)){ // 成都版大规模延误
        // 求得终止时间
        let tempEndTime = addStringTime(endTime, value *60 * 60 * 1000 );
        // 若终止时间早于数据生成时间或 状态为人工终止、系统终止,则不是正在生效状态
        if(tempEndTime *1 < generateTime *1
            || status == FlowcontroConstant.FLOWCONTROL_STATUS_TERMINATED
            || status == FlowcontroConstant.FLOWCONTROL_STATUS_STOP
        ){
            flag = false;
        }
    }else if(status == FlowcontroConstant.FLOWCONTROL_STATUS_STOP // 若状态为系统终止、人工终止、正常结束、已废弃,则不是正在生效状态
        || status == FlowcontroConstant.FLOWCONTROL_STATUS_TERMINATED
        || status == FlowcontroConstant.FLOWCONTROL_STATUS_FINISHED
        || status == FlowcontroConstant.FLOWCONTROL_STATUS_DISCARD
    ){
        flag = false;
    } else {
        flag = true;
    }

    return flag;
}

export { FlowcontroConstant, convertFlowcontrolData, isEffective };
