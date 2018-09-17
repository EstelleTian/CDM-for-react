/**
 * 流控数据转换工具
 */

import { isValidVariable, isValidObject, addStringTime } from './basic-verify';
import {getDayTimeFromString} from "utils/basic-verify";
/**
 * Flowcontrol对象常量
 */
const FlowcontrolConstant = {

    option : [

        {

            key: 'flowcontrolDetail',
            en : 'flowcontrolDetail',
            cn : '详情',
            type : 'detail',
            order : 100
        },

        {

            key: 'flowcontrolImpactFlights',
            en : 'flowcontrolImpactFlights',
            cn : '影响',
            type : 'effect',
            order : 200
        },
        {

            key: 'flowcontrolEdit',
            en : 'flowcontrolEdit',
            cn : '修改',
            type : 'edit',
            order : 300
        },

        {

            key: 'flowcontrolReserveSlot',
            en : 'flowcontrolReserveSlot',
            cn : '预留时隙',
            type : 'former',
            order : 400
        },

        {

            key: 'terminateFlowControl',
            en : 'terminateFlowControl',
            type : 'stop',
            cn : '终止',
            order : 1300
        }, {

            key: 'release',
            en : 'release',
            type : 'stop',
            cn : '正常放行',
            order : 1301
        },

    ],

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
    TYPE_LDR: 'LDR', // 大规模延误恢复
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

const FlowcontrolUtil = {
    // 原因转换
    setReason: (data) => {
        // 原因
        let {reason} = data;
        // 转换后的结果
        let res = '';
        switch (reason) {
            case FlowcontrolConstant.REASON_WEATHER:
                res = '天气';
                break;
            case FlowcontrolConstant.REASON_MILITARY:
                res = '其他空域用户';//军方
                break;
            case FlowcontrolConstant.REASON_CONTROL:
                res = '航班时刻';//流量
                break;
            case FlowcontrolConstant.REASON_EQUIPMENT:
                res = '设备';
                break;
            case FlowcontrolConstant.REASON_ACC:
                res = '空管';
                break;
            case FlowcontrolConstant.REASON_AIRPORT:
                res = '机场';
                break;
            case FlowcontrolConstant.REASON_OTHERS:
                res = '其他';
                break;
            default:
                res = reason;
                break;
        }
        return res;
    },
    // 流控类型转换
    setPlaceType: (data) => {
        // 流控类型
        let {placeType} = data;
        // 转换后的结果
        let res = '';
        switch (placeType) {
            case FlowcontrolConstant.PLACE_TYPE_AP:
                res = '机场';
                break;
            case FlowcontrolConstant.PLACE_TYPE_POINT:
                res = '航路';
                break;
            default:
                res = '';
                break;
        }
        return res;
    },
    // 流控限制类型转换
    setType: (data) => {
        // 流控限制类型
        let {type, typeSubclass} = data;
        // 转换后的结果
        let res = '';

        if (type == FlowcontrolConstant.TYPE_MIT) {
            res = '限制距离';
        } else if (type == FlowcontrolConstant.TYPE_TIME) {
            res = '限制时间';
        } else if (type == FlowcontrolConstant.TYPE_GS) {
            res = '地面停止';
            if (typeSubclass == "GS_DEP") {
                res = '低能见度';
            }
        } else if (type == FlowcontrolConstant.TYPE_REQ) {
            res = '开车申请';
        } else if (type == FlowcontrolConstant.TYPE_ASSIGN) {
            res = '指定时隙';
        } else if (type == FlowcontrolConstant.TYPE_RESERVE) {
            res = '预留时隙';
        } else if (type == FlowcontrolConstant.TYPE_LDR) {
            res = '大规模延误恢复';
        } else if (type == FlowcontrolConstant.TYPE_TRANSLATION) {
            res = '大规模延误';
        }
        return res;
    },

    /**
     * 流控类型转换
     *
     * 类型 0 : 长期  1 : 非长期
     *
     * */
    setFlowcontrolType: (data)=> {
        // 流控限类型
        const {flowcontrolType} = data;
        let res = '';
        // 类型 0 : 长期  1 : 非长期
        if(flowcontrolType == 0){
            res = '长期';
        }else if(flowcontrolType == 1){
            res = '非长期'
        }
        return res;
    },

    /**
     * 流控开始时间
     * @param data 数据对象
     * @param generateTime 数据生成时间
     *
     * */
    setDataTime: (data, generateTime) => {
        // 流控
        let {status, startTime = "", endTime = "", placeType, relativeStartTime, relativeEndTime, relativeStatus} = data;
        // 转换后的结果
        let res = {};
        let sTime = '';
        let eTime = '';
        let startDate = '';
        let endDate = '';
        // 相对状态时间
        if (placeType == 'POINT' && relativeStatus != status) {

            if (isValidVariable(relativeStartTime) && startTime != relativeStartTime) {
                sTime = `(${FlowcontrolUtil.formatTime4(relativeStartTime)})`;
                startDate = FlowcontrolUtil.formatDate(relativeStartTime);
            }

            if (isValidVariable(relativeEndTime) && endTime != relativeEndTime) {
                eTime = `(${FlowcontrolUtil.formatTime4(relativeEndTime)})`;
                endDate = FlowcontrolUtil.formatDate(relativeEndTime);
            }

        } else {
            sTime = FlowcontrolUtil.formatTime4(startTime);
            startDate = FlowcontrolUtil.formatDate(startTime);
            eTime = FlowcontrolUtil.formatTime4(endTime);
            endDate = FlowcontrolUtil.formatDate(endTime);
        }

        res = {
            startTime: sTime,
            endTime: eTime,
            startDate: startDate,
            endDate: endDate
        }

        return res;
    },

    // 时间格式化 hh:mm
    formatTime4: (time) => {
        let result = '';
        if (time && 12 == time.length) {
            const hh = time.substring(8, 10);
            const mm = time.substring(10, 12);
            result = `${hh}:${mm}`;
        }
        return result;
    },
    // 日期格式化 yy-mm-dd
    formatDate: (datetime) => {
        let result = '';
        if (datetime && 12 == datetime.length) {
            const yy = datetime.substring(0, 4);
            const mm = datetime.substring(4, 6);
            const dd = datetime.substring(6, 8);
            result = `${yy}-${mm}-${dd}`;
        }
        return result;
    },


    /**
     * 流控状态
     * @param data 数据对象
     * @param generateTime 数据生成时间
     *
     * */
    setStatus: (data, generateTime) => {
        // 流控
        let {status, type, startTime = "", endTime = "", value, placeType, relativeStartTime, relativeStatus} = data;
        // 转换后的结果
        let res = '';
        if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_PRE_PUBLISH) {
            res = '将要发布';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_FUTURE
            || status == FlowcontrolConstant.FLOWCONTROL_STATUS_PUBLISH) {
            res = '将要执行';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_RUNNING) {
            res = '正在执行';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_STOP) {
            res = '系统终止';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_TERMINATED) {
            res = '人工终止';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_PRE_TERMINATED
            || status == FlowcontrolConstant.FLOWCONTROL_STATUS_PRE_UPDATE
        ) {
            res = '将要终止';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_DISCARD) {
            res = '已废弃';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_FINISHED) {
            res = '正常结束';
            if (type == FlowcontrolConstant.TYPE_TRANSLATION && isValidVariable(endTime)) { // 成都版大规模延误
                // 求得终止时间
                let tempEndTime = addStringTime(endTime, value * 60 * 60 * 1000);
                if (tempEndTime * 1 > generateTime * 1) { // 若数据生成时间早于终止时间,则显示"恢复中"
                    res = '恢复中';
                }
            }
        } else if (!endTime) {
            res = '已取消';
        }
        // 相对状态
        if (placeType == 'POINT'
            && isValidVariable(relativeStartTime)
            && startTime != relativeStartTime
            && relativeStatus != status
        ) {
            if (relativeStatus == FlowcontrolConstant.FLOWCONTROL_STATUS_RUNNING) {
                res = '(正在执行)'
            } else if (relativeStatus == FlowcontrolConstant.FLOWCONTROL_STATUS_FINISHED) {
                res = '(正常结束)'
            }
        }
        return res;
    },

    /**
     * 流控计算状态
     * @param data 数据对象
     *
     * */
    setCasaStatus: (data, generateTime) => {
        // 流控
        let {status, type, endTime = "", value, previewId, startFlowCasaTime} = data;
        // 转换后的结果
        let res = '';
        // 预演流控发布正式流控 默认显已计算
        if (isValidVariable(previewId) && !isValidVariable(startFlowCasaTime)) {
            res = '已计算';
        }

        if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_FUTURE
            || status == FlowcontrolConstant.FLOWCONTROL_STATUS_PUBLISH
            || status == FlowcontrolConstant.FLOWCONTROL_STATUS_RUNNING) {
            if (isValidVariable(startFlowCasaTime)) {
                res = '已计算';
            } else {
                res = '计算中';
            }
        }

        if (type == FlowcontrolConstant.TYPE_TRANSLATION && isValidVariable(endTime)) { // 成都版大规模延误
            // 求得终止时间
            let tempEndTime = addStringTime(endTime, value * 60 * 60 * 1000);
            if (tempEndTime * 1 > generateTime * 1 && status == FlowcontrolConstant.FLOWCONTROL_STATUS_FINISHED) { // 若数据生成时间早于终止时间,
                if (isValidVariable(startFlowCasaTime)) {
                    res = '已计算';
                } else {
                    res = '计算中';
                }
            }
        }

        return res;
    },

    /**
     * 流控状态对应的class名称
     * @param data 数据对象
     *
     * */
    setstatusClassName: (data, generateTime) => {
        // 流控
        let {status, type, endTime, value} = data;
        // 转换后的结果
        let res = '';
        if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_PRE_PUBLISH) { // 将要发布
            res = 'running';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_FUTURE
            || status == FlowcontrolConstant.FLOWCONTROL_STATUS_PUBLISH) { // 将要执行
            res = 'future';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_RUNNING) { // 正在执行
            res = 'running';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_STOP) { // 系统终止
            res = 'terminated';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_TERMINATED) { // 人工终止
            res = 'terminated';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_PRE_TERMINATED
            || status == FlowcontrolConstant.FLOWCONTROL_STATUS_PRE_UPDATE
        ) { // 将要终止
            res = 'terminated';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_DISCARD) { // 已废弃
            res = 'cancel';
        } else if (status == FlowcontrolConstant.FLOWCONTROL_STATUS_FINISHED) { // 正常结束
            res = 'finished';
            if (type == FlowcontrolConstant.TYPE_TRANSLATION && isValidVariable(endTime)) { // 成都版大规模延误
                // 求得终止时间
                let tempEndTime = addStringTime(endTime, value * 60 * 60 * 1000);
                if (tempEndTime * 1 > generateTime * 1) {  // 恢复中
                    res = 'finished';
                }
            }
        } else if (!endTime) { // 已取消
            res = 'cancel';
        }
        return res;
    },
    /**
     * 流控限制数值
     * @param data 数据对象
     * @
     *
     * */
    setValue: (data) => {
        // 流控
        let {type, value, assignSlot} = data;
        // 转换后的结果
        let res = '';
        if (type == FlowcontrolConstant.TYPE_MIT) {
            res = value ? `${value}(公里)` : '';
        } else if (type == FlowcontrolConstant.TYPE_TIME) {
            res = value ? `${value}(分钟)` : '';
        } else if (type == FlowcontrolConstant.TYPE_ASSIGN) {
            res = assignSlot ? `${assignSlot}(各分配1架)` : '';
        } else if (type == FlowcontrolConstant.TYPE_RESERVE) {
            res = assignSlot ? `${assignSlot}(各预留1架)` : '';
        } else {
            res = value ? `${value}` : '';
        }
        return res;
    },
    /**
     * 预锁航班时隙变更策略
     *  data 流控数据
     * */
    setCompressAtStartStrategy: (data) => {
        // 变更策略
        let {compressAtStartStrategy} = data;
        // 转换后的结果
        let res = '';
        if (compressAtStartStrategy == 'PART') {
            res = '公司申请变更';
        } else if (compressAtStartStrategy == 'ALL') {
            res = '自动压缩';
        } else if (compressAtStartStrategy == 'NONE') {
            res = '不自动压缩';
        }
        return res;
    },
    setDialogName : (data) => {
        const {placeType, type, typeSubclass} = data;
        let res = '';
        if(placeType == 'AP'){
            if(type == 'GS' && typeSubclass == 'GS_DEP'){
                res = '修改低能见度受限'
            }else {
                res = '修改机场受限'
            }
        }else if(placeType == 'POINT'){
            res = '修改航路受限'
        }
        return res;
    },
    //计算流控生效时间
    setEffectiveTime: (flow) => {
        const { relativeStartTime, endTime, lastModifyTime, relativeEndTime } = flow;
        // 生效开始时间
        let start = relativeStartTime;
        // 生效结束时间
        let end = '';
        // 若结束时间和最后修改时间都有效，则生效结束时间取两者最小的
        if(endTime && lastModifyTime){
            end = (endTime > lastModifyTime) ? lastModifyTime : endTime;
        }else if(endTime && !lastModifyTime){// 若结束时间有效且最后修改时间无效
            // 若结束时间与相对结束时间不相等，则取相对结束时间
            if(relativeEndTime && (endTime != relativeEndTime)){
                end = relativeEndTime;
            }else {
                end = endTime;
            }
        }else if(!endTime && lastModifyTime){ // 若结束时间无效且最后修改时间有效
            end = lastModifyTime;
        }

        start = getDayTimeFromString(start);
        end = getDayTimeFromString(end);
        return `${start}~${end}`
    },
    //批量格式化
    batchFormattingTime(array) {
        if(!array){
            return '';
        }
        let arr = array.split(',');
        arr = arr.map((item) => {
            return getDayTimeFromString(item)
        });
        return arr.join(',');
    },
    // 转换流控信息数据
    setflowStatus(flow, systemConfig){
        const { status, relativeStatus, placeType } = flow;
        let resObj = {
            statusZh : '',
            className : '',
        };
        if(!status){
            return resObj;
        }
        if(status == 'PUBLISH'){
            resObj.statusZh = '已发布';
            resObj.className = 'running';
        }else if(status == 'RUNNING'){
            resObj.statusZh = '正在执行';
            resObj.className = 'running';
        }else if(status == 'FUTURE'){
            resObj.statusZh = '将要执行';
            resObj.className = 'future';
        }else if(status == 'TERMINATED'){
            resObj.statusZh = '人工终止';
            resObj.className = 'terminated';
        }else if(status == 'STOP'){
            resObj.statusZh = '系统终止';
            resObj.className = 'terminated';
        }else if(status == 'FINISHED'){
            resObj.statusZh = '正常结束';
            resObj.className = 'finished';
        }else if(status == 'DISCARD'){
            resObj.statusZh = '已废弃';
            resObj.className = 'cancel';
        }else if(status == 'PRE_PUBLISH'){
            resObj.statusZh = '将要发布';
            resObj.className = 'running';
        }else if(status == 'PRE_UPDATE'){
            resObj.statusZh = '将要更新';
            resObj.className = 'running';
        }else if(status == 'PRE_TERMINATED'){
            resObj.statusZh = '将要终止';
            resObj.className = 'terminated';
        }
        // 相对状态
        if(placeType =='POINT' && status && relativeStatus ){
            // 系统名
            const {systemElem} = systemConfig;
            // 状态与相对状态不相同，取相对状态值
            if(status != relativeStatus){
                if(relativeStatus == 'RUNNING'){
                    resObj.statusZh = `${systemElem}(正在执行)`;
                    resObj.className = 'running';
                }else if(relativeStatus == 'FINISHED'){
                    resObj.statusZh = `${systemElem}(正常结束)`;
                    resObj.className = 'finished';
                }
            }
        }
        return resObj;
    },
    /**
     * 获取操作项
     *
     * @param auth
     * @returns
     */
    setOperations(auth) {
        let authMap = [];
        for (let i in auth){
            FlowcontrolConstant.option.map((item,index) => {
                if(i == item.key){
                    let obj = {};
                    let show = auth[i];
                    obj = {...item, show};
                    authMap.push(obj);
                }
            });

        }


        return authMap;
    }

};

// 流控数据转换
const convertFlowcontrolData = function(data, generateTime, systemConfig){
    // 校验数据
    if(!isValidObject(data)){
        return {};
    }
    // 转换后的结果对象
    let result = {};
    // 流控id
    result.id = data.id || '';
    // 流控名称
    result.name = data.name || '';
    // 流控生效时间范围（日期/时间）
    result.effectiveRangeTime = FlowcontrolUtil.setEffectiveTime(data);
    // 流控时间
    result.dataTime = FlowcontrolUtil.setDataTime(data);
    // 流控生效时间（时间）
    result.effectiveTime = `${result.dataTime.startTime}-${result.dataTime.endTime}`;
    // 流控生效日期
    result.effectiveDate = (result.dataTime.endDate) ? `${result.dataTime.startDate}/${result.dataTime.endDate}`: `${result.dataTime.startDate}`;
    // 是否是长期流控
    result.flowcontrolType = FlowcontrolUtil.setFlowcontrolType(data);
    // 流控状态
    result.status = FlowcontrolUtil.setStatus(data, generateTime);
    // 状态对应的样式名称
    result.statusClassName = FlowcontrolUtil.setstatusClassName(data, generateTime);
    // 流控状态
    // const {systemConfig} = this.props;
    result.flowStatus = FlowcontrolUtil.setflowStatus(data, systemConfig).statusZh;
    result.flowStatusClassName = FlowcontrolUtil.setflowStatus(data, systemConfig).className;
    // 发布者
    result.publishUser = data.publishUserZh + ' (' + data.publishUser + ')';
    // 发布者中文
    result.publishUserZh = data.publishUserZh || '';
    // 来源
    result.source = data.source || '';
    // 原发布单位
    result.originalPublishUnit = data.originalPublishUnit || '';
    // 流控类型
    result.placeType = FlowcontrolUtil.setPlaceType(data);
    // 开始时间
    result.startTime = getDayTimeFromString(data.startTime);
    // 结束时间
    result.endTime = getDayTimeFromString(data.endTime);
    // 创建时间
    result.generateTime = getDayTimeFromString(data.generateTime);
    // 修改时间
    result.lastModifyTime = getDayTimeFromString(data.lastModifyTime);
    //更新时间
    result.updateTime = FlowcontrolUtil.formatTime4(data.generateTime);
    // 纳入计算时间
    result.startFlowCasaTime = getDayTimeFromString(data.startFlowCasaTime);
    // 限制类型
    result.type = FlowcontrolUtil.setType(data);
    // 限制数值
    result.value = FlowcontrolUtil.setValue(data);
    // 受控航路点
    result.controlPoints = data.controlPoints || '';
    // 受控方向
    result.flowcontrolDirection = data.flowcontrolDirection || '';
    // 受控起飞机场
    result.controlDepDirection = data.controlDepDirection || '';
    // 受控降落机场
    result.controlDirection = data.controlDirection || '';
    // 豁免起飞机场
    result.exemptDepDirection = data.exemptDepDirection || '';
    // 豁免降落机场
    result.exemptDirection = data.exemptDirection || '';
    //限制高度
    result.controlLevel = data.controlLevel || '';
    //预留时隙
    result.reserveSlots = FlowcontrolUtil.batchFormattingTime(data.reserveSlots);
    // 预锁航班时隙变更策略
    result.compressAtStartStrategy = FlowcontrolUtil.setCompressAtStartStrategy(data);
    // 压缩时间范围
    result.compressAtStartWinStart = data.compressAtStartWinStart || '';
    result.compressAtEndWinEnd = data.compressAtEndWinEnd || '';
    // 原因
    result.reason = FlowcontrolUtil.setReason(data);
    // 备注信息
    result.comments = data.comments || '';

    // 修改弹框名称
    result.dialogName = FlowcontrolUtil.setDialogName(data);
    // 流控计算状态
    result.casaStatus = FlowcontrolUtil.setCasaStatus(data, generateTime);

    result.operations = FlowcontrolUtil.setOperations(data.auth);
    return result;
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


    if(type == FlowcontrolConstant.TYPE_TRANSLATION && isValidVariable(endTime)){ // 成都版大规模延误
        // 求得终止时间
        let tempEndTime = addStringTime(endTime, value *60 * 60 * 1000 );
        // 若终止时间早于数据生成时间或 状态为人工终止、系统终止,则不是正在生效状态
        if(tempEndTime *1 < generateTime *1
            || status == FlowcontrolConstant.FLOWCONTROL_STATUS_TERMINATED
            || status == FlowcontrolConstant.FLOWCONTROL_STATUS_STOP
        ){
            flag = false;
        }
    }else if(status == FlowcontrolConstant.FLOWCONTROL_STATUS_STOP // 若状态为系统终止、人工终止、正常结束、已废弃,则不是正在生效状态
        || status == FlowcontrolConstant.FLOWCONTROL_STATUS_TERMINATED
        || status == FlowcontrolConstant.FLOWCONTROL_STATUS_FINISHED
        || status == FlowcontrolConstant.FLOWCONTROL_STATUS_DISCARD
    ){
        flag = false;
    } else {
        flag = true;
    }

    return flag;
}

export { FlowcontrolConstant, convertFlowcontrolData, FlowcontrolUtil,  isEffective };
