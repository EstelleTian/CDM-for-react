import { isValidVariable } from './basic-verify';
/**
 * FlightCoordination对象常量
 */
const FlightCoordination = {
    /**
     * FME航班状态常量
     */
    FME_GROUND: 0,
    FME_FPL: 1,
    FME_DEP: 2,
    FME_ARR: 3,
    FME_DELAY: 4,
    FME_RTN: 5,
    FME_CNL: 6,

    /**
     * 航班状态
     */
    STATUS_FORMER_SCH: 0, // 前段计划
    STATUS_FORMER_CNL: 1, // 前段取消
    STATUS_FORMER_FPL: 2, // 前段准备
    STATUS_FORMER_BOARDING: 3, // 前段上客
    STATUS_FORMER_CLOSE: 4, // 前段关门
    STATUS_FORMER_OUT: 5, // 前段推出
    STATUS_FORMER_DEP: 6, // 前段起飞
    STATUS_FORMER_RTN: 7, // 前段返航
    STATUS_FORMER_ALN: 8, // 前段备降
    STATUS_FORMER_ARR: 9, // 前段降落
    STATUS_FORMER_ARR_RTN: 10, // 前段返航降落
    STATUS_FORMER_ARR_ALN: 11, // 前段备降降落
    STATUS_FORMER_INN: 12, // 前段推入
    STATUS_SCH: 13, // 计划
    STATUS_CNL: 14, // 取消
    STATUS_FPL: 15, // 准备
    STATUS_BOARDING: 16, // 上客
    STATUS_CLOSE: 17, // 关门
    STATUS_OUT: 18, // 推出
    STATUS_DEP: 19, // 起飞
    STATUS_RTN: 20, // 返航
    STATUS_ALN: 21, // 备降
    STATUS_ARR: 22, // 降落
    STATUS_ARR_RTN: 23, // 返航降落
    STATUS_ARR_ALN: 24, // 备降降落
    STATUS_INN: 25, // 推入

    /**
     * 优先级
     */
    PRIORITY_PRIVATE: 60, // 专机
    PRIORITY_VIP: 50, // 要客
    PRIORITY_EXEMPT: 48, // 豁免
    PRIORITY_ICE: 45, // 除冰
    PRIORITY_INTERNATIONAL: 40, // 国际
    PRIORITY_TO_INTERNATIONAL: 30, // 国内转国际
    PRIORITY_DELAY: 20, // 延误
    PRIORITY_AOC: 10, // 航空公司特别协调
    PRIORITY_NORMAL: 0, // 普通

    /**
     * 等待池状态
     */
    OUT_POOL: 0, // 未进等待池
    IN_POOL: 1, // 系统进等待池
    IN_POOL_M: 2, // 协调进等待池

    /**
     * 放行航班数据类型
     */
    CLEARANCE_DEFAULT: 0,   // 默认
    CLEARANCE_FLIGHTS: 100, // 参与放行
    CLEARANCE_OVERFLY: 200, // 飞越
    CLEARANCE_EXCLUDE: 300, //  Exlude

    /**
     * 航班类型
     */
    FLIGHT_DEFAULT: 0, // 默认
    FLIGHT_DEPAP: 1, // 离港
    FLIGHT_ARRAP: 2, // 进港

    /**
     * 延误原因
     */
    DELAY_REASON_MILITARY: 'MILITARY',
    DELAY_REASON_WEATHER: 'WEATHER',
    DELAY_REASON_CONTROL: 'CONTROL',
    DELAY_REASON_EQUIPMENT: 'EQUIPMENT',
    DELAY_REASON_FORMER: 'FORMER',
    DELAY_REASON_AOC: 'AOC',
    DELAY_REASON_OTHERS: 'OTHERS',

    /**
     * 放行状态
     */
    CLEARANCE_UNAPPLY: 0, // 待申请
    CLEARANCE_UNAPPLY_CREW_APPLY: 200, // 机组已请求
    CLEARANCE_UNAPPLY_ENTRUST_APPLY: 300, // 已委托
    CLEARANCE_APPLYED: 400, // 已申请
    CLEARANCE_APPROVED: 500, // 已批复
    CLEARANCE_HANDOVER: 600, // 已移交

    /**
     * AutoSolt时间来源
     */
    AUTOSOLT_SOURCE_CDM: 1,
    AUTOSOLT_SOURCE_CRS: 2,

    /**
     * LOCKED 常量
     */
    UNLOCK: 0, // 非人工修改
    LOCKED: 1, // 人工修改
    LOCKED_IMPACT: 2, // 人工修改+锁定
    LOCKED_NOSLOT: 3, // 退出时隙分配

    /**
     * TOBT 时间来源常量
     */
    TOBT_FPL: 'FPL',
    TOBT_PREDICT: 'PREDICT',
    TOBT_MANUAL: 'MANUAL',

    /**
     * EFPS航班状态常量
     */
    //离港计划
//    EFPS_STATUS_PRE: 'PRE', // 预激活
//    EFPS_STATUS_REQ: 'REQ', // 申请放行
//    EFPS_STATUS_CLD: 'CLD', // 已发放行
//    EFPS_STATUS_HLD: 'HLD', // 等待
//    EFPS_STATUS_PUS: 'PUS', // 推出
//    EFPS_STATUS_STR: 'STR', // 开车
//    EFPS_STATUS_P_S: 'P_S', // 推出开车
//    EFPS_STATUS_TAX: 'TAX', // 滑行
//    EFPS_STATUS_QUE: 'QUE', // 排队
//    EFPS_STATUS_CTL: 'CTL', // 塔台管制
//    EFPS_STATUS_LIN: 'LIN', // 上跑道
//    EFPS_STATUS_DEP: 'DEP', // 起飞
//    EFPS_STATUS_BRK: 'BRK', // 中断起飞
//    //进港计划
//    EFPS_STATUS_UCL: 'UCL', // 未管制（还处进近管制）
//    EFPS_STATUS_CTL: 'CTL', // 塔台管制
//    EFPS_STATUS_LND: 'LND', // 发了落地许可
//    EFPS_STATUS_TOD: 'TOD', // 接地
//    EFPS_STATUS_MIS: 'MIS', // 复飞
//    EFPS_STATUS_TTX: 'TTX', // 脱离跑道
//    EFPS_STATUS_TAX: 'TAX', // 地面滑行
//    EFPS_STATUS_OVE: 'OVE', // 入位
    
    /**
     * EFPS航班状态常量(新)
     */
    //离港计划
    EFPS_STATUS_PRE: 'PRE', // 预激活
    EFPS_STATUS_REQ: 'REQ', // 申请放行
    EFPS_STATUS_CLD: 'CLD', // 已发放行
    EFPS_STATUS_RDY: 'RDY', // 准备好
    EFPS_STATUS_NPU: 'NPU', // 未推出
    EFPS_STATUS_PUS: 'PUS', // 推出
    EFPS_STATUS_STR: 'STR', // 开车
    EFPS_STATUS_P_S: 'P^S', // 推出开车
    EFPS_STATUS_TAX: 'TAX', // 滑行
    EFPS_STATUS_BAC: 'BAC', // 滑回
    EFPS_STATUS_CTL: 'CTL', // 管制
    EFPS_STATUS_LIN: 'LIN', // 上跑道
    EFPS_STATUS_TKF: 'TKF', // 起飞
    EFPS_STATUS_BRK: 'BRK', // 起飞中断
    EFPS_STATUS_TTX: 'TTX', // 塔台滑行
    //进港计划
    EFPS_STATUS_FCL: 'FCL', // 未管制
    EFPS_STATUS_LND: 'LND', // 降落
    EFPS_STATUS_TOD: 'TOD', // 落地
    EFPS_STATUS_OVE: 'OVE', // 入位
    
    // 航班过滤
    FLIGHT_FILTER_ALL: 0, 	// 显示全部航班
    FLIGHT_FILTER_FLOWCONTROL: 1, // 显示受控航班
    
    // 预锁状态
    STATUS_COBT_PRE_LOCK: 0,

    // 除冰状态
    STATUS_DEICE_ON: 1,  // 默认除冰
    STATUS_DEICE_OFF: 0,  // 默认不除冰
    STATUS_DEICE_ON_MANUAL: 100, // 人工指定除冰
    STATUS_DEICE_OFF_MANUAL: 200, // 人工指定不除冰
    
    
    /**
     * 获取优先级中文
     *
     * @param priority
     * @returns
     */
    getPriorityZh: function(priority, arrap){
        if (!isValidVariable(priority)) {
            return null;
        }
        var p = parseInt(priority, 10);
        var zh = null;
        switch (p) {
            case this.PRIORITY_NORMAL:
                // 飞往香港（VHHH）、澳门（VMMC）、台湾（RC开头）的航班，在优先级列显示为“地区”航班
                if (isValidVariable(arrap)
                    && ( arrap == 'VHHH'
                    || arrap == 'VMMC'
                    || arrap.substring(0, 2) == 'RC')) {
                    zh = '地区';
                } else {
                    zh = '普通';
                }
                break;
            case this.PRIORITY_AOC:
                zh = '特别协调';
                break;
            case this.PRIORITY_DELAY:
                zh = '延误';
                break;
            case this.PRIORITY_TO_INTERNATIONAL:
                zh = '国内转国际';
                break;
            case this.PRIORITY_INTERNATIONAL:
                zh = '国际';
                break;
            case this.PRIORITY_ICE:
                zh = '除冰';
                break;
            case this.PRIORITY_VIP:
                zh = '要客';
                break;
            case this.PRIORITY_PRIVATE:
                zh = '专机';
                break;
            case this.PRIORITY_EXEMPT:
                zh = '豁免';
                break;
            default:
                break;
        }
        return zh;
    },

    /**
     * 获取状态中文
     *
     * @param status
     * @returns
     */
    getStatusZh: function(flight){
        if (!isValidVariable(flight) || !isValidVariable(flight.status)) {
            return null;
        }
        var zh = null;
        //var fme = flight.fmeToday;
        var s = parseInt(flight.status, 10);
        switch (s) {
            case this.STATUS_FORMER_SCH:
                zh = '前段计划';
                break;
            case this.STATUS_FORMER_CNL:
                zh = '前段取消';
                break;
            case this.STATUS_FORMER_FPL:
                zh = '前段准备';
                break;
            case this.STATUS_FORMER_BOARDING:
                zh = '前段上客';
                break;
            case this.STATUS_FORMER_CLOSE:
                zh = '前段关门';
                break;
            case this.STATUS_FORMER_OUT:
                zh = '前段推出';
                break;
            case this.STATUS_FORMER_DEP:
                zh = '前段起飞';
                break;
            case this.STATUS_FORMER_RTN:
                zh = '前段返航';
                break;
            case this.STATUS_FORMER_ALN:
                zh = '前段备降';
                break;
            case this.STATUS_FORMER_ARR:
                zh = '前段降落';
                break;
            case this.STATUS_FORMER_ARR_RTN:
                zh = '前段返航降落';
                break;
            case this.STATUS_FORMER_ARR_ALN:
                zh = '前段备降降落';
                break;
            case this.STATUS_FORMER_INN:
                zh = '前段入站';
                break;
            case this.STATUS_SCH:
                zh = '计划';
                break;
            case this.STATUS_CNL:
                zh = '取消';
                break;
            case this.STATUS_FPL:
                zh = '准备';
                break;
            case this.STATUS_BOARDING:
                zh = '上客';
                break;
            case this.STATUS_CLOSE:
                zh = '关门';
                break;
            case this.STATUS_OUT:
                zh = '推出';
                break;
            case this.STATUS_DEP:
                zh = '起飞';
                break;
            case this.STATUS_RTN:
                zh = '备降';
                break;
            case this.STATUS_ALN:
                zh = '返航';
                break;
            case this.STATUS_ARR:
                zh = '降落';
                break;
            case this.STATUS_ARR_RTN:
                zh = '返航降落';
                break;
            case this.STATUS_ARR_ALN:
                zh = '备降降落';
                break;
            default:
                break;
        }
        return zh;
    },

    /**
     * 获取EFPS status中文
     *
     * @param status
     * @returns
     */
//    getEfpsStatusZh: function(status) {
//        var zh = null;
//        switch (status) {
//            case this.EFPS_STATUS_PRE:
//                zh = '预激活';
//                break;
//            case this.EFPS_STATUS_REQ:
//                zh = '申请放行';
//                break;
//            case this.EFPS_STATUS_CLD:
//                zh = '已发放行';
//                break;
//            case this.EFPS_STATUS_HLD:
//                zh = '等待';
//                break;
//            case this.EFPS_STATUS_PUS:
//                zh = '推出';
//                break;
//            case this.EFPS_STATUS_STR:
//                zh = '开车';
//                break;
//            case this.EFPS_STATUS_P_S:
//                zh = '推出开车';
//                break;
//            case this.EFPS_STATUS_TAX:
//                zh = '滑行';
//                break;
//            case this.EFPS_STATUS_QUE:
//                zh = '排队';
//                break;
//            case this.EFPS_STATUS_CTL:
//                zh = '塔台管制';
//                break;
//            case this.EFPS_STATUS_LIN:
//                zh = '上跑道';
//                break;
//            case this.EFPS_STATUS_DEP:
//                zh = '起飞';
//                break;
//            case this.EFPS_STATUS_BRK:
//                zh = '中断起飞';
//                break;
//            case this.EFPS_STATUS_UCL:
//                zh = '未管制(还处进近管制)';
//                break;
//            case this.EFPS_STATUS_CTL:
//                zh = '塔台管制';
//                break;
//            case this.EFPS_STATUS_LND:
//                zh = '发了落地许可';
//                break;
//            case this.EFPS_STATUS_TOD:
//                zh = '接地';
//                break;
//            case this.EFPS_STATUS_MIS:
//                zh = '复飞';
//                break;
//            case this.EFPS_STATUS_TTX:
//                zh = '脱离跑道';
//                break;
//            case this.EFPS_STATUS_TAX:
//                zh = '地面滑行';
//                break;
//            case this.EFPS_STATUS_OVE:
//                zh = '入位';
//                break;
//            default:
//                break;
//        }
//        return zh;
//    },

    /**
     * 获取EFPS status中文(新)
     *
     * @param status
     * @returns
     */
    getEfpsStatusZh: function(status){
        var zh = null;
        switch (status) {
            case this.EFPS_STATUS_PRE:
                zh = '预激活';
                break;
            case this.EFPS_STATUS_REQ:
                zh = '申请放行';
                break;
            case this.EFPS_STATUS_CLD:
                zh = '已发放行';
                break;
            case this.EFPS_STATUS_RDY:
                zh = '准备好';
                break;
            case this.EFPS_STATUS_NPU:
                zh = '未推出';
                break;
            case this.EFPS_STATUS_PUS:
                zh = '推出';
                break;
            case this.EFPS_STATUS_STR:
                zh = '开车';
                break;
            case this.EFPS_STATUS_P_S:
                zh = '推出开车';
                break;
            case this.EFPS_STATUS_TAX:
                zh = '滑行';
                break;
            case this.EFPS_STATUS_BAC:
                zh = '滑回';
                break;
            case this.EFPS_STATUS_CTL:
                zh = '管制';
                break;
            case this.EFPS_STATUS_LIN:
                zh = '上跑道';
                break;
            case this.EFPS_STATUS_TKF:
                zh = '起飞';
                break;
            case this.EFPS_STATUS_BRK:
                zh = '起飞中断';
                break;
            case this.EFPS_STATUS_TTX:
                zh = '塔台滑行';
                break;
            case this.EFPS_STATUS_FCL:
                zh = '未管制';
                break;
            case this.EFPS_STATUS_LND:
                zh = '降落';
                break;
            case this.EFPS_STATUS_TOD:
                zh = '落地';
                break;
            case this.EFPS_STATUS_OVE:
                zh = '入位';
                break;
            default:
                break;
        }
        return zh;
    },

    /**
     * 获取放行状态中文-简
     *
     * @param status
     * @returns
     */
    getClearanceStatusZh: function(status){
        var s = parseInt(status, 10);
        var zh = null;
        switch (s) {
            case this.CLEARANCE_UNAPPLY:
                zh = '';
                break;
            case this.CLEARANCE_UNAPPLY_CREW_APPLY:
                zh = '';
                break;
            case this.CLEARANCE_UNAPPLY_ENTRUST_APPLY:
                zh = '';
                break;
            case this.CLEARANCE_APPLYED:
                zh = '审';
                break;
            case this.CLEARANCE_APPROVED:
                zh = '批';
                break;
            case this.CLEARANCE_HANDOVER:
                zh = '放';
                break;
            default:
                break;
        }
        return zh;
    },

    /**
     * 获取放行状态中文
     *
     * @param status
     * @returns
     */
    getClearanceStatusZhFull: function(status){
        var s = parseInt(status, 10);
        var zh = null;
        switch (s) {
            case this.CLEARANCE_UNAPPLY:
                zh = '未申请';
                break;
            case this.CLEARANCE_UNAPPLY_CREW_APPLY:
                zh = '未申请';
                break;
            case this.CLEARANCE_UNAPPLY_ENTRUST_APPLY:
                zh = '未申请';
                break;
            case this.CLEARANCE_APPLYED:
                zh = '已申请';
                break;
            case this.CLEARANCE_APPROVED:
                zh = '已批复';
                break;
            case this.CLEARANCE_HANDOVER:
                zh = '已放行';
                break;
            default:
                zh = status;
                break;
        }
        return zh;
    },

    /**
     * 获取标记放行/取消状态中文
     *
     * @param status
     * @returns
     */
    getMarkClearanceStatusZhFull: (status) => {
        var s = parseInt(status, 10);
        var zh = null;
        switch (s) {
            case 0:
                zh = '未放行';
                break;
            case 1:
                zh = '已放行';
                break;
            default:
                zh = status;
                break;
        }
        return zh;
    },

    /**
     * 获取延误原因中文
     *
     * @param delayReason
     * @returns
     */
    getDelayReasonZh: function(delayReason){
        var zh = '';
        switch (delayReason) {
            case this.DELAY_REASON_MILITARY:
                zh = '军方';
                break;
            case this.DELAY_REASON_WEATHER:
                zh = '天气';
                break;
            case this.DELAY_REASON_CONTROL:
                zh = '流量';
                break;
            case this.DELAY_REASON_EQUIPMENT:
                zh = '设备';
                break;
            case this.DELAY_REASON_FORMER:
                zh = '前序';
                break;
            case this.DELAY_REASON_AOC:
                zh = '公司';
                break;
            default:
                zh = delayReason;
                break;
        }
        return zh;
    },

    /**
     * 获取等待池状态中文
     *
     * @param status
     * @returns
     */
    getPoolStatusZh: (status) => {
        var zh = '';
        if (status == '0') {
            zh = '出池';
        } else if (status == '1') {
            zh = '系统入池';
        } else if (status == '2') {
            zh = '协调入池';
        }
        return zh;
    },

    /**
     * 获取除冰状态中文
     * @param {} value
     */
    getDeiceZh: function(deice){
        var zh = '';
        var status = '';
        var position = '';
        var group = '';
        var deiceData = new Array();
        if (isValidVariable(deice)) {
            deiceData = deice.split(',');
        }
        if (deiceData.length == 3) {
            if (isValidVariable(deiceData[0])) {
            	if(deiceData[0] == this.STATUS_DEICE_ON) {
            		status = '除冰';
            	} else if(deiceData[0] == this.STATUS_DEICE_ON_MANUAL) {
            		status = '人工指定除冰';
            	} else if(deiceData[0] == this.STATUS_DEICE_OFF_MANUAL) {
            		status = '人工指定不除冰';
            	} else if(deiceData[0] == this.STATUS_DEICE_OFF) {
            		status = '默认不除冰';
            	}
                if (!isValidVariable(deiceData[1])) {
                    position = '待定';
                } else {
                    position = deiceData[1];
                }
                if (isValidVariable(deiceData[2])) {
                    group = deiceData[2];
                }
                zh = status + ',' + position + ',' + group;
            }
        } else if(deiceData.length == 1){
        	if(deiceData[0] == this.STATUS_DEICE_ON) {
        		status = '除冰';
        	} else if(deiceData[0] == this.STATUS_DEICE_ON_MANUAL) {
        		status = '人工指定除冰';
        	} else if(deiceData[0] == this.STATUS_DEICE_OFF_MANUAL) {
        		status = '人工指定不除冰';
        	} else if(deiceData[0] == this.STATUS_DEICE_OFF) {
        		status = '默认不除冰';
        	}
        	zh = status;
        }
        return zh;
    },

    /**
     * 获取时隙分配状态中文
     *
     * @param status
     * @returns
     */
    getMarkNeedSlotZh: (status) => {
        var zh = '';
        if (status == '0') {
            zh = '参加';
        } else if (status == '3') {
            zh = '退出';
        }
        return zh;
    },
    /**
     * 获取资质对应名称
     */
    getMarkQualFlightZh:( status ) => {
        var zh = '';
        if (status == '2') {
            zh = '二类飞行';
        }
        return zh;
    },

    /**
     * 按照RPS顺序获取航班起飞机场
     *
     * @param flight
     * @returns
     */
    getRPSDepap: (flight) => {
        var depap = null;
        if (isValidVariable(flight.fmeToday.RDepap)) {
            depap = flight.fmeToday.RDepap;
        } else if (isValidVariable(flight.fmeToday.PDepap)) {
            depap = flight.fmeToday.PDepap;
        } else if (isValidVariable(flight.fmeToday.SDepap)) {
            depap = flight.fmeToday.SDepap;
        }
        return depap;
    },

    /**
     * 按照RPS顺序获取航班降落机场
     *
     * @param flight
     * @returns
     */
    getRPSArrap: (flight) => {
        var arrap = null;
        if (isValidVariable(flight.fmeToday.RArrap)) {
            arrap = flight.fmeToday.RArrap;
        } else if (isValidVariable(flight.fmeToday.PArrap)) {
            arrap = flight.fmeToday.PArrap;
        } else if (isValidVariable(flight.fmeToday.SArrap)) {
            arrap = flight.fmeToday.SArrap;
        }
        return arrap;
    },

    /**
     * 获取有效的TOBT时间
     * <p>
     * TOBT来源：人工录入/系统推算/FPL报文
     *
     * @param flight
     */
    getValidTobt: (flight) => {
        var tobt = null;
        if (isValidVariable(flight.tobt)) {
            // 人工填写
            tobt = flight.tobt;
        } else if (isValidVariable(flight.ctobt)) {
            // 系统推算
            tobt = flight.ctobt;
        } else if (isValidVariable(flight.fmeToday.PDeptime)
            && isValidVariable(flight.fmeToday.teletype)
            && (flight.fmeToday.teletype.indexOf('FPL') > -1
            || flight.fmeToday.teletype.indexOf('CHG') > -1 || flight.fmeToday.teletype
                .indexOf('DLA') > -1)) {
            // 报文
            tobt = $.addStringTime(flight.fmeToday.PDeptime, -1 * 10 * 60 * 1000);
        }
        return tobt;
    },

    /**
     * 获取TOBT时间及来源
     */
    getTOBT: function(flight){
        var tobt = null;
        var tobtSource = null;
        if (isValidVariable(flight.tobt)) {
            tobt = flight.tobt;
            tobtSource = this.TOBT_MANUAL;
        } else if (isValidVariable(flight.ctobt)) {
            tobt = flight.ctobt;
            tobtSource = flight.ctobtSource;
        } else {
            return null;
        }
        return new Array(tobt, tobtSource);
    },

    /**
     * 判断航班号中是否包含carrier中的一个
     * @param carriers
     * @param flightid
     */
    isBelongToCarrier: (flight, carriers) => {
        for (var i in carriers) {
            if (flight.fmeToday.flightid.indexOf(carriers[i]) > -1) {
                return true;
            }
        }
        return false;
    },

    /**
     * 判断航班是否在等待池
     *
     * @param flight
     * @returns {Boolean}
     */
    isInPoolFlight: (flight) => {
        if (flight.poolStatus == FlightCoordination.IN_POOL) {
            return true;
        } else if (flight.poolStatus == FlightCoordination.IN_POOL_M) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * 获取起飞航班的汇聚点
     *
     * @param flight
     * @returns {String}
     */
    getConvergenceWaypointName: (flight) => {
        var cw = null;
        var cwa = env_custom['ENV_DEP_MONITORFIX_WAYPOINTS'].value.split(',');
        for (var index in cwa) {
            cw = cwa[index];
            if (isValidVariable(flight.monitorPointInfo)) {
                if (flight.monitorPointInfo.indexOf(cw) >= 0) {
                    return cw;
                }
            }
        }
        return null;
    },

    /**
     * 获取降落航班的汇聚点
     *
     * @param flight
     * @returns {String}
     */
    getArrivalConvergenceWaypointName: (flight) => {
        var convergenceWaypoints = new Array();
        var cwa = env_custom['ENV_ARR_MONITORFIX_WAYPOINTS'].value.split(',');
        for (var index in cwa) {
            cw = cwa[index];
            if (isValidVariable(flight.monitorPointInfo)) {
                if (flight.monitorPointInfo.indexOf(cw) >= 0) {
                    convergenceWaypoints[index] = cw;
                }
            }
        }
        return convergenceWaypoints;
    },

    /**
     * 获取降落航班的内控点
     *
     * @param flight
     * @returns {String}
     */
    getArrivalControlInnerWaypointName: (flight) => {
        var innerWaypoints = new Array();
        if (env_arrival_innerWaypoints == '') {
            return null;
        }
        var cwa = env_arrival_innerWaypoints.split(',');
        for (var index in cwa) {
            cw = cwa[index];
            if (isValidVariable(flight.monitorPointInfo)) {
                if (flight.monitorPointInfo.indexOf(cw) >= 0) {
                    innerWaypoints[index] = cw;
                }
            }
        }
        return innerWaypoints;
    },


    /**
     * 解析航班航路点飞行信息
     *
     * @param flight
     */
    parseMonitorPointInfo: (flight) => {
        var result = new Object();
        if (!isValidVariable(flight)
            || !isValidVariable(flight.monitorPointInfo)) {
            return result;
        }

        // 所经航路点信息
        var rarr = new Array();
        var mpis = flight.monitorPointInfo.split('?'); // 问号?转义
        for (var index in mpis) {
            var mpiO = {};
            var mpi = mpis[index]; // 单个点的所有信息
            if (!isValidVariable(mpi)) {
                continue;
            }
            var pis = mpi.split('/');
            for (var i in pis) {
                var pi = pis[i]; // 单个点的单项信息
                var is = pi.split(':');
                var key = is[0];
                var value = is[1];
                mpiO[key] = value;
            }
            rarr.push(mpiO);
        }

        // 按照E排序
        rarr.sort(function(a, b){
            if (isValidVariable(a.E) && isValidVariable(b.E)) {
                return a.E - b.E;
            } else if (isValidVariable(a.E) && !isValidVariable(b.E)) {
                return 1;
            } else if (!isValidVariable(a.E) && isValidVariable(b.E)) {
                return -1;
            } else {
                return 0;
            }
        });

        // 创建返回结果
        for (var index in rarr) {
            var r = rarr[index];
            result[r.ID] = r;
        }

        return result;
    },

    /**
     * 解析航班航路点飞行信息
     *
     * @param slot
     */
    parseAutoSlotMonitorPointInfo: (slot) => {
        var result = new Object();
        if (!isValidVariable(slot)
            || !isValidVariable(slot.mpCto)) {
            return result;
        }

        // 所经航路点信息
        var rarr = new Array();
        var mpis = slot.mpCto.split('?'); // 问号?转义
        for (var index in mpis) {
            var mpiO = {};
            var mpi = mpis[index]; // 单个点的所有信息
            if (!isValidVariable(mpi)) {
                continue;
            }
            var pis = mpi.split('/');
            for (var i in pis) {
                var pi = pis[i]; // 单个点的单项信息
                var is = pi.split(':');
                var key = is[0];
                var value = is[1];
                mpiO[key] = value;
            }
            rarr.push(mpiO);
        }

        // 按照E排序
        rarr.sort(function(a, b){
            if (isValidVariable(a.E) && isValidVariable(b.E)) {
                return a.E - b.E;
            } else if (isValidVariable(a.E) && !isValidVariable(b.E)) {
                return 1;
            } else if (!isValidVariable(a.E) && isValidVariable(b.E)) {
                return -1;
            } else {
                return 0;
            }
        });

        for (var index in rarr) {
            var r = rarr[index];
            result[r.ID] = r;
        }

        return result;
    },

    /**
     * 判断是否为用户关注航班
     *
     * @param flight
     * @returns {Boolean}
     */
    isUserFocusFlight: (flight) => {
        if (flight.fmeToday.flightid.indexOf('-') >= 0) {
            return false;
        } else {
            return true;
        }
    },
    /**
     * 判断航班是否推出（依据有无推出时间判断）
     * @param flight
     * @return {Boolean}
     */
    hasAOBT : ( flight ) => {
        // 判断来源
        if(flight.efpsFlight != null && isValidVariable(flight.efpsFlight.pusTime)) {
            return true;
        }else if (isValidVariable(flight.aobt)) { // 引接
            return true;
        } else if(isValidVariable(flight.aobtAirline)){ // 人工指定
            return true;
        } else if (isValidVariable(flight.fmeToday.ROuttime)) {
            return true;
        }else{
            return false;
        }
    },

};

export default FlightCoordination;