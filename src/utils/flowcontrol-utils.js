import { isValidletiable, addStringTime } from './basic-verify';
/**
 * Flowcontrol对象常量及工具方法
 */
const FlowcontrolUtils = {

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

    PLACE_TYPE_AP: 'AP',
    PLACE_TYPE_POINT: 'POINT',

    TYPE_MIT: 'MIT', // 距离
    TYPE_TIME: 'TIME', // 时间
    TYPE_GS: 'GS', // 地面停止
    TYPE_REQ: 'REQ', // 开车申请
    TYPE_ASSIGN: 'ASSIGN', // 指定时隙
    TYPE_RESERVE: 'RESERVE',//预留时隙
    TYPE_LDR: 'LDR', // 大规模延误
    TYPE_TRANSLATION: 'TRANSLATION', // 成都版大规模延误

  //==========================================================
    REASON_ACC:'ACC',//空管</label>&nbsp;&nbsp;&nbsp;&nbsp;
    REASON_WEATHER:'WEATHER',//天气</label>&nbsp;&nbsp;&nbsp;&nbsp;
    REASON_AIRPORT:'AIRPORT',//机场</label>&nbsp;&nbsp;&nbsp;&nbsp;
    REASON_CONTROL:'CONTROL',//航班时刻</label>&nbsp;&nbsp;&nbsp;&nbsp;
    REASON_EQUIPMENT:'EQUIPMENT',//设备</label>&nbsp;&nbsp;&nbsp;&nbsp;
    REASON_MILITARY:'MILITARY',//其他空域用户</label>&nbsp;&nbsp;&nbsp;&nbsp;
    REASON_OTHERS:'OTHERS',//其他

//=============================================================================

    DOUBLEHEB_VALUE: "100", // doubleHEB唯一标识

    FLOW_TYPE_ARR: "ARR", //流控类型 降落流控
    FLOW_TYPE_DEP: "DEP", //流控类型 起飞流控

    COMPRESS_TYPE_ON: 'ON',
    COMPRESS_TYPE_OFF: 'OFF',

    /**
     * 获取类型中文
     * @param type
     */
    getTypeZh: function(type){
        let zh = null;

        switch (type) {
            case this.TYPE_MIT:
                zh = '限制距离';
                break;
            case this.TYPE_TIME:
                zh = '限制时间';
                break;
            case this.TYPE_GS:
                zh = '地面停止';
                break;
            case this.TYPE_REQ:
                zh = '开车申请';
                break;
            case this.TYPE_ASSIGN:
                zh = '指定时隙';
                break;
            case this.TYPE_RESERVE:
                zh = '预留时隙';
                break;
            case this.TYPE_LDR:
                zh = '大规模延误';
                break;
            case this.TYPE_TRANSLATION:
                zh = '大规模延误';
                break;
            default:
                break;
        }

        return zh;
    },

    /**
     * 获取原因中文
     *
     * @param reason
     * @returns
     */
    getReasonZh: function(reason){
    	 let zh = null;

         switch (reason) {
         case this.REASON_WEATHER:
             zh = '天气';
             break;
         case this.REASON_MILITARY:
             zh = '其他空域用户';//军方
             break;
         case this.REASON_CONTROL:
             zh = '航班时刻';//流量
             break;
         case this.REASON_EQUIPMENT:
             zh = '设备';
             break;
         case this.REASON_ACC:
         	zh = '空管';
         	break;
         case this.REASON_AIRPORT:
             zh = '机场';
             break;
         default:
             zh = '其他';
             break;
         }
         return zh;
    },

    /**
     * 获取流控中文状态
     *
     * @param flowcontrol
     * @param now
     * @returns
     */
    getStatusZh: function(flowcontrol, now){
        let zh = null;
        if (!isValidletiable(flowcontrol)) {
            return zh;
        }
        let type = flowcontrol.type;
        let status = flowcontrol.relativeStatus;
        if (type == this.TYPE_TRANSLATION
            && status == this.FLOWCONTROL_STATUS_FINISHED) {
            let tempEndTime = addStringTime(flowcontrol.endTime, flowcontrol.value * 60 * 60 * 1000);
            if (tempEndTime > date) {
                zh = '恢复中';
            } else {
                zh = '已结束';
            }
        } else {
            if (status == this.FLOWCONTROL_STATUS_FUTURE) {
                zh = '将要执行';
            } else if (status == this.FLOWCONTROL_STATUS_RUNNING) {
                zh = '正在执行';
            } else if (status == this.FLOWCONTROL_STATUS_FINISHED) {
                zh = '已结束';
            } else if (status == this.FLOWCONTROL_STATUS_STOP
                || status == this.FLOWCONTROL_STATUS_TERMINATED) {
                zh = '已终止';
            } else if (status == this.FLOWCONTROL_STATUS_PRE_TERMINATED
                || status == this.FLOWCONTROL_STATUS_PRE_UPDATE) {
                zh = '将要终止';
            } else if (status == this.FLOWCONTROL_STATUS_DISCARD) {
                zh = '已废弃';
            }

        }
        return zh;
    },

    getStatusZh2: function(status){
        let zh = "";
        if (status == this.FLOWCONTROL_STATUS_PRE_PUBLISH) {
            zh = '将要发布';
        } else if (status == this.FLOWCONTROL_STATUS_FUTURE) {
            zh = '将要执行';
        } else if (status == this.FLOWCONTROL_STATUS_RUNNING) {
            zh = '正在执行';
        } else if (status == this.FLOWCONTROL_STATUS_FINISHED) {
            zh = '正常结束';
        } else if (status == this.FLOWCONTROL_STATUS_STOP) {
            zh = '系统终止';
        } else if (status == this.FLOWCONTROL_STATUS_TERMINATED) {
            zh = '人工终止';
        } else if (status == this.FLOWCONTROL_STATUS_PRE_TERMINATED
            || status == this.FLOWCONTROL_STATUS_PRE_UPDATE) {
            zh = '将要终止';
        } else if (status == this.FLOWCONTROL_STATUS_DISCARD) {
            zh = '已废弃';
        }
        return zh;
    },

    /**
     * 获取流控控制元素（航路点、起飞机场、降落机场）
     *
     * @param flowcontrol
     */
    getControlElement: (flowcontrol) => {
        if (flowcontrol == undefined || flowcontrol == null) {
            return null;
        }
        // 流控类型
        let flowType = flowcontrol.flowType;
        // 受控航路点
        let controlPoints = flowcontrol.controlPoints;
        // 受控起飞机场
        let controlDepDirection = flowcontrol.controlDepDirection;
        // 受控降落机场
        let controlDirection = flowcontrol.controlDirection;
        // 判断流控限制类型
        // 受控航路点为空时 使用受控机场
        if (isValidletiable(controlPoints)) {
            return controlPoints;
        } else {
            if (flowType == FlowcontrolUtils.FLOW_TYPE_ARR) {
                controlPoints = controlDirection;
            } else {
                controlPoints = controlDepDirection;
            }
            return  controlPoints;
        }
    },

    /**
     * 是否为正在或将要生效的流控数据
     *
     * @param flowcontrol
     */
    isFutureOrRunning: (flowcontrol) => {
        if (!isValidletiable(flowcontrol.status)
            || flowcontrol.status == FlowcontrolUtils.FLOWCONTROL_STATUS_STOP
            || flowcontrol.status == FlowcontrolUtils.FLOWCONTROL_STATUS_TERMINATED
            || flowcontrol.status == FlowcontrolUtils.FLOWCONTROL_STATUS_FINISHED
            || flowcontrol.status == FlowcontrolUtils.FLOWCONTROL_STATUS_DISCARD) {
            return false;
        } else {
            return true;
        }
    },

    isCalculated: (flowcontrol) => {
        return isValidletiable(flowcontrol.startFlowCasaTime);
    },

    /**
     * 判断流控是否符合该方向
     *
     * @param flowcontrol
     * @param direction
     * @returns {boolean}
     */
    checkFlowcontrolDirection: (flowcontrol, direction) => {
    	let flowDirectionArray = null;
    	if(isValidletiable(flowcontrol.flowcontrolDirection)){
    		flowDirectionArray = flowcontrol.flowcontrolDirection.split(',');
    	}
        if (direction == 'ALL') {
            return true;
        } else if (isValidletiable(flowDirectionArray)
        		&& $.inArray(direction, flowDirectionArray) > -1) {
            return true;
        } else {
            return false;
        }
    },

    calculateCurrentValidCRSFlow : (flight) => {
    	 let flowcontrolIds = new Array();
    	if(flight&&flight.flowcontrols){    	
    	let flowcontrols = flight.flowcontrols;       
        for (let flowId in flowcontrols) {
     	   let flowcontrol = flowcontrols[flowId];
     	   let flowStatus = flowcontrol[5];
     	   let flowType = flowcontrol[7];
     	   if (flowStatus==FlowcontrolUtils.FLOWCONTROL_STATUS_RUNNING
     				|| flowStatus==FlowcontrolUtils.FLOWCONTROL_STATUS_FUTURE
     				|| flowStatus==FlowcontrolUtils.FLOWCONTROL_STATUS_PUBLISH
     				|| flowStatus==FlowcontrolUtils.FLOWCONTROL_STATUS_PRE_UPDATE
     				|| flowStatus==FlowcontrolUtils.FLOWCONTROL_STATUS_PRE_TERMINATED){
     		   if (flowType == FlowcontrolUtils.PLACE_TYPE_POINT) {
     			  flowcontrolIds.push(flowId);
     		   }
     	   }
        }
    	}
        return flowcontrolIds;
    },
    /**
     *
     * 判断流控最小间隔要求
     */
    calculateFlowcontrolMit: (mit) => {
        // 最小满足间隔
        let interval = null;
        // 容差
        let tolerance = null;
        if (mit < 5) {
            tolerance = 0;
        } else if (5 <= mit < 15) {
            tolerance = 2;
        } else if (15 <= mit < 20) {
            tolerance = 3;
        } else if (20 <= mit < 30) {
            tolerance = 4;
        } else {
            tolerance = 5;
        }
        interval = mit - tolerance;
        return interval;
    },
    /**
     * 判断时间片段之间是否有时间重叠
     * @param compareArr 数组 值为number
     * @param newArr 数组 值为number  新添加的起止时间
     * @returns {Array/String}
     */
    sortMultiDateRange : function( compareArr, newArr ){
        //返回数组
        let result;
        //对比数组长度
        let cLen = compareArr.length;
        if( cLen > 0 ){
            if(newArr.length == 2){
                let nStart = newArr[0] * 1;
                let nEnd = newArr[1] * 1;
                for(let i = 0; i < cLen; i+=2 ){
                    //轮询的开始时间
                    let curStart = compareArr[i] * 1;
                    //轮询的结束时间
                    let curEnd = compareArr[i+1] * 1;
                    //比较结果
                    let flag = FlowcontrolUtils.isInRange( curStart, curEnd, nStart, nEnd );
                    //如果在提示日期重叠
                    if( flag ){
                        return nStart+"-"+nEnd+"与"+curStart +"-"+curEnd+"有时间重叠";
                    }
                }
                compareArr.push(nStart);
                compareArr.push(nEnd);
                return compareArr;
            }else{
                return "第二个参数传入格式不正确";
            }
        }else{
            let nStart = newArr[0] * 1;
            let nEnd = newArr[1] * 1;
            compareArr.push(nStart);
            compareArr.push(nEnd);
            return compareArr;
        }
    },
    /**
     * 验证输入的两组起始时间是否有时间重叠
     * @param curStart
     * @param curEnd
     * @param nStart
     * @param nEnd
     * @returns {boolean}
     */
    isInRange : function( curStart, curEnd, nStart, nEnd ){
        let result = false;
        //结束时间在范围内
        if( nStart < curStart){
            if( nEnd > curStart){
                result = true;
            }
        }else if( nStart >= curStart && nStart <= curEnd ){ //开始时间在范围内
            result = true;
        }
        return result;
    }

};

export default FlowcontrolUtils;