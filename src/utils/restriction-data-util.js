/**
 * 限制信息数据转换工具
 */

import { isValidVariable, isValidObject } from './basic-verify';
/**
 * Restriction对象常量
 */
const RestrictionConstant = {
    RESTRICTION_STATUS_RUNNING : 200,
    RESTRICTION_STATUS_FUTURE : 100,
    RESTRICTION_STATUS_FINISHED : 300,
    RESTRICTION_STATUS_STOP : 320,
    RESTRICTION_STATUS_TERMINATED : 310,
    /*=================================================*/
    RESTRICTION_TYPE_DEICE : "DEICE"
};


const RestrictionUtil = {
    /**
     * 限制状态
     * @param data 数据对象
     *
     * */
    setStatus: (data) => {
        // 取数据状态值
        let {status} = data;

        // 转换后的结果
        let res = '';
        if (status == RestrictionConstant.RESTRICTION_STATUS_RUNNING) {
            res = '正在执行';
        } else if (status == RestrictionConstant.RESTRICTION_STATUS_FUTURE) {
            res = '将要执行';
        } else if (status == RestrictionConstant.RESTRICTION_STATUS_FINISHED) {
            res = '已结束';
        } else if (status == RestrictionConstant.RESTRICTION_STATUS_TERMINATED
            || status == RestrictionConstant.RESTRICTION_STATUS_STOP
        ) {
            res = '已终止';
        } else if (!isValidVariable(status)) {
            res = '已取消';
        }
        return res;
    },

    /**
     * 限制状态对应的class名称
     * @param data 数据对象
     *
     * */
    setstatusClassName: (data) => {
        // 取数据状态值
        let {status} = data;

        // 转换后的结果
        let res = '';
        if (status == RestrictionConstant.RESTRICTION_STATUS_RUNNING) { // 正在执行
            res = 'running';
        } else if (status == RestrictionConstant.RESTRICTION_STATUS_FUTURE) { // 将要执行
            res = 'future';
        } else if (status == RestrictionConstant.RESTRICTION_STATUS_FINISHED) { // 正常结束
            res = 'finished';
        } else if (status == RestrictionConstant.RESTRICTION_STATUS_TERMINATED
            || status == RestrictionConstant.RESTRICTION_STATUS_STOP
        ) { // 已终止
            res = 'terminated';
        } else if (!isValidVariable(status)) { // 已取消
            res = 'cancel';
        }
        return res;
    }
}

// 限制数据转换
const convertRestrictionData =(data) => {
    // 校验数据
    if(!isValidObject(data)){
        return {};
    }

    /**
     * 数据创建时间
     * @param data 数据对象
     *
     * */
    const setCreatedDateTime= (data) => {
        // 取限制信息数据创建时间 (generateTime字段值)
        let { generateTime = '', } = data;
        // 转换后的结果
        let res = {};
        let date ='';
        let time = ''
        if(isValidVariable(generateTime) && 12 <= generateTime){
            time = formatTime4(generateTime);
            date = formatDate(generateTime);
        }
        res.date = date;
        res.time = time;
        return res;
    };

    /**
     * 限制开始时间
     * @param data 数据对象
     *
     * */
    const setDataTime= (data) => {
        // 取限制信息数据开始时间和结束时间
        let { startTime = "", endTime = "",} = data;


        // 转换后的结果
        let res = {};
        let sTime = '';
        let eTime = '';
        let startDate = '';
        let endDate = '';

        sTime = formatTime4(startTime);
        startDate = formatDate(startTime);
        eTime = formatTime4(endTime);
        endDate = formatDate(endTime);
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
        if(time && 12 <= time.length){
            const hh = time.substring(8,10);
            const mm = time.substring(10,12);
            result = `${hh}:${mm}`;
        }
        return result;
    }
    // 日期格式化 yy-mm-dd
    const formatDate = (datetime) => {
        let result = '';
        if(datetime && 12 <= datetime.length){
            const yy = datetime.substring(0,4);
            const mm = datetime.substring(4,6);
            const dd = datetime.substring(6,8);
            result = `${yy}-${mm}-${dd}`;
        }
        return result;
    }





    /**
     * 限制限制数值
     * @param data 数据对象
     * @
     *
     * */
    const setValue= (data) => {
        // 取数据的类型值和限制数值
        let { type, value } = data;

        // 转换后的结果
        let res = '';
        if (type == RestrictionConstant.RESTRICTION_TYPE_DEICE) {
            res = value ? `${value}(分钟)` : '';
        } else {
            res = value ? `${value}` : '';
        }
        return res;
    };

    // 转换后的结果对象
    let result = {};
    // 限制名称
    result.name = data.name || '';
    // 限制id
    result.id = data.id || '';
    // 发布者(中文)
    result.publishUserZh = data.publishUserZh || '';
    // 航空公司
    result.deiceFlights = data.deiceFlights || '';
    // 创建日期时间
    result.createdDateTime = setCreatedDateTime(data);
    // 创建日期
    result.createdDate = result.createdDateTime.date;
    // 创建时间
    result.createdTime = result.createdDateTime.time;

    // 限制时间
    result.dataTime = setDataTime(data);
    // 限制生效时间
    result.effectiveTime = `${result.dataTime.startTime}-${result.dataTime.endTime}`;
    // 限制生效日期
    result.effectiveDate = `${result.dataTime.startDate}/${result.dataTime.endDate}`;
    // 限制状态
    result.status = RestrictionUtil.setStatus(data);
    // 状态对应的样式名称
    result.statusClassName = RestrictionUtil.setstatusClassName(data);
    // 限制数值
    result.value = setValue(data);

    return result
};

// 校验限制是否为正在生效状态
const isEffective = (data) => {
    // 标记 默认为true, 即是正在生效状态
    let flag = true;
    let { status } = data;
    if(!isValidVariable(status)){ // 状态无效
        flag = false;
        return flag;
    }

    if(status == RestrictionConstant.RESTRICTION_STATUS_STOP // 若状态为已终止、正常结束,则不是正在生效状态
        || status == RestrictionConstant.RESTRICTION_STATUS_TERMINATED
        || status == RestrictionConstant.RESTRICTION_STATUS_FINISHED
    ){
        flag = false;
    } else {
        flag = true;
    }
    return flag;
}

export { RestrictionConstant, RestrictionUtil, convertRestrictionData, isEffective };
