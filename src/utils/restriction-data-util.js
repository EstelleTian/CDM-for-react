/**
 * 除冰限制数据转换工具
 */

import { isValidVariable, isValidObject, addStringTime } from './basic-verify';
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

// 除冰限制数据转换
const convertRestrictionData =(data, generateTime) => {
    // 校验数据
    if(!isValidObject(data)){
        return {};
    }



    /**
     * 除冰限制开始时间
     * @param data 数据对象
     * @param generateTime 数据生成时间
     *
     * */
    const setGenerateTime= (data) => {
        // 除冰限制
        let { generateTime = '', } = data;
        // 转换后的结果
        let res = '';
        if(isValidVariable(generateTime)){
            res = formatTime4(generateTime)
        }
        return res;
    };

    /**
     * 除冰限制开始时间
     * @param data 数据对象
     * @param generateTime 数据生成时间
     *
     * */
    const setDataTime= (data, generateTime) => {
        // 除冰限制
        let { status,  startTime = "", endTime = "",  placeType, relativeStartTime, relativeStatus } = data;


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
     * 除冰限制状态
     * @param data 数据对象
     *
     * */
    const setStatus= (data) => {
        // 除冰限制
        let { status} = data;

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
        }  else if( !isValidVariable(status)){
            res = '已取消';
        }
        return res;
    };

    /**
     * 除冰限制状态对应的class名称
     * @param data 数据对象
     *
     * */
    const setstatusClassName= (data) => {
        // 除冰限制
        let { status} = data;

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
        }  else if( !isValidVariable(status)){ // 已取消
            res = 'cancel';
        }
        return res;
    };


    /**
     * 除冰限制限制数值
     * @param data 数据对象
     * @
     *
     * */
    const setValue= (data) => {
        // 除冰限制
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
    // 除冰限制名称
    result.name = data.name || '';
    // 除冰限制id
    result.id = data.id || '';
    // 发布者
    result.publishUserZh = data.publishUserZh || '';

    // 航空公司
    result.deiceFlights = data.deiceFlights || '';

    // 创建时间
    result.createdTime = setGenerateTime(data);

    // 除冰限制时间
    result.dataTime = setDataTime(data);
    // 除冰限制生效时间
    result.effectiveTime = `${result.dataTime.startTime}-${result.dataTime.endTime}`;
    // 除冰限制生效日期
    result.effectiveDate = `${result.dataTime.startDate}/${result.dataTime.endDate}`;
    // 除冰限制状态
    result.status = setStatus(data);
    // 状态对应的样式名称
    result.statusClassName = setstatusClassName(data, generateTime);
    // 限制数值
    result.value = setValue(data);

    return result
};

// 校验除冰限制是否为正在生效状态
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

export { RestrictionConstant, convertRestrictionData, isEffective };
