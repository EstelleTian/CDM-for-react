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

    //时隙状态
    SLOT_STATUS_AUTO: 1, //自动
    SLOT_STATUS_LOCKED: 2, //锁定
    SLOT_STATUS_PRELOCK: 3, //预锁
    SLOT_STATUS_MANUAL: 4, //人工
    SLOT_STATUS_NOSLOT: 5, //不参加
    
    
    /**
     * 获取优先级中文
     *
     * @param priority
     * @returns
     */
    getPriorityZh: function(priority, arrap){
        if (!isValidVariable(priority)) {
            return "";
        }
        const p = parseInt(priority, 10);
        let zh = "";
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
    getStatusZh: function(status){
        if (!isValidVariable(status)) {
            return "";
        }
        let zh = "";
        let s = parseInt(status, 10);
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
//        let zh = null;
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
        let zh = null;
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
        let s = parseInt(status, 10);
        let zh = null;
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
        let s = parseInt(status, 10);
        let zh = null;
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
        let s = parseInt(status, 10);
        let zh = null;
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
        let zh = '';
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
        let zh = '';
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
     * 获取时隙状态中文
     *
     * @param status
     * @returns
     */
    getSlotStatusZh: ( status ) => {
        let zh = '';
        if (status == '1') {
            zh = '自动';
        } else if (status == '2') {
            zh = '锁定';
        } else if (status == '3') {
            zh = '预锁';
        } else if (status == '4') {
            zh = '人工';
        } else if (status == '5') {
            zh = '不参加';
        }
        return zh;
    },
    /**
     * 获取放行状态中文
     *
     * @param status
     * @returns
     */
    getClearanceZh: ( status ) => {
        let zh = '';
        if (status == '1') {
            zh = '已放行';
        }
        return zh;
    },
    /**
     * 获取放行状态中文
     *
     * @param status
     * @returns
     */
    getQualificationsZh: ( status ) => {
        let zh = '';
        if (status == '2') {
            zh = '二类飞行';
        }
        return zh;
    },

    /**
     * 获取除冰状态中文
     * @param {} value
     */
    getDeiceZh: function(deice){
        let zh = '';
        let status = '';
        let position = '';
        let group = '';
        let deiceData = new Array();
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
        let zh = '';
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
        let zh = '';
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
        let depap = null;
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
        let arrap = null;
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
        let tobt = null;
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
        let tobt = null;
        let tobtSource = null;
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
        for (let i in carriers) {
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
        let cw = null;
        let cwa = env_custom['ENV_DEP_MONITORFIX_WAYPOINTS'].value.split(',');
        for (let index in cwa) {
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
        let convergenceWaypoints = new Array();
        let cwa = env_custom['ENV_ARR_MONITORFIX_WAYPOINTS'].value.split(',');
        for (let index in cwa) {
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
        let innerWaypoints = new Array();
        if (env_arrival_innerWaypoints == '') {
            return null;
        }
        let cwa = env_arrival_innerWaypoints.split(',');
        for (let index in cwa) {
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
        let result = new Object();
        if (!isValidVariable(flight)
            || !isValidVariable(flight.monitorPointInfo)) {
            return result;
        }

        // 所经航路点信息
        let rarr = new Array();
        let mpis = flight.monitorPointInfo.split('?'); // 问号?转义
        for (let index in mpis) {
            let mpiO = {};
            let mpi = mpis[index]; // 单个点的所有信息
            if (!isValidVariable(mpi)) {
                continue;
            }
            let pis = mpi.split('/');
            for (let i in pis) {
                let pi = pis[i]; // 单个点的单项信息
                let is = pi.split(':');
                let key = is[0];
                let value = is[1];
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
        for (let index in rarr) {
            let r = rarr[index];
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
        let result = new Object();
        if (!isValidVariable(slot)
            || !isValidVariable(slot.mpCto)) {
            return result;
        }

        // 所经航路点信息
        let rarr = new Array();
        let mpis = slot.mpCto.split('?'); // 问号?转义
        for (let index in mpis) {
            let mpiO = {};
            let mpi = mpis[index]; // 单个点的所有信息
            if (!isValidVariable(mpi)) {
                continue;
            }
            let pis = mpi.split('/');
            for (let i in pis) {
                let pi = pis[i]; // 单个点的单项信息
                let is = pi.split(':');
                let key = is[0];
                let value = is[1];
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

        for (let index in rarr) {
            let r = rarr[index];
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

//系统告警类型
const AlarmType = {

    /**
     * 航班延误接近90分钟
     */
    FLIGHT_DELAY : '1',

    /**
     * 航班接近HOBT未发关舱门
     */
    FLIGHT_CLOSE : '2',

    /**
     * 关舱门等待
     */
    FLIGHT_CLOSE_WAIT : '3',

    /**
     * 流控发布/变更
     */
    FLOW_CONTROL : '4',

    /**
     * 申请时间  > 计划时间 + 10分钟
     */
    FLIGHT_PDEPTIME : '5',

    /**
     * 实关时间 > 协关时间 + 5分钟
     */
    FLIGHT_HOBT : '6',

    /**
     * 时隙修改
     */
    FLIGHT_SLOT_UPDATE : '7'
};

//协调操作常量---不可操作原因字典
const OperationReason = {
    "WF": "暂无操作权限",
    "CRS": "航班为CRS航班",
    "DEP": "航班已起飞",
    "ARR": "航班已落地",
    "CNL": "航班已取消",
    "FPL": "航班已发FPL报",
    "UN_FPL": "航班尚未拍发FPL报",
    "LOCK": "航班已锁定",
    "OTHER": "其他",
    "LOCKEDNOEQL": "Locked不同",
    "RECORDVALUE": "记录值不同",
    "RECORDSTATUS": "记录状态不同",
    "ARDTMANUAL": "有准备完毕时间",
    "UNARDTMANUAL": "无准备完毕时间",
    "EXEMPT": "航班已豁免",
    "UNEXEMPT": "航班尚未豁免",
    "POOL": "航班已入池",
    "UNPOOL": "航班尚未入池",
    "UN_AUTH": "当前用户无操作权限",
};

//协调操作常量---航班号
const OperationTypeForFlightId = {
    // FLIGHT_DETAIL: {
    //     en: "FLIGHT_DETAIL",
    //     cn: "航班详情",
    //     type: "detail",
    //     simple: "详",
    //     url: "retrieveDetailById.bo"
    // },
    COORDINATION_DETAIL: {
        en: "COORDINATION_DETAIL",
        cn: "协调记录",
        type: "detail",
        simple: "协",
        url: "retrieveRecordById.bo"
    },
    // TELE_DETAIL: {
    //     en: "TELE_DETAIL",
    //     cn: "航班报文",
    //     type: "detail",
    //     simple: "报",
    //     url: "updateReadyComplete.bo"
    // },
    FORMER_UPDATE: {
        en: "FORMER_UPDATE",
        cn: "指定前序航班",
        type: "former",
        simple: "前",
        url: "updateFormerFlight.bo"
    },
    CANCEL_MARK: {
        en: "CANCEL_MARK",
        cn: "标记航班取消",
        type: "mark",
        simple: "取",
        url: "updateEditStatus.bo"
    },
    CANCEL_UN_MARK: {
        en: "CANCEL_UN_MARK",
        cn: "标记取消恢复",
        type: "huifu",
        simple: "恢",
        url: "updateEditStatus.bo"
    },
    READY_MARK: {
        en: "READY_MARK",
        cn: "标记准备完毕",
        type: "mark",
        simple: "准",
        url: "updateReadyComplete.bo"
    },
    READY_UN_MARK: {
        en: "READY_UN_MARK",
        cn: "标记未准备完毕",
        type: "cancel",
        simple: "准",
        url: "updateReadyNotComplete.bo"
    },
    OUTPOOL_APPLY: {
        en: "OUTPOOL_APPLY",
        cn: "申请移出等待池",
        type: "apply",
        simple: "池",
        url: "applyFlightOutpool.bo"
    },
    OUTPOOL_APPROVE: {
        en: "OUTPOOL_APPROVE",
        cn: "批复移出等待池",
        type: "approve",
        simple: "池",
        url: "approveFlightOutpool.bo"
    },
    OUTPOOL_REFUSE: {
        en: "OUTPOOL_REFUSE",
        cn: "拒绝移出等待池",
        type: "reject",
        simple: "池",
        url: "refuseFlightOutpool.bo"
    },
    INPOOL_UPDATE: {
        en: "INPOOL_UPDATE",
        cn: "移入等待池",
        type: "inpool",
        simple: "池",
        url: "updateFlightInpool.bo"
    },
    OUTPOOL_DIRECT: {
        en: "OUTPOOL_DIRECT",
        cn: "移出等待池",
        type: "outpool",
        simple: "池",
        url: "updateFlightOutpool.bo"
    },
    CLEARANCE_UN_MARK: {
        en: "CLEARANCE_UN_MARK",
        cn: "标记未放行",
        type: "cancel",
        simple: "放",
        url: "updateClearance.bo"
    },
    CLEARANCE_MARK: {
        en: "CLEARANCE_MARK",
        cn: "标记已放行",
        type: "mark",
        simple: "放",
        url: "updateClearance.bo"
    },
    ASSIGNSLOT_MARK: {
        en: "ASSIGNSLOT_MARK",
        cn: "参加时隙分配",
        type: "mark",
        simple: "时",
        url: "updateAssignSlotStatus.bo"
    },
    ASSIGNSLOT_UN_MARK: {
        en: "ASSIGNSLOT_UN_MARK",
        cn: "退出时隙分配",
        type: "cancel",
        simple: "时",
        url: "updateAssignSlotStatus.bo"
    },
    EXEMPT_MARK: {
        en: "EXEMPT_MARK",
        cn: "标记豁免",
        type: "mark",
        simple: "豁",
        url: "updateExempt.bo"
    },
    EXEMPT_UN_MARK: {
        en: "EXEMPT_UN_MARK",
        cn: "取消豁免",
        type: "cancel",
        simple: "豁",
        url: "updateExemptCancel.bo"
    },
    QUALIFICATIONS_MARK: {
        en: "QUALIFICATIONS_MARK",
        cn: "标记二类飞行资质",
        type: "mark",
        simple: "资",
        url: "updateQualifications.bo"
    },
    QUALIFICATIONS_UN_MARK: {
        en: "QUALIFICATIONS_UN_MARK",
        cn: "取消二类飞行资质",
        type: "cancel",
        simple: "资",
        url: "updateQualifications.bo"
    }
};
//协调操作常量---时间列 COBT CTOT AGCT ASBT AGCT HOBT TOBT
const OperationTypeForTimeColumn = {
    COBT_UPDATE: {
        en: "COBT",
        cn: "预撤时间变更",
        url: "updateFlightCobt.bo"
    },
    COBT_CLEAR: {
        en: "COBT",
        cn: "预撤时间变更",
        url: "clearFlightCobt.bo"
    },
    CTOT_UPDATE: {
        en: "CTOT",
        cn: "预起时间变更",
        url: "updateFlightCtd.bo"
    },
    CTOT_CLEAR: {
        en: "CTOT",
        cn: "预起时间变更",
        url: "clearFlightCtd.bo"
    },
    ASBT_UPDATE: {
        en: "ASBT",
        cn: "上客时间修改",
        url: "updateFlightAsbt.bo"
    },
    ASBT_CLEAR: {
        en: "ASBT",
        cn: "上客时间修改",
        url: "clearFlightAsbt.bo"
    },
    AGCT_UPDATE: {
        en: "AGCT",
        cn: "关门时间修改",
        url: "updateFlightAgct.bo"
    },
    AGCT_CLEAR: {
        en: "AGCT",
        cn: "关门时间修改",
        url: "clearFlightAgct.bo"
    },
    HOBT_APPLY: {
        en: "HOBT",
        cn: "HOBT申请变更",
        url: "applyFlightHobt.bo"
    },
    HOBT_APPROVE: {
        en: "HOBT",
        cn: "HOBT批复变更",
        url: "approveFlightHobt.bo"
    },
    HOBT_REFUSE: {
        en: "HOBT",
        cn: "HOBT批复变更",
        url: "refuseFlightHobt.bo"
    },
    TOBT_APPLY: {
        en: "TOBT",
        cn: "TOBT申请变更",
        url: "applyFlightTobt.bo"
    },
    TOBT_APPROVE: {
        en: "TOBT",
        cn: "TOBT批复变更",
        url: "approveFlightTobt.bo"
    },
    TOBT_REFUSE: {
        en: "TOBT",
        cn: "TOBT批复变更",
        url: "refuseFlightTobt.bo"
    },
    AOBT_UPDATE: {
        en: "AOBT",
        cn: "推出时间修改",
        url: "updateFlightAobt.bo"
    },
    AOBT_CLEAR: {
        en: "AOBT",
        cn: "推出时间修改",
        url: "clearFlightAobt.bo"
    },
    PRIORITY_APPLY: {
        en: "PRIORITY",
        cn: "优先级申请",
        url: "applyPriority.bo"
    },
    PRIORITY_APPROVE: {
        en: "PRIORITY",
        cn: "优先级批复",
        url: "approvePriority.bo"
    },
    PRIORITY_REFUSE: {
        en: "PRIORITY",
        cn: "优先级批复",
        url: "refusePriority.bo"
    },
    DELAY_REASON_UPDATE: {
        en: "DELAY_REASON",
        cn: "延误原因修改",
        url: "updateDelayReason.bo"
    },
    DELAY_REASON_CLEAR: {
        en: "DELAY_REASON",
        cn: "延误原因修改",
        url: "clearDelayReason.bo"
    },
    DEICE_UPDATE: {
        en: "DEICE",
        cn: "除冰状态修改",
        url: "updateFlightDeice.bo"
    },
    DEICE_CLEAR: {
        en: "DEICE",
        cn: "除冰状态修改",
        url: "clearFlightDeice.bo"
    },
    POSITION_UPDATE: {
        en: "POSITION",
        cn: "停机位修改",
        url: "updatePosition.bo"
    },
    POSITION_CLEAR: {
        en: "POSITION",
        cn: "停机位修改",
        url: "clearPosition.bo"
    },
    RUNWAY_UPDATE: {
        en: "RUNWAY",
        cn: "跑道修改",
        url: "updateFlightRunway.bo"
    },
    RUNWAY_CLEAR: {
        en: "RUNWAY",
        cn: "跑道修改",
        url: "clearFlightRunway.bo"
    },
};
//协调操作常量--优先级
const PriorityList = {
    "0": "普通",
    "10": "特别协调",
    "30": "国内转国际",
    "48": "豁免",
    "50": "航班要客"
};
//协调操作常量--延误原因
const DelayReasonList = {
    "MILITARY": "军方",
    "WEATHER": "天气",
    "CONTROL": "流量",
    "EQUIPMENT": "设备",
    "FORMER": "前序",
    "AOC": "公司",
    "OTHER": "其他"
};

//协调操作常量--指定前序航班
const FmeStatusList = {
    "0": "SCH",
    "1": "FPL",
    "2": "DEP",
    "3": "ARR",
    "4": "DLA",
    "5": "RTN_CPL",
    "6": "CNL"
};


export { FlightCoordination, AlarmType, OperationTypeForFlightId, OperationTypeForTimeColumn, PriorityList, DelayReasonList, OperationReason, FmeStatusList };