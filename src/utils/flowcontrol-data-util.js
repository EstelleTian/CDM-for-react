/**
 * 流控数据转换工具
 */

import {
    isValidVariable,
    isValidObject,
    addStringTime,
    getTimeFromString,
    getDayTimeFromString,
    formatTimeString
} from './basic-verify';

const FlowcontrolDataUtil = {
    /**********************************常量*****************************/
    // 流控列表操作选项
    option: [
        {
            key: 'flowcontrolDetail',
            en: 'flowcontrolDetail',
            cn: '详情',
            type: 'detail',
            order: 100
        }, {
            key: 'flowcontrolImpactFlights',
            en: 'flowcontrolImpactFlights',
            cn: '影响',
            type: 'effect',
            order: 200
        }, {
            key: 'flowcontrolEdit',
            en: 'flowcontrolEdit',
            cn: '修改',
            type: 'edit',
            order: 300
        }, {
            key: 'flowcontrolReserveSlot',
            en: 'flowcontrolReserveSlot',
            cn: '预留时隙',
            type: 'former',
            order: 400
        }, {
            key: 'terminateFlowControl',
            en: 'terminateFlowControl',
            type: 'stop',
            cn: '终止',
            order: 1300
        }, {
            key: 'release',
            en: 'release',
            type: 'stop',
            cn: '正常放行',
            order: 1301
        },
    ],

    FLOWCONTROL_TYPE_LONG: 0, // 长期流控
    FLOWCONTROL_TYPE_NORMAL: 1, // 常规流控

    COMPOSITE_VALUE: 100, // 复合流控
    FLOWCONTROL_STATUS_PUBLISH: 'PUBLISH', // 发布
    FLOWCONTROL_STATUS_FUTURE: 'FUTURE', // 将要执行
    FLOWCONTROL_STATUS_RUNNING: 'RUNNING', // 正在执行
    FLOWCONTROL_STATUS_STOP: 'STOP', // 系统终止终止
    FLOWCONTROL_STATUS_FINISHED: 'FINISHED', //  正常结束
    FLOWCONTROL_STATUS_DISCARD: 'DISCARD', // 已废弃
    FLOWCONTROL_STATUS_PRE_UPDATE: 'PRE_UPDATE', // 预更新状态
    FLOWCONTROL_STATUS_PRE_PUBLISH: 'PRE_PUBLISH', // 预发布状态
    FLOWCONTROL_STATUS_PRE_TERMINATED: 'PRE_TERMINATED', // 预终止状态
    FLOWCONTROL_STATUS_PREVIEW: 'PREVIEW', // 流控预演

    FLOWCONTROL_STATUS_TERMINATED: 'TERMINATED', // 人工终止
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
    REASON_ACC: 'ACC',//空管
    REASON_WEATHER: 'WEATHER',//天气
    REASON_AIRPORT: 'AIRPORT',//机场
    REASON_CONTROL: 'CONTROL',//航班时刻
    REASON_EQUIPMENT: 'EQUIPMENT',//设备
    REASON_MILITARY: 'MILITARY',//其他空域用户
    REASON_OTHERS: 'OTHERS',//其他

    STRATEGY_PART : 'PART',
    STRATEGY_ALL : 'ALL',
    STRATEGY_NONE : 'NONE',

    /***********************************方法*****************************/

    /**
     * 获取流控类型
     * @param data  流控数据
     * @returns {String}
     */
    getPlaceTypeZh: function (data) {
        // 流控类型
        let {placeType} = data;
        // 转换后的结果
        let res = '';
        switch (placeType) {
            case this.PLACE_TYPE_AP:
                res = '机场';
                break;
            case this.PLACE_TYPE_POINT:
                res = '航路';
                break;
            default:
                res = placeType || '';
                break;
        }
        return res;
    },

    /**
     * 获取流控类型
     * @param data  流控数据
     * @returns {String} 长期/非长期
     */
    getFlowcontrolTypeZh: function (data) {
        // 类型
        // 0 : 长期
        // 1 : 非长期
        const {flowcontrolType} = data;
        let res = '';
        switch (flowcontrolType) {
            case this.FLOWCONTROL_TYPE_LONG:
                res = '长期';
                break;
            case this.FLOWCONTROL_TYPE_NORMAL:
                res = '非长期';
                break;
            default:
                res = flowcontrolType || '';
                break;
        }
        return res;
    },

    /**
     * 获取变更策略
     * @param data 流控数据
     * @return string 变更策略
     * */
    getStrategyZh: function (data) {
        const { status, compressAtStartStrategy, compressAtEndStrategy  } = data;
        // 转换后的结果
        let res = '';
        if(status == this.FLOWCONTROL_STATUS_PRE_PUBLISH){
            res = this.getStrateg(compressAtStartStrategy);
        }else if(status == this.FLOWCONTROL_STATUS_PRE_TERMINATED
                || status == this.FLOWCONTROL_STATUS_PRE_UPDATE){
            res = this.getStrateg(compressAtEndStrategy);
        }else if( compressAtEndStrategy){
            res = this.getStrateg(compressAtEndStrategy);
        }else if(compressAtStartStrategy){
            res = this.getStrateg(compressAtStartStrategy);
        }
        return res;
    },

    getStrateg: function (strateg) {
        if(strateg == this.STRATEGY_PART){
            return '公司申请变更'
        }else if(strateg == this.STRATEGY_ALL){
            return '自动压缩'
        }else if(strateg == this.STRATEGY_NONE){
            return '不自动压缩'
        }else {
            return '';
        }
    },

    /**
     * 获取压缩时间范围
     * @param data 流控数据
     * @return string 压缩时间范围
     * */
    getCompressTimes: function (data) {
        const { status,compressAtStartStrategy, compressAtEndStrategy,
            compressAtStartWinStart, compressAtStartWinEnd, compressAtEndWinStart, compressAtEndWinEnd
        } = data;
        let res = '';

        if(status == this.FLOWCONTROL_STATUS_PRE_PUBLISH){
            if(compressAtStartStrategy){
                res = getDayTimeFromString(compressAtStartWinStart)+'~'+ getDayTimeFromString(compressAtStartWinEnd);
            }
        }else if(status == this.FLOWCONTROL_STATUS_PRE_TERMINATED
            || status == this.FLOWCONTROL_STATUS_PRE_UPDATE){
            if(compressAtEndStrategy){
                res = getDayTimeFromString(compressAtEndWinStart)+'~'+ getDayTimeFromString(compressAtEndWinEnd);
            }
        }else if(compressAtEndStrategy){
            res = getDayTimeFromString(compressAtEndWinStart)+'~'+ getDayTimeFromString(compressAtEndWinEnd);

        }else if(compressAtStartStrategy){
            res = getDayTimeFromString(compressAtStartWinStart)+'~'+ getDayTimeFromString(compressAtStartWinEnd);
        }
        return res;
    },

    /**
     * 限制原因
     * @param data  流控数据
     * @return string
     */
    getReasonZh: function (data) {
        // 原因
        let {reason} = data;
        // 转换后的结果
        let res = '';
        switch (reason) {
            case this.REASON_WEATHER:
                res = '天气';
                break;
            case this.REASON_MILITARY:
                res = '其他空域用户'; // 军方
                break;
            case this.REASON_CONTROL:
                res = '航班时刻'; // 流量
                break;
            case this.REASON_EQUIPMENT:
                res = '设备';
                break;
            case this.REASON_ACC:
                res = '空管';
                break;
            case this.REASON_AIRPORT:
                res = '机场';
                break;
            case this.REASON_OTHERS:
                res = '其他';
                break;
            default:
                res = reason || '';
                break;
        }
        return res;
    },

    /**
     * 获取流控限制类型
     * @param data  流控数据
     * @returns {String}
     */
    getLimitTypeZh: function (data) {
        // 流控限制类型
        let {type, typeSubclass} = data;
        // 转换后的结果
        let res = '';
        switch (type) {
            case this.TYPE_MIT:
                res = '距离';
                break;
            case this.TYPE_TIME:
                res = '时间';
                break;
            case this.TYPE_GS:
                res = '地面停止';
                if (typeSubclass == "GS_DEP") {
                    res = '低能见度';
                }
                break;
            case this.TYPE_REQ:
                res = '开车申请';
                break;
            case this.TYPE_ASSIGN:
                res = '指定时隙';
                break;
            case this.TYPE_RESERVE:
                res = '预留时隙';
                break;
            case this.TYPE_LDR:
                res = '大规模延误恢复';
                break;
            case this.TYPE_TRANSLATION:
                res = '大规模延误';
                break;
            default:
                res = type || '';
                break;
        }
        return res;
    },

    /**
     * 获取限制数值
     * @param data  流控数据
     * @returns {String}
     */
    getLimitValue: function (data) {
        // 流控数据类型
        let {type, value, assignSlot} = data;
        // 转换后的结果
        let res = '';
        if (type == this.TYPE_MIT ||
            type == this.TYPE_TIME
        ) {
            res = value || '';
        } else if (type == this.TYPE_ASSIGN ||
            type == this.TYPE_RESERVE
        ) {
            res = assignSlot || '';
        }
        return res;
    },

    /**
     * 获取限制数值单位
     * @param data  流控数据
     * @returns {String}
     */
    getLimitValueUnit: function (data) {
        // 流控数据类型
        let {type, value = '', assignSlot = ''} = data;
        const valueStr = value.toString();
        const assignSlotStr = assignSlot.toString();
        // 转换后的结果
        let res = '';
        if (type == this.TYPE_MIT && isValidVariable(valueStr)) {
            res = '公里';
        } else if (type == this.TYPE_TIME && isValidVariable(valueStr)) {
            res = '分钟';
        } else if (type == this.TYPE_ASSIGN && isValidVariable(assignSlotStr)) {
            res = '各分配1架';
        } else if (type == this.TYPE_RESERVE && isValidVariable(assignSlotStr)) {
            res = '各预留1架';
        }
        return res;
    },

    /**
     * 获取流控开始时间
     * @param data  流控数据
     * @returns {Object}
     * */
    getStartTime: function (data) {
        // 流控
        let {status, startTime, placeType, relativeStartTime, relativeStatus} = data;
        // 相对状态时间
        if (placeType == 'POINT' &&  // 航路流控
            relativeStatus != status &&  //相对状态与状态不相同
            isValidVariable(startTime) &&  // 开始时间有效
            isValidVariable(relativeStartTime) &&  // 开始时间有效
            startTime != relativeStartTime // 相对状态开始时间与开始时间不相同
        ) {
            return {
                startTime,
                relativeStartTime
            }
        } else {
            return {
                startTime
            }
        }
    },
    /**
     * 获取流控结束时间
     * @param data  流控数据
     * @returns {Object}
     * */
    getEndTime: function (data) {
        // 流控
        let {status, endTime, placeType, relativeEndTime, relativeStatus} = data;
        // 相对状态时间
        if (placeType == 'POINT' &&  // 航路流控
            relativeStatus != status && //相对状态与状态不相同
            isValidVariable(endTime) && // 结束时间有效
            isValidVariable(relativeEndTime) && // 相对状态结束时间
            endTime != relativeEndTime // 相对状态结束时间与结束时间不相同
        ) {
            return {
                endTime,
                relativeEndTime
            }
        } else {
            return {
                endTime
            }
        }
    },


    /**
     * 获取流控开始时间
     * @param data  流控数据
     * @returns {String} hh:ii
     * */
    getStartTimeFormatSting: function (data) {
        let obj = this.getStartTime(data);
        const {startTime, relativeStartTime} = obj;
        if (startTime && relativeStartTime) {
            return `( ${getTimeFromString(relativeStartTime)} )`;
        } else if (startTime) {
            return getTimeFromString(startTime);
        } else {
            return '';
        }
    },

    /**
     * 获取流控开始时间
     * @param data  流控数据
     * @returns {String} d/hhii
     * */
    getStartDayTimeFormatSting: function (data) {
        let obj = this.getStartTime(data);
        const {startTime, relativeStartTime} = obj;
        if (startTime && relativeStartTime) {
            return `( ${getDayTimeFromString(relativeStartTime)} )`;
        } else if (startTime) {
            return getDayTimeFromString(startTime);
        } else {
            return '';
        }
    },

    /**
     * 获取流控开始时间
     * @param data  流控数据
     * @returns {String} yyyy-mm-dd hh:ii
     * */
    getStartFullTimeFormatSting: function (data) {
        let obj = this.getStartTime(data);
        const {startTime, relativeStartTime} = obj;
        if (startTime && relativeStartTime) {
            return `( ${formatTimeString(relativeStartTime)} )`
        } else if (startTime) {
            return formatTimeString(startTime)
        } else {
            return '';
        }
    },

    /**
     * 获取流控结束时间
     * @param data  流控数据
     * @returns {String} hh:ii
     * */
    getEndTimeFormatSting: function (data) {
        let obj = this.getEndTime(data);
        const {endTime, relativeEndTime} = obj;
        if (endTime && relativeEndTime) {
            return `( ${getTimeFromString(relativeEndTime)} )`
        } else if (endTime) {
            return getTimeFromString(endTime)
        } else {
            return '';
        }
    },
    /**
     * 获取流控结束时间
     * @param data  流控数据
     * @returns {String} d/hhii
     * */
    getEndDayTimeFormatSting: function (data) {
        let obj = this.getEndTime(data);
        const {endTime, relativeEndTime} = obj;
        if (endTime && relativeEndTime) {
            return `( ${getDayTimeFromString(relativeEndTime)} )`
        } else if (endTime) {
            return getDayTimeFromString(endTime)
        } else {
            return '';
        }
    },
    /**
     * 获取流控结束时间
     * @param data  流控数据
     * @returns {String} yyyy-mm-dd hh:ii
     * */
    getEndFullTimeFormatSting: function (data) {
        let obj = this.getEndTime(data);
        const {endTime, relativeEndTime} = obj;
        if (endTime && relativeEndTime) {
            return `( ${formatTimeString(relativeEndTime)} )`
        } else if (endTime) {
            return formatTimeString(endTime)
        } else {
            return '';
        }
    },

    /**
     * 获取流控状态 ---用于流控列表
     * @param data  流控数据
     * @param generateTime 数据生成时间
     * @returns {String}
     */
    getStatusZhForList: function (data, generateTime) {
        // 流控
        let {status, type, startTime, endTime, value, placeType, relativeStartTime, relativeStatus} = data;
        // 转换后的结果
        let res = '';
        if (status == this.FLOWCONTROL_STATUS_PRE_PUBLISH) {
            res = '将要发布';
        } else if (status == this.FLOWCONTROL_STATUS_FUTURE
            || status == this.FLOWCONTROL_STATUS_PUBLISH) {
            res = '将要执行';
        } else if (status == this.FLOWCONTROL_STATUS_RUNNING) {
            res = '正在执行';
        } else if (status == this.FLOWCONTROL_STATUS_STOP) {
            res = '系统终止';
        } else if (status == this.FLOWCONTROL_STATUS_TERMINATED) {
            res = '人工终止';
        } else if (status == this.FLOWCONTROL_STATUS_PRE_TERMINATED
            || status == this.FLOWCONTROL_STATUS_PRE_UPDATE
        ) {
            res = '将要终止';
        } else if (status == this.FLOWCONTROL_STATUS_DISCARD) {
            res = '已废弃';
        } else if (status == this.FLOWCONTROL_STATUS_FINISHED) {
            res = '正常结束';
            if (type == this.TYPE_TRANSLATION && isValidVariable(endTime)) { // 成都版大规模延误
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
        if (this.isRelative(data)) {
            if (relativeStatus == this.FLOWCONTROL_STATUS_RUNNING) {
                res = '(正在执行)'
            } else if (relativeStatus == this.FLOWCONTROL_STATUS_FINISHED) {
                res = '(正常结束)'
            }
        }
        return res;

    },

    /**
     * 获取流控状态 ---用于流控详情页
     * @param data  流控数据
     * @param generateTime 数据生成时间
     * @param systemConfig 系统信息
     * @returns {String}
     */
    getStatusZhForDetail: function (data, generateTime) {
        // 流控
        let {status, type, endTime, value} = data;
        // 转换后的结果
        let res = '';
        if (status == this.FLOWCONTROL_STATUS_PRE_PUBLISH) {
            res = '将要发布';
        } else if (status == this.FLOWCONTROL_STATUS_FUTURE
            || status == this.FLOWCONTROL_STATUS_PUBLISH) {
            res = '将要执行';
        } else if (status == this.FLOWCONTROL_STATUS_RUNNING) {
            res = '正在执行';
        } else if (status == this.FLOWCONTROL_STATUS_STOP) {
            res = '系统终止';
        } else if (status == this.FLOWCONTROL_STATUS_TERMINATED) {
            res = '人工终止';
        } else if (status == this.FLOWCONTROL_STATUS_PRE_TERMINATED
            || status == this.FLOWCONTROL_STATUS_PRE_UPDATE
        ) {
            res = '将要终止';
        } else if (status == this.FLOWCONTROL_STATUS_DISCARD) {
            res = '已废弃';
        } else if (status == this.FLOWCONTROL_STATUS_FINISHED) {
            res = '正常结束';
            if (type == this.TYPE_TRANSLATION && isValidVariable(endTime)) { // 大规模延误
                // 求得终止时间
                let tempEndTime = addStringTime(endTime, value * 60 * 60 * 1000);
                if (tempEndTime * 1 > generateTime * 1) { // 若数据生成时间早于终止时间,则显示"恢复中"
                    res = '恢复中';
                }
            }
        } else if (!endTime) {
            res = '已取消';
        }
        // // 相对状态
        // if (this.isRelative(data)) {
        //     // 系统名
        //     const {systemElem} = systemConfig;
        //     if (relativeStatus == this.FLOWCONTROL_STATUS_RUNNING) {
        //         res += ` ${systemElem}(正在执行)`
        //     } else if (relativeStatus == this.FLOWCONTROL_STATUS_FINISHED) {
        //         res += ` ${systemElem}(正常结束)`
        //     }
        // }
        return res;
    },

    /**
     * 获取流控相对状态下的状态 ---用于流控详情页
     * @param data  流控数据
     * @param generateTime 数据生成时间
     * @param systemConfig 系统信息
     * @returns {String}
     * */

    getRelativeStatusZhForDetail: function (data) {
        // 流控
        let {relativeStatus, type, endTime, value} = data;
        // 转换后的结果
        let res = '';
        // 若不是相对状态则返回空
        if(!this.isRelative(data)){
            return res;
        }
        if (relativeStatus == this.FLOWCONTROL_STATUS_PRE_PUBLISH) {
            res = '将要发布';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_FUTURE
            || relativeStatus == this.FLOWCONTROL_STATUS_PUBLISH) {
            res = '将要执行';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_RUNNING) {
            res = '正在执行';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_STOP) {
            res = '系统终止';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_TERMINATED) {
            res = '人工终止';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_PRE_TERMINATED
            || relativeStatus == this.FLOWCONTROL_STATUS_PRE_UPDATE
        ) {
            res = '将要终止';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_DISCARD) {
            res = '已废弃';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_FINISHED) {
            res = '正常结束';
            if (type == this.TYPE_TRANSLATION && isValidVariable(endTime)) { // 大规模延误
                // 求得终止时间
                let tempEndTime = addStringTime(endTime, value * 60 * 60 * 1000);
                if (tempEndTime * 1 > generateTime * 1) { // 若数据生成时间早于终止时间,则显示"恢复中"
                    res = '恢复中';
                }
            }
        } else if (!endTime) {
            res = '已取消';
        }

        return res;
    },

    /**
     * 获取流控状态对应的class名称
     * @param data 数据对象
     * @param generateTime 数据生成时间
     * @returns {String}
     * */
    getStatusClassName: function (data, generateTime) {
        // 流控
        let {status, type, endTime, value} = data;
        // 转换后的结果
        let res = '';

        if (status == this.FLOWCONTROL_STATUS_PRE_PUBLISH) { // 将要发布
            res = 'running';
        } else if (status == this.FLOWCONTROL_STATUS_FUTURE
            || status == this.FLOWCONTROL_STATUS_PUBLISH) { // 将要执行
            res = 'future';
        } else if (status == this.FLOWCONTROL_STATUS_RUNNING) { // 正在执行
            res = 'running';
        } else if (status == this.FLOWCONTROL_STATUS_STOP) { // 系统终止
            res = 'terminated';
        } else if (status == this.FLOWCONTROL_STATUS_TERMINATED) { // 人工终止
            res = 'terminated';
        } else if (status == this.FLOWCONTROL_STATUS_PRE_TERMINATED
            || status == this.FLOWCONTROL_STATUS_PRE_UPDATE
        ) { // 将要终止
            res = 'terminated';
        } else if (status == this.FLOWCONTROL_STATUS_DISCARD) { // 已废弃
            res = 'cancel';
        } else if (status == this.FLOWCONTROL_STATUS_FINISHED) { // 正常结束
            res = 'finished';
            if (type == this.TYPE_TRANSLATION && isValidVariable(endTime)) { // 成都版大规模延误
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
     * 获取流控状态对应的class名称
     * @param data 数据对象
     * @param generateTime 数据生成时间
     * @returns {String}
     * */
    getRelativeStatusClassName: function (data, generateTime) {
        // 流控
        let {relativeStatus, type, endTime, value} = data;
        // 转换后的结果
        let res = '';
        // 若不是相对状态则返回空
        if(!this.isRelative(data)){
            return res;
        }
        if (relativeStatus == this.FLOWCONTROL_STATUS_PRE_PUBLISH) { // 将要发布
            res = 'running';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_FUTURE
            || relativeStatus == this.FLOWCONTROL_STATUS_PUBLISH) { // 将要执行
            res = 'future';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_RUNNING) { // 正在执行
            res = 'running';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_STOP) { // 系统终止
            res = 'terminated';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_TERMINATED) { // 人工终止
            res = 'terminated';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_PRE_TERMINATED
            || relativeStatus == this.FLOWCONTROL_STATUS_PRE_UPDATE
        ) { // 将要终止
            res = 'terminated';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_DISCARD) { // 已废弃
            res = 'cancel';
        } else if (relativeStatus == this.FLOWCONTROL_STATUS_FINISHED) { // 正常结束
            res = 'finished';
            if (type == this.TYPE_TRANSLATION && isValidVariable(endTime)) { // 成都版大规模延误
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
     * 获取流控计算状态 ---用于流控列表
     * @param data  流控数据
     * @param generateTime 数据生成时间
     * @returns {String}
     */
    getCasaStatusZh: function (data, generateTime) {
        // 流控
        let {status, type, endTime = "", value, previewId, startFlowCasaTime} = data;
        // 转换后的结果
        let res = '';
        // 预演流控发布正式流控 默认显已计算
        if (isValidVariable(previewId) && !isValidVariable(startFlowCasaTime)) {
            res = '已计算';
        }

        if (status == this.FLOWCONTROL_STATUS_FUTURE
            || status == this.FLOWCONTROL_STATUS_PUBLISH
            || status == this.FLOWCONTROL_STATUS_RUNNING) {
            if (isValidVariable(startFlowCasaTime)) {
                res = '已计算';
            } else {
                res = '计算中';
            }
        }

        if (type == this.TYPE_TRANSLATION && isValidVariable(endTime)) { // 大规模延误
            // 求得终止时间
            let tempEndTime = addStringTime(endTime, value * 60 * 60 * 1000);
            if (tempEndTime * 1 > generateTime * 1 && status == this.FLOWCONTROL_STATUS_FINISHED) { // 若数据生成时间早于终止时间,
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
     * 计算流控生效时间---- 用于流控详情页面顶部信息
     * @param data  流控数据
     *
     * */
    getEffectiveTime: function (data) {
        const {relativeStartTime, endTime, lastModifyTime, relativeEndTime} = data;
        // 生效开始时间
        let start = relativeStartTime;
        // 生效结束时间
        let end = '';
        // 若结束时间和最后修改时间都有效，则生效结束时间取两者最小的
        if (endTime && lastModifyTime) {
            end = (endTime > lastModifyTime) ? lastModifyTime : endTime;
        } else if (endTime && !lastModifyTime) {// 若结束时间有效且最后修改时间无效
            // 若结束时间与相对结束时间不相等，则取相对结束时间
            if (relativeEndTime && (endTime != relativeEndTime)) {
                end = relativeEndTime;
            } else {
                end = endTime;
            }
        } else if (!endTime && lastModifyTime) { // 若结束时间无效且最后修改时间有效
            end = lastModifyTime;
        }

        start = getDayTimeFromString(start);
        end = getDayTimeFromString(end);
        return `${start}~${end}`
    },

    /**
     * 获取操作选项
     *  @param data 流控数据
     *  @returns {Array}
     * */
    getOperations: function (data) {
        let authMap = [], {auth} = data;
        for (let i in auth) {
            this.option.map((item, index) => {
                if (i == item.key) {
                    let obj = {};
                    let show = auth[i];
                    obj = {...item, show};
                    authMap.push(obj);
                }
            });

        }
        return authMap;
    },
    /**
     * 获取分类
     *  @param data 流控数据
     *  @returns String
     * */
    getCategory: function (data) {
        const { placeType,  type, typeSubclass} = data;

        let res = '';

        if(placeType == this.PLACE_TYPE_AP){
            res =  'AP';
            if(type == this.TYPE_LDR){
                res =  'LDR';
            }else if(type == this.TYPE_TRANSLATION){
                res = 'TRANSLATION'
            }else if(type == this.TYPE_GS && typeSubclass == "GS_DEP"){
                res = 'GS_DEP';
            }
        }else if(placeType == this.PLACE_TYPE_POINT){
            res = 'POINT';
        }
        return res;

    },
    /**
     * 获取弹框名称
     *  @param data 流控数据
     *  @returns String
     * */
    getTitleName: function (data) {
        const { placeType,  type, typeSubclass} = data;

        let res = '';

        if(placeType == this.PLACE_TYPE_AP){
            res =  '机场流控';
            if(type == this.TYPE_LDR){
                res =  '大规模延误恢复';
            }else if(type == this.TYPE_TRANSLATION){
                res = '大规模延误'
            }else if(type == this.TYPE_GS && typeSubclass == "GS_DEP"){
                res = '低能见度';
            }
        }else if(placeType == this.PLACE_TYPE_POINT){
            res = '航路';
        }
        return res;

    },

    /**
     * 校验流控是否为正在生效状态
     * @param data  流控数据
     * @param generateTime 数据生成时间
     * @returns {Boolean}
     * */
    isEffective: function (data, generateTime) {
        // 标记 默认为true, 即是正在生效状态
        let flag = true;
        let {status, endTime, type, value} = data;
        if (!isValidVariable(status)) { // 状态无效
            flag = false;
            return flag;
        }

        if (type == this.TYPE_TRANSLATION && isValidVariable(endTime)) { // 成都版大规模延误
            // 求得终止时间
            let tempEndTime = addStringTime(endTime, value * 60 * 60 * 1000);
            // 若终止时间早于数据生成时间或 状态为人工终止、系统终止,则不是正在生效状态
            if (tempEndTime * 1 < generateTime * 1
                || status == this.FLOWCONTROL_STATUS_TERMINATED
                || status == this.FLOWCONTROL_STATUS_STOP
            ) {
                flag = false;
            }
        } else if (status == this.FLOWCONTROL_STATUS_STOP // 若状态为系统终止、人工终止、正常结束、已废弃,则不是正在生效状态
            || status == this.FLOWCONTROL_STATUS_TERMINATED
            || status == this.FLOWCONTROL_STATUS_FINISHED
            || status == this.FLOWCONTROL_STATUS_DISCARD
        ) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    },
    /**
     * 检测是否为相对状态
     * @param data  流控数据
     * @returns {Boolean}
     * */
    isRelative: function (data) {
        // 流控
        let {status, startTime, placeType, relativeStartTime, relativeStatus} = data;
        // 相对状态时间
        if (placeType == 'POINT' &&  // 航路流控
            relativeStatus != status &&  //相对状态与状态不相同
            isValidVariable(startTime) &&  // 开始时间有效
            isValidVariable(relativeStartTime) &&  // 开始时间有效
            startTime != relativeStartTime // 相对状态开始时间与开始时间不相同
        ) {
            return true;
        }else {
            return false;
        }
    },

    /**
     * 合并流控数据和操作权限
     *
     * @param flowcontrol  流控数据
     * @param auth  流控数据
     * @returns {Object}
     *
     * */
    connectAuth: function (dataMap,authMap) {
        if(!isValidObject(dataMap)){
            return;
        }
        let result = {};
        let map = Object.keys(dataMap);
        map.map((item) => {
            if(isValidObject(authMap)&& isValidObject(authMap[item])) {
                let auth = authMap[item];
                result[item] = {...dataMap[item],auth}
            }else {
                result[item] = dataMap[item]
            }

        });
        return result
    },


    /**
     * 流控数据转换----用于流控列表项
     * @param data  流控数据
     * @param generateTime 数据生成时间
     * @param systemConfig 系统信息数据
     * @returns {Object}
     */
    convertSingleFlowcontrolDataForList: function (data, generateTime, systemConfig) {
        // 校验数据
        if (!isValidObject(data)) {
            return {};
        }
        const {
            id, name, controlPoints, controlDirection,
        } = data;
        // 流控类型
        const placeTypeZh = this.getPlaceTypeZh(data);
        // 限制类型
        const limitTypeZh = this.getLimitTypeZh(data);
        // 限制数值
        const limitValue = this.getLimitValue(data);
        // 限制数值单位
        const limitValueUnit = this.getLimitValueUnit(data);
        // 状态
        const statusZh = this.getStatusZhForList(data, generateTime, systemConfig);
        // 状态class
        const statusClassName = this.getStatusClassName(data, generateTime);
        // 计算状态
        const casaStatusZh = this.getCasaStatusZh(data, generateTime);
        // 限制原因
        const reasonZh = this.getReasonZh(data);
        // 操作选项
        const operations = this.getOperations(data);

        // 弹框名称
        const dialogName = this.getTitleName(data);
        // 分类类型
        const category = this.getCategory(data);

        const result = {
            id, // 流控id
            name, // 流控名称
            controlPoints: controlPoints || '',  // 受控航路点
            controlDirection : controlDirection || '',  // 受控降落机场
            placeTypeZh,
            limitTypeZh,
            limitValue,
            limitValueUnit,
            statusZh,
            statusClassName,
            casaStatusZh,
            reasonZh,
            dialogName,
            category,
            operations,

        };

        return result;
    },

    /**
     * 流控数据转换-----用于流控详情页面
     * @param data  流控数据
     * @param generateTime 数据生成时间
     * @param systemConfig 系统信息数据
     * @returns {Object}
     */
    convertSingleFlowcontrolDataForDetail: function (data, generateTime, systemConfig) {
        // 校验数据
        if (!isValidObject(data)) {
            return {};
        }
        const {
            id, name, publishUser, publishUserZh, source,  controlPoints, flowcontrolDirection,
            controlDepDirection, controlDirection, exemptDepDirection, originalPublishUnit,
            exemptDirection, controlLevel, comments, reserveSlots, startTime, endTime,
            lastModifyTime, startFlowCasaTime, relativeStartTime, relativeEndTime,
        } = data;
        // 创建时间
        const creationTime = data.generateTime;

        // 流控类型
        const placeTypeZh = this.getPlaceTypeZh(data);
        // 限制类型
        const limitTypeZh = this.getLimitTypeZh(data);
        // 限制数值
        const limitValue = this.getLimitValue(data);
        // 限制数值单位
        const limitValueUnit = this.getLimitValueUnit(data);
        // 状态
        const statusZh = this.getStatusZhForDetail(data, generateTime);
        // 状态className
        const statusClassName = this.getStatusClassName(data, generateTime);
        // 相对状态
        const relativeStatusZh = this.getRelativeStatusZhForDetail(data);
        // 相对状态className
        const relativeStatusClassName = this.getRelativeStatusClassName(data);
        // 计算状态
        const casaStatusZh = this.getCasaStatusZh(data, generateTime);
        // 限制原因
        const reasonZh = this.getReasonZh(data);
        // 生效时间
        const effectiveTime = this.getEffectiveTime(data);
        // 操作选项
        const operations = this.getOperations(data);
        // 流控类型 长期/非长期
        const flowcontrolTypeZh = this.getFlowcontrolTypeZh(data);
        // 是否为相对状态
        const isRelative = this.isRelative(data);
        // 变更策略
        const strategyZh = this.getStrategyZh(data);
        // 压缩时间范围
        const compressTimes = this.getCompressTimes(data);

        const result = {
            id: id || '', // 流控id
            name: name || '', // 流控名称
            placeTypeZh : placeTypeZh, // 流控类型
            publishUser: publishUser || '', // 发布者英文名
            publishUserZh: publishUserZh || '', // 发布者中文名
            source: source || '', // 数据来源
            originalPublishUnit : originalPublishUnit || '', // 原发布单位
            startTime : startTime || '', // 开始时间
            endTime : endTime || '', // 结束时间
            creationTime : creationTime || '', // 创建时间
            lastModifyTime : lastModifyTime || '', // 修改时间
            startFlowCasaTime : startFlowCasaTime || '', //纳入计算时间
            relativeStartTime : relativeStartTime || '', // 相对开始时间
            relativeEndTime : relativeEndTime || '', // 相对结束时间
            flowcontrolTypeZh : flowcontrolTypeZh, // 流控类型
            controlPoints: controlPoints || '',  // 受控航路点
            controlDirection : controlDirection || '',  // 受控降落机场
            flowcontrolDirection: flowcontrolDirection || '', // 受控方向
            controlDepDirection: controlDepDirection || '', // 受控起飞机场
            exemptDepDirection: exemptDepDirection || '', // 豁免起飞机场
            exemptDirection: exemptDirection || '', // 豁免降落机场
            controlLevel : controlLevel || '', // 限制高度
            reserveSlots : reserveSlots || '',
            comments : comments || '', // 备注
            limitTypeZh, // 限制类型
            limitValue, // 限制数值
            limitValueUnit, // 限制数值单位
            statusZh, // 状态
            statusClassName, // 状态className
            relativeStatusZh, // 相对状态
            relativeStatusClassName, // 相对状态className
            casaStatusZh, // 计算状态
            reasonZh, // 限制原因
            effectiveTime, // 生效时间
            operations, // 操作项
            isRelative, // 是否为相对状态
            strategyZh, // 变更策略
            compressTimes, // 压缩时间范围
        };

        return result;
    }
}

export  { FlowcontrolDataUtil };
