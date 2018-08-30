import { isValidVariable, isValidObject } from './basic-verify';
import { FlightCoordination, AlarmType, OperationTypeForFlightId, OperationTypeForTimeColumn } from './flightcoordination';
import FlightCoordinationRecord from './flight-coordination-record';
import FlowcontrolUtils from './flowcontrol-utils';

//根据colStyle转为displayStyle和displayStyleComment
const convertDisplayStyle = ( colStyle = {} ) => {
    // 样式
    let displayStyle = {};
    let displayStyleComment = {};
    // 转换数据
    for (let styleName in colStyle) {
        // 获取样式值
        let styleValues = colStyle[styleName];
        let singleStyle = '';
        let singleStyleComment = '';
        for (let styleKey in styleValues) {
            if (styleKey == 'comments') {
                singleStyleComment = styleValues[styleKey];
            } else {
                singleStyle += styleKey + ':' + styleValues[styleKey] + ';';
            }
        }
        displayStyle[styleName] = singleStyle;
        displayStyleComment[styleName] = singleStyleComment;
    }
    return {
        displayStyle,
        displayStyleComment
    }
};

//根据dataKey获取指定样式值
const getDisplayStyle = function( dataKey ){
    const { displayStyle = {} } = this.props.property;
    if (!isValidObject(displayStyle) || !isValidVariable(displayStyle[dataKey])) {
        return '';
    }
    let tempStr = displayStyle[dataKey];
    if(tempStr.indexOf('transparent') != -1) {
        tempStr = tempStr.replace('transparent', '');
    }
    return tempStr;
};

//根据dataKey获取指定样式-中文值
const getDisplayStyleZh = function( dataKey ){
    const { displayStyleComment = {} } = this.props.property;
    if (!isValidObject(displayStyleComment) || !isValidVariable(displayStyleComment[dataKey])) {
        return '';
    } else {
        return displayStyleComment[dataKey];
    }
};

//根据dataKey获取指定字体大小  displayFontSize == colFontSize
const getDisplayFontSize = function( dataKey ){
    const { colFontSize = {} } = this.props.property;
    if (isValidObject(colFontSize)){
        if (!isValidVariable(colFontSize[dataKey]) || !isValidVariable(colFontSize[dataKey]['font-size'])) {
            return '';
        } else {
            return "font-size:" + colFontSize[dataKey]['font-size']+";";
        }
    }
}
//转换航班计划表格数据
const convertData = function( flight, flightAuthMap, generateTime ){
    // 判断数据有效性
    if (!isValidObject(flight)) {
        return {};
    }
    const thisProxy = this;
    // 创建结果对象
    let data = {};
    // 设置默认显示样式
    let defaultStyle = this.getDisplayStyle('DEFAULT');
    let defaultFontSize = this.getDisplayFontSize('DEFAULT');
    data.default_style = defaultStyle + defaultFontSize;


   //遍历航班生成各个列数据
    for(let key in flight){
        const value = flight[key];
        //处理基本数据值和样式
        setDataValue.call(thisProxy, key, value );
        setTitleAndStyleData.call(thisProxy, key, value, flight );
    }
    //增加操作列---航班号列
    setOperationForFlightid( "FLIGHTIDOPERATION", flightAuthMap);
    //处理是否是失效航班（加中划线）
    setInvalidData.call(thisProxy, flight);

    //处理操作列---航班号列
    function setOperationForFlightid( key, flightAuthMap ){
        let valueArr = [];
        //验证权限控制显隐
        const getValue = ( name ) => {
            const obj = flightAuthMap[name] || {};
            //如果status是Y，则显示，N为不显示
            if( isValidObject(obj) && obj.status == "Y" ){
                return true;
            }
            return false;
        };
        //遍历航班号列权限配置
        for(let itemKey in OperationTypeForFlightId){
            //取key值
            const itemVal = OperationTypeForFlightId[itemKey] || {};
            //航班详情、协调记录、航班报文默认开启
            if( itemKey == "FLIGHT_DETAIL" || itemKey == "COORDINATION_DETAIL" || itemKey == "TELE_DETAIL" ){
                valueArr.push( itemVal );
            }else{
                const flag = getValue( itemVal.en );
                if( flag ){
                    //如果显示该按钮，将其中、英名称以对象形式添加到结果集合中
                    valueArr.push( itemVal );
                }
            }
        };
        data[key] = valueArr;
    };

    //处理基本数据值和样式
    function setDataValue(key, options){
        //处理数值
        data[key] = "";
        if( options.hasOwnProperty("value") && isValidVariable(options.value) ){
            //处理字段显示值
            data[key] = options.value;
        }
        //处理字段样式
        let stylestr = key + "_style";
        if( options.hasOwnProperty("source") ){
            if( isValidVariable(options.source) ){
                data[stylestr] = this.getDisplayStyle(options.source) + this.getDisplayFontSize(options.source);
            }else{
                data[stylestr] = data.default_style;
            }
        }
    };

    //处理title和style
    function setTitleAndStyleData(key, options, flight){
        switch( key ){
            case 'FLIGHTID': {
                setFlightidAttrs.call(this, key, options);
                break;
            }
            case 'APPFIX':
            case 'ACCFIX':
            case 'CTO':
            case 'CTO2': {
                setAppfixAndAccFixAttrs.call(this, key, options);
                break;
            }
            case 'PRIORITY': {
                setPriorityValue.call(this, key, options, flight.ARRAP);
                setPriorityAttrs.call(this, key, options);
                break;
            }
            case 'SOBT': {
                setSOBTAttrs.call(this, key, options);
                break;
            }
            case 'EOBT':{
                setEOBTAttrs.call(this, key, options);
                break;
            }
            case 'TOBT': {
                setTOBTAttrs.call(this, key, options);
                break;
            }
            case 'HOBT': {
                setHOBTAttrs.call(this, key, options);
                break;
            }
            case 'COBT': {
                setCOBTAttrs.call(this, key, options);
                break;
            }
            case 'CTOT': {
                setCTOTAttrs.call(this, key, options);
                break;
            }
            case 'ASBT': {
                setASBTAttrs.call(this, key, options);
                break;
            }
            case 'AGCT': {
                setAGCTAttrs.call(this, key, options);
                break;
            }
            case 'AOBT': {
                setAOBTAttrs.call(this, key, options);
                break;
            }
            case 'ATOT':
            case 'ALDT': {
                setATOTAndALDTAttrs.call(this, key, options);
                break;
            }
            case 'FORMER_FLIGHTID': {
                setFormerFlightIdAttrs.call(this, key, options);
                break;
            }
            case 'FORMER_DEP': {
                setFormerDepAttrs.call(this, key, options);
                break;
            }
            case 'FORMER_ARR': {
                setFormerArrAttrs.call(this, key, options);
                break;
            }
            case 'POOL_STATUS':{
                setPoolStatusAttrs.call(this, key, options);
                break;
            }
            case 'STATUS':{
                setStatusAttrs.call(this, key, options);
                break;
            }
            case 'POSITION': {
                setSPOTAttrs.call(this, key, options);
                break;
            }
            case 'DEICE_POSITION': {
                setDeicePositionAttrs.call(this, key, options);
                break;
            }
            case 'DEICE_STATUS': {
                setDeiceStatusAttrs.call(this, key, options);
                break;
            }
            case 'RUNWAY': {
                setRunwayAttrs.call(this, key, options);
                break;
            }
            case 'FLOWCONTROL_STATUS': {
                setFlowcontrolStatusAttrs.call(this, key, options);
                break;
            }
            case 'NORMAL': {
                setNormalAttrs.call(this, key, options);
                break;
            }
            case 'DELAY_REASON': {
                setDelayReasonAttrs.call(this, key, options);
                break;
            }
            case 'GSOBT': {
                setGSOBTAttrs.call(this, key, options);
                break;
            }
            case 'FLOWCONTROL_POINT_PASSTIME':
            case 'FLIGHT_ACC_POINT_PASSTIME':
            case 'FLIGHT_APP_POINT_PASSTIME': {
                setFlowcontrolPointPassTimeAttrs.call(this, key, options);
                break;
            }
            case 'EFPS_REQTIME':
            case 'EFPS_PUSTIME':
            case 'EFPS_LINTIME':
            case 'EFPS_IN_DHLTIME':
            case 'EFPS_OUT_DHLTIME':
            case 'EFPS_OUT_ICETIME':
            case 'EFPS_IN_ICETIME':
            case 'EFPS_TAXTIME': {
                setEfpsTimeAttrs.call(this, key, options);
                break;
            }
        }

    };

    //配置航班号 title信息
    function setFlightidAttrs(key, obj){
        //航班title
        let titlekey = key + "_title";
        let titlestr = '';
        //单元格样式
        let stylekey = key + "_style";
        let stylestr = data.default_style;
        let { source = '', processMap = '' } = obj;
        if(isValidVariable(processMap) && isValidVariable(processMap.FLIGHTIDSTYLE)){
            titlestr += 'ID:' + processMap.FLIGHTIDSTYLE.value;
            if( source == "FLIGHTID_CDM" ){
                //CDM航班
                titlestr += '\n' + "CDM航班";
            }else if( source == "FLIGHTID_CRS" ){
                //CRS航班
                titlestr += '\n' + "CRS航班";
            }
            const styleSource = processMap.FLIGHTIDSTYLE.source || "";
            if( isValidVariable(styleSource) ){
                if( styleSource == "MARK_NEED_SLOT"){
                    stylestr = this.getDisplayStyle('MARK_NEED_SLOT');
                    titlestr += '\n' + '已退出时隙分配';
                }else if( styleSource == "IN_WAIT_POOL"){
                    stylestr = this.getDisplayStyle('IN_WAIT_POOL');
                    titlestr += '\n' + '已入池';
                }else if( styleSource == "FLIGHT_QUALIFICATIONS_MANUAL"){
                    stylestr = this.getDisplayStyle('FLIGHT_QUALIFICATIONS_MANUAL');
                    titlestr += '\n' + '已标记为二类飞行资质';
                }else if( styleSource == "MARK_EXEMPT"){
                    stylestr = this.getDisplayStyle('MARK_EXEMPT');
                    titlestr += '\n' + '已豁免';
                }else if( styleSource == "DELAY_DEP_ALARM"){
                    stylestr = this.getDisplayStyle('DELAY_DEP_ALARM');
                    titlestr += '\n' + '延误起飞告警';
                }else if( styleSource == "CRITICAL_FLIGHT"){
                    stylestr = this.getDisplayStyle('CRITICAL_FLIGHT');
                    titlestr += '\n' + '临界(特殊航班)';
                }else if( styleSource == "CLEARANCE_MANUAL"){
                    stylestr = this.getDisplayStyle('CLEARANCE_MANUAL');
                    titlestr += '\n' + '已放行';
                }else if( styleSource == "MARK_READY"){
                    stylestr = this.getDisplayStyle('MARK_READY');
                    titlestr += '\n' + '已标记准备完毕';
                }
            }

        }
        data[titlekey] = titlestr;
        data[stylekey] = stylestr + this.getDisplayFontSize('FLIGHTID');
    };

    //配置 内/外控点  title信息
    function setAppfixAndAccFixAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let value = '';
        let processMap = obj.processmap || '';
        if(isValidVariable(processMap)){
            if(isValidVariable(processMap.FIX_PREDICT)){
                value = processMap.FIX_PREDICT.value || '';
                //预计
                titlestr +='预计:' + convertToTableStandardDate(value) + '\n';
            }else if(isValidVariable(processMap.FIX_AUTO)){
                value = processMap.FIX_AUTO.value;
                //计算
                titlestr += '计算:' + convertToTableStandardDate(value) + '\n';
            }else if(isValidVariable(processMap.FIX_LOCK)){
                value = processMap.FIX_LOCK.value;
                //锁定
                titlestr += '锁定:' + convertToTableStandardDate(value) + '\n';
            }else if(isValidVariable(processMap.FIX_REALITY)){
                value = processMap.FIX_REALITY.value;
                //实际
                titlestr += '实际:' + convertToTableStandardDate(value);
            }
        }
        data[titlekey] = titlestr;
        //单元格有值则展示样式
        if( isValidVariable(obj.value) ){
            let stylekey = key + "_style";
            data[stylekey] = defaultStyle + this.getDisplayFontSize(key);
        }

    };

    //配置 优先级  title信息
    function setPriorityAttrs(key, obj){
        let titlekey = key + "_title";
        let titlestr = '';
        let wfStatus = obj.wfStatus || '';
        let stylestr = '';
        if(isValidVariable(wfStatus)){
            if(wfStatus == FlightCoordinationRecord.STATUS_APPLY){
                //申请
                titlestr = this.getDisplayStyleZh('PRIORITY_APPLY');
                stylestr = this.getDisplayStyle('PRIORITY_APPLY');
            }else if(wfStatus == FlightCoordinationRecord.STATUS_APPROVE){
                //批复
                titlestr = this.getDisplayStyleZh('PRIORITY_APPROVE');
                stylestr = this.getDisplayStyle('PRIORITY_APPROVE');
            }else if(wfStatus == FlightCoordinationRecord.STATUS_REFUSE){
                //拒绝
                titlestr = this.getDisplayStyleZh('PRIORITY_REFUSE');
                stylestr = this.getDisplayStyle('PRIORITY_REFUSE');
            }
        }
        data[titlekey] = titlestr;

        //单元格有值则展示样式
        if( isValidVariable(obj.value) ){
            let stylekey = key + "_style";
            if(!isValidVariable(stylestr)){
                stylestr = defaultStyle;
            }
            data[stylekey] = stylestr + this.getDisplayFontSize('PRIORITY') ;
        }


    };
    //配置 优先级  value信息
    function setPriorityValue(key, obj, arrap){
        if(isValidVariable(arrap) && isValidVariable(arrap.value)){
            data.PRIORITY = FlightCoordination.getPriorityZh(
                data.PRIORITY, arrap.value);
        };
    };
    //配置 计划时间
    function setSOBTAttrs( key, obj ){
        //title
        let titlekey = key + "_title";
        //单元格样式
        let stylekey = key + "_style";
        let titlestr = '';
        let value = obj.value || '';
        if (isValidVariable(value)) {
            titlestr = convertToTableStandardDate(value) + '\n' + this.getDisplayStyleZh(key);
            //若sobt有值，取sobt样式和字体
            data[stylekey] = this.getDisplayStyle('SOBT') + this.getDisplayFontSize('SOBT');
        }
        data[titlekey] = titlestr;
    };
    //配置 预计撤轮档时间  title信息
    function setEOBTAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let value = obj.value || '';
        let source = obj.source || '';
        //
        if (isValidVariable(value)) {
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh(key);
            // 判断来源
            if(isValidVariable(source)){
                if (source == "EOBT_DLA") {
                    titlestr = 'DLA ' + titlestr;
                } else if (source == "EOBT_CHG") {
                    titlestr = 'CHG ' + titlestr;
                } else if (source == "EOBT_FPL") {
                    titlestr = 'FPL ' + titlestr;
                }
            }
        }
        data[titlekey] = titlestr;
        //单元格有值则展示样式
        if( isValidVariable(value) ){
            let stylekey = key + "_style";
            data[stylekey] = this.getDisplayStyle('EOBT') + this.getDisplayFontSize('EOBT');
        }
    };

    function setTOBTAttrs( key, obj ){
        let titlekey = key + "_title";
        let stylekey = key + "_style";
        //let tobtRecord = flight.coordinationWorkerflows[FlightCoordinationRecord.TYPE_TOBT]
        let titlestr = '';
        let value = obj.value || '';
        let source = obj.source || '';
        let wfStatus = obj.wfStatus || '';
        let style = '';
        let processmap = obj.processmap||'';
        if(source == "TOBT_FPL"){
            // 报文
            titlestr = convertToTableStandardDate(value)+ '\n'
                + this.getDisplayStyleZh('TOBT_EOBT');
            style = this.getDisplayStyle('TOBT_EOBT');
        }else if(source == "TOBT_PREDICT"){
            // 系统
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh('TOBT_SYSTEM');
            style = this.getDisplayStyle('TOBT_SYSTEM');
        }
        //人工操作
        if(wfStatus == FlightCoordinationRecord.STATUS_APPLY){
            //申请
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh('TOBT_APPLY');
            style = this.getDisplayStyle('TOBT_APPLY');
        }else if(wfStatus == FlightCoordinationRecord.STATUS_APPROVE){
            //批复
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh('TOBT_APPROVE');
            style = this.getDisplayStyle('TOBT_APPROVE');
        }else if(wfStatus == FlightCoordinationRecord.STATUS_REFUSE){
            //拒绝
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh('TOBT_REFUSE');
            style = this.getDisplayStyle('TOBT_REFUSE');
        }else if(wfStatus == FlightCoordinationRecord.STATUS_MODIFY){
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh('TOBT_IMPROVE');
            style = this.getDisplayStyle('TOBT_IMPROVE');
        }

        if(isValidVariable(processmap.TOBT_MANUAL) && isValidVariable(processmap.TOBT_MANUAL.value)){
            //人工录入
            data["TOBT_UPDATE_TIME"] = processmap.TOBT_MANUAL.value;
            data["TOBT_UPDATE_TIME_title"]  = '录入时间: ' + convertToTableStandardDate(processmap.TOBT_MANUAL.value);

            //
            if(isValidVariable(titlestr)) {
                titlestr = titlestr  +  '\n' + '录入时间: ' + convertToTableStandardDate(processmap.TOBT_MANUAL.value);
            } else {
                titlestr ='录入时间: ' + convertToTableStandardDate(processmap.TOBT_MANUAL.value);
            }
        }
        data[titlekey] = titlestr;
        data[stylekey] = this.getDisplayFontSize('TOBT') + style;
    };
    //配置 协关时间  title信息
    function setHOBTAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let stylestr = '';
        let value = obj.value || '';
        let source = obj.source || '';
        let wfStatus = obj.wfStatus || '';
        if(isValidVariable(value) && isValidVariable(source)){
            if(source == "DEFAULT"){
                titlestr =  convertToTableStandardDate(value)+ '\n';
            }else if(source == "HOBT_MANUAL"){
                if(wfStatus == FlightCoordinationRecord.STATUS_APPLY){
                    //申请
                    titlestr = convertToTableStandardDate(value) + '\n'
                        + this.getDisplayStyleZh('HOBT_APPLY');
                    stylestr = this.getDisplayStyle('HOBT_APPLY');
                }else if(wfStatus == FlightCoordinationRecord.STATUS_APPROVE){
                    //批复
                    titlestr = convertToTableStandardDate(value) + '\n'
                        + this.getDisplayStyleZh('HOBT_APPROVE');
                    stylestr = this.getDisplayStyle('HOBT_APPROVE');
                }else if(wfStatus == FlightCoordinationRecord.STATUS_REFUSE){
                    //拒绝
                    titlestr = convertToTableStandardDate(value) + '\n'
                        + this.getDisplayStyleZh('HOBT_REFUSE');
                    stylestr = this.getDisplayStyle('HOBT_REFUSE');
                }
            }
            if(ifDep(obj)){
                stylestr = this.getDisplayStyle('OUT_OR_DEP');
            }
        }
        data[titlekey] = titlestr;
        //单元格有值则展示样式   
        if( isValidVariable(obj.value)){
            let stylekey = key + "_style";
            if(!isValidVariable(stylestr)){
                stylestr = defaultStyle;
            }
            data[stylekey] = stylestr + this.getDisplayFontSize('HOBT');
        }

    };
    //配置 预撤时间  title信息
    function setCOBTAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let stylestr = '';
        let value = obj.value || '';
        let source = obj.source || '';
        if(source == "COBT_MANUAL"){
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh('COBT_MANUAL');
            stylestr = this.getDisplayStyle('COBT_MANUAL');
        }else if(source == "COBT_PRE_LOCK"){
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh('COBT_LOCK');
            stylestr = this.getDisplayStyle('COBT_LOCK');
        }else if(source == "COBT_LOCK"){
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh('COBT');
            stylestr = this.getDisplayStyle('COBT');
        }else if(source == "COBT_AUTO"){
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh('COBT_AUTO');
            stylestr = this.getDisplayStyle('COBT_AUTO');
        }
        if(ifDep(obj)){
            stylestr = this.getDisplayStyle('OUT_OR_DEP');
        }
        data[titlekey] = titlestr;
        //单元格有值则展示样式
        if( isValidVariable(obj.value) ){
            let stylekey = key + "_style";
            if(!isValidVariable(stylestr)){
                stylestr = defaultStyle;
            }
            data[stylekey] = stylestr + this.getDisplayFontSize('COBT') ;
        }
    };
    //配置 预起时间  title信息
    function setCTOTAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let stylestr = '';
        let source = obj.source || '';
        let value = obj.value || '';
        if(source == "CTOT_MANUAL" ){
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh('CTOT_MANUAL');
            stylestr = this.getDisplayStyle('CTOT_MANUAL');
        }else if(source == "CTOT_PRE_LOCK"){
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh('CTOT_LOCK');
            stylestr = this.getDisplayStyle('CTOT_LOCK');
        }else if(source == "CTOT_LOCK"){
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh('CTOT');
            stylestr = this.getDisplayStyle('CTOT');
        }else if(source == "CTOT_AUTO"){
            titlestr = convertToTableStandardDate(value) + '\n'
                + this.getDisplayStyleZh('CTOT_AUTO');
            stylestr = this.getDisplayStyle('CTOT_AUTO');
        }
        if(ifDep(obj)){
            stylestr = this.getDisplayStyle('OUT_OR_DEP');
        }
        data[titlekey] = titlestr;
        //单元格有值则展示样式
        if( isValidVariable(obj.value) ){
            let stylekey = key + "_style";
            if(!isValidVariable(stylestr)){
                stylestr = defaultStyle;
            }
            data[stylekey] = stylestr + this.getDisplayFontSize('CTOT') ;
        }
    };
    //配置 上客时间  title信息
    function setASBTAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let stylestr = '';
        let value = obj.value || '';
        let source = obj.source || '';
        let timestamp = obj.timestamp || '';
        let styleZh = this.getDisplayStyleZh('ASBT');
        if (isValidVariable(value)) {
            titlestr = convertToTableStandardDate(value) + '\n';
            // 判断来源
            if (source == 'BOARDINGTIME_MENUAL') {
                // 人工
                titlestr = titlestr + styleZh;
                stylestr = this.getDisplayStyle('ASBT_MENUAL');
                if(isValidVariable(timestamp)){
                    // 显示录入时间
                    titlestr = titlestr + '\n'
                        + '录入时间: ' + convertToTableStandardDate(timestamp);
                }
            }
            if (source == 'BOARDINGTIME_IMPORT'){
                // 引接
                titlestr = titlestr + styleZh;
                stylestr = this.getDisplayStyle('ASBT_IMPORT');
            }
            if(ifDep(obj)){
                stylestr = this.getDisplayStyle('OUT_OR_DEP');
            }
        }
        let stylekey = key + "_style";
        data[stylekey] = stylestr + this.getDisplayFontSize('ASBT');
        data[titlekey] = titlestr;
    };
    //配置 关舱门时间  title信息
    function setAGCTAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let stylestr = '';
        let value = obj.value || '';
        let source = obj.source || '';
        let processMap= obj.processMap || '';
        let styleZh = this.getDisplayStyleZh('AGCT');
        // 判断来源
        if (isValidVariable(value) && isValidVariable(source)) {
            // 判断是否有协调记录
            if(source=='AGCT_MANUAL'){
                stylestr = this.getDisplayStyle('AGCT_MANUAL');
                if(isValidVariable(processMap) ){
                    if(isValidObject(processMap.AGCT_MANUAL)){
                        // 人工
                        titlestr = convertToTableStandardDate(processMap.AGCT_MANUAL.value) + '\n'
                            + styleZh;
                        // 显示录入时间
                        titlestr = titlestr + '\n' + '录入时间: '
                            + convertToTableStandardDate(processMap.AGCT_MANUAL.timestamp);
                    }else if(isValidObject(processMap.AGCT_TELE)){
                        //如果同时存在报文
                        titlestr = titlestr + '\n'
                            + convertToTableStandardDate(processMap.AGCT_TELE.value) + '\n'
                            + this.getDisplayStyleZh(processMap.AGCT_TELE.source);
                    }
                }
            }else if(source=='AGCT_IMPORT'){
                // 引接
                titlestr = convertToTableStandardDate(value) + '\n' + styleZh;
                stylestr = this.getDisplayStyle('AGCT_IMPORT');
                if(isValidVariable(processMap) && isValidVariable(processMap.AGCT_IMPORT)){
                    //如果同时存在报文
                    titlestr = titlestr + '\n'
                        + convertToTableStandardDate(processMap.AGCT_IMPORT.value) + '\n'
                        + this.getDisplayStyleZh(processMap.AGCT_IMPORT.source);
                }
            }else if(source=='AGCT_TELE'){
                //报文
                titlestr = titlestr + '\n' + convertToTableStandardDate(value) + '\n' + styleZh;
                stylestr = this.getDisplayStyle('AGCT_TELE');
            }
            if(ifDep(obj)){
                stylestr = this.getDisplayStyle('OUT_OR_DEP');
            }
        }
        //单元格有值则展示样式
        if( isValidVariable(obj.value) ){
            let stylekey = key + "_style";
            if(!isValidVariable(stylestr)){
                stylestr = defaultStyle;
            }
            data[stylekey] = stylestr + this.getDisplayFontSize('AGCT') ;
        }
        data[titlekey] = titlestr;

    };
    //配置 推出时间  title信息
    function setAOBTAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let stylestr = '';
        let styleZh = this.getDisplayStyleZh("AOBT");
        let source = obj.source || '';
        let value = obj.value || '';
        let processMap = obj.processMap || '';
        let timestamp = obj.timestamp || '';
        if(isValidVariable(source) && isValidVariable(value)){
            // 判断来源
            if(source == 'AOBT_EFPS') {
                // 进程单许可的推出时间
                titlestr = convertToTableStandardDate(value) + '\n'
                    + styleZh;
                stylestr = this.getDisplayStyle('AOBT_EFPS');
                if(isValidVariable(processMap)){
                    // 录入时间
                    if(isValidVariable(processMap.AOBT_MANUAL)){
                        titlestr = titlestr + '\n'
                            + convertToTableStandardDate(processMap.AOBT_MANUAL.value) + '\n'
                            + this.getDisplayStyleZh(processMap.AOBT_MANUAL.source);
                        // 显示录入时间
                        titlestr = titlestr + '\n' + '录入时间: '
                            + convertToTableStandardDate(processMap.AOBT_MANUAL.timestamp);
                    }
                    // 引接
                    if (isValidVariable(processMap.AOBT_IMPORT)) {
                        titlestr = titlestr + '\n'
                            + convertToTableStandardDate(processMap.AOBT_IMPORT.value) + '\n'
                            + this.getDisplayStyleZh(processMap.AOBT_IMPORT.source);
                    }
                    // 如同时存在报文，则在title中同时显示
                    if (isValidVariable(processMap.AOBT_TELE)) {
                        titlestr = titlestr + '\n'
                            + convertToTableStandardDate(processMap.AOBT_TELE.value) + '\n'
                            + this.getDisplayStyleZh(processMap.AOBT_TELE.source);
                    }
                }

            } else if (source == 'AOBT_IMPORT') {
                // 引接
                titlestr = convertToTableStandardDate(value) + '\n'
                    + styleZh;
                stylestr = this.getDisplayStyle('AOBT_IMPORT');
                if(isValidVariable(processMap)){
                    // 录入时间
                    if(isValidVariable(processMap.AOBT_MANUAL)){
                        titlestr = titlestr + '\n'
                            + convertToTableStandardDate(processMap.AOBT_MANUAL.value) + '\n'
                            + this.getDisplayStyleZh(processMap.AOBT_MANUAL.source);
                        // 显示录入时间
                        titlestr = titlestr + '\n' + '录入时间: '
                            + convertToTableStandardDate(processMap.AOBT_MANUAL.timestamp);
                    }
                    // 如同时存在报文，则在title中同时显示
                    if (isValidVariable(processMap.AOBT_TELE)) {
                        titlestr = titlestr + '\n'
                            + convertToTableStandardDate(processMap.AOBT_TELE.value) + '\n'
                            + this.getDisplayStyleZh(processMap.AOBT_TELE.source);
                    }
                }
            } else if(source == 'AOBT_MANUAL'){
                titlestr = convertToTableStandardDate(value) + '\n'
                    + styleZh;
                stylestr = this.getDisplayStyle('AOBT_MANUAL');
                if(isValidVariable(timestamp)){
                    // 显示录入时间
                    titlestr = titlestr + '\n' + '录入时间: '
                        + convertToTableStandardDate(timestamp);
                }
                // 如同时存在报文，则在title中同时显示
                if (isValidVariable(processMap) && processMap.AOBT_TELE) {
                    titlestr = titlestr + '\n'
                        + convertToTableStandardDate(processMap.AOBT_TELE.value) + '\n'
                        + this.getDisplayStyleZh(processMap.AOBT_TELE.source);
                }
            } else if (source == 'AOBT_TELE') {
                // 报文
                titlestr = convertToTableStandardDate(value) + '\n'
                    + styleZh;
                stylestr = this.getDisplayStyle('AOBT_TELE');
            }
            if(ifDep(obj)){
                stylestr = this.getDisplayStyle('OUT_OR_DEP');
            }
        }
        //单元格有值则展示样式
        if( isValidVariable(obj.value) ){
            let stylekey = key + "_style";
            if(!isValidVariable(stylestr)){
                stylestr = defaultStyle;
            }
            data[stylekey] = stylestr + this.getDisplayFontSize('AOBT') ;
        }

        data[titlekey] = titlestr;
    };
    //配置 实际起飞 和 实际降落时间   title信息
    function setATOTAndALDTAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let stylekey = key + "_style";
        let stylestr = '';
        let value = obj.value || '';
        if (isValidVariable(value)) {
            titlestr = convertToTableStandardDate(value) + '\n' + this.getDisplayStyleZh('ATOT');
            stylestr = this.getDisplayStyle('ATOT') + this.getDisplayFontSize('ATOT') ;
        }else{
            stylestr = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('ATOT') ;
        }
        data[titlekey] = titlestr;
        data[stylekey] = stylestr;
    };

    //配置 前端航班号  title信息
    function setFormerFlightIdAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let formerDepap = '';
        let formerDeptime = '';
        let formerArrtime = '';
        let formerDepsource = '';
        let formerArrsource = '';
        let processMap = obj.processMap || '';
        let source = obj.source || '';
        let value = obj.value || '';
        if(isValidVariable(processMap)){
            if(processMap.FORMERID){
                titlestr = 'ID:' + processMap.FORMERID.value + '\n';
            }
            if(processMap.FORMERDEPAP){
                formerDepap = processMap.FORMERDEPAP.value;
            }
            if(processMap.FORMERDEPTIME){
                formerDeptime = processMap.FORMERDEPTIME.value.substring(7, 9) + '/'
                    + processMap.FORMERDEPTIME.value.substring(9, 13);
                formerDepsource = processMap.FORMERDEPTIME.source;
            }
            if(processMap.FORMERARRTIME){
                formerArrtime = processMap.FORMERARRTIME.value.substring(7, 9) + '/'
                    + processMap.FORMERARRTIME.value.substring(9, 13);
                formerArrsource = processMap.FORMERARRTIME.source;
            }
        }
        if(isValidVariable(source) && isValidVariable(value)){
            if(formerDepsource == 'DEPTIME_REALITY'){// 前段起飞
                // 实际
                titlestr = titlestr
                    + value + '\n' + '起飞机场: '
                    + formerDepap + '\n' + '实际起飞: ' + formerDeptime;
            }else if(formerDepsource == 'DEPTIME_PREDICT'){
                // 预计
                titlestr = titlestr
                    + value + '\n' + '起飞机场: '
                    + formerDepap + '\n' + '预计起飞: ' + formerDeptime;
            }else if(formerDepsource == 'DEPTIME_SCHEDULE'){
                // 计划
                titlestr = titlestr
                    + value + '\n' + '起飞机场: '
                    + formerDepap + '\n' + '计划起飞: ' + formerDeptime;
            }
            if(formerArrsource == 'ARRTIME_REALITY'){// 判断降落时间类型
                // 实际
                titlestr = titlestr
                    + '\n' + '实际降落: ' + formerArrtime;
            }else if(formerArrsource == 'ARRTIME_RADAR'){// 判断降落时间类型
                // 雷达
                titlestr = titlestr
                    + '\n' + '雷达降落: ' + formerArrtime;
            }else if(formerArrsource == 'ARRTIME_PREDICT'){// 判断降落时间类型
                // 预计
                titlestr = titlestr
                    + '\n' + '预计降落: ' + formerArrtime;
            }else if(formerArrsource == 'ARRTIME_TIMEOUT'){// 判断降落时间类型
                // 预计-未起飞超时
                titlestr = titlestr
                    + '\n' + '预计降落: ' + formerArrtime;
            }else if(formerArrsource == 'ARRTIME_NORMAL'){// 判断降落时间类型
                // 预计-未正常起飞
                titlestr = titlestr
                    + '\n' + '预计降落: ' + formerArrtime;
            }
        }

        data[titlekey] = titlestr;
        //单元格有值则展示样式
        if( isValidVariable(obj.value) ){
            let stylekey = key + "_style";
            data[stylekey] = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('FORMER_FLIGHTID') ;
        }
    };
    //配置 前端起飞  title信息
    function setFormerDepAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let value = '';
        let source = obj.source || '';
        if(isValidVariable(obj.value)){
            value = obj.value.substring(6, 8) + '/'
                + obj.value.substring(8);
        }
        if(isValidVariable(source) && isValidVariable(value)){
            // 前段起飞
            if(source == 'DEPTIME_REALITY'){
                // 实际
                titlestr = '实际起飞: ' + value;
            }else if(source == 'DEPTIME_PREDICT'){
                // 预计
                titlestr = '预计起飞: ' + value;
            }else if(source == 'DEPTIME_SCHEDULE'){
                // 计划
                titlestr = '计划起飞: ' + value;
            }
        }
        data[titlekey] = titlestr;
        //单元格有值则展示样式
        if( isValidVariable(obj.value) ){
            let stylekey = key + "_style";
            data[stylekey] = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('FORMER_DEP');
        }
    };
    //配置 前端降落  title信息
    function setFormerArrAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let stylestr = '';
        let value = '';
        let source = obj.source || '';
        if(isValidVariable(obj.value)){
            value = obj.value.substring(6, 8) + '/'
                + obj.value.substring(8);
        }
        if(isValidVariable(source) && isValidVariable(value)){
            if(source == 'ARRTIME_REALITY'){// 判断降落时间类型
                // 实际
                titlestr = '实际降落: ' + value;
                stylestr = this.getDisplayStyle('FORMER_ARR_REALITY');
            }else if(source == 'ARRTIME_RADAR'){// 判断降落时间类型
                // 雷达
                titlestr = '雷达降落: ' + value;
                stylestr = this.getDisplayStyle('FORMER_ARR_RADAR');
            }else if(source == 'ARRTIME_PREDICT'){// 判断降落时间类型
                // 预计
                titlestr = '预计降落: ' + value;
                stylestr = this.getDisplayStyle('FORMER_ARR_PREDICT');
            }else if(source == 'ARRTIME_TIMEOUT'){// 判断降落时间类型
                // 预计-未起飞超时
                titlestr = '未起飞超时: ' + value;
                stylestr = this.getDisplayStyle('FORMER_ARR_TIMEOUT');
            }else if(source == 'ARRTIME_NORMAL'){// 判断降落时间类型
                // 预计-未正常起飞
                titlestr = '未起飞正常: ' + value;
                stylestr = this.getDisplayStyle('FORMER_ARR_NORMAL');
            }
        }
        data[titlekey] = titlestr;
        //单元格有值则展示样式
        if( isValidVariable(obj.value) ){
            let stylekey = key + "_style";
            if(!isValidVariable(stylestr)){
                stylestr = defaultStyle;
            }
            data[stylekey] = stylestr + this.getDisplayFontSize('FORMER_ARR') ;
        }

    };

    //配置 入池状态 title信息
    function setPoolStatusAttrs( key, obj ){
        let value = obj.value;
        if(!isValidVariable(value)){
            //未发报不显示
            value = "";
        }else{
            value = FlightCoordination.getPoolStatusZh(value);
        }
        data[key] = value;
        let stylekey = key + "_style";
        data[stylekey] = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('POOL_STATUS');
    };
    //配置 航班状态title信息
    function setStatusAttrs( key, obj ){
        let value = obj.value;
        if (isValidVariable(value)) {
            let flight = {};
            flight.status = value;
            data[key] = FlightCoordination.getStatusZh(flight);
            let stylekey = key + "_style";
            data[stylekey] = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('STATUS');
        }
    }

    //配置 停机位  title信息
    function setSPOTAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let value = obj.value || '';
        let source = obj.source || '';
        let timestamp = obj.timestamp || '';
        if(isValidVariable(source) && isValidVariable(value)){
            if(source == 'SPOT_MANUAL'){
                // 人工
                titlestr = value + '\n'
                    + this.getDisplayStyleZh('SPOT_MANUAL');
                // 显示录入时间
                if(isValidVariable(timestamp)){
                    titlestr = titlestr + '\n' + '录入时间: '
                        + convertToTableStandardDate(timestamp);
                }
            }else if(source == 'SPOT_IMPORT'){
                // 引接
                titlestr = value + '\n'
                    + this.getDisplayStyleZh('SPOT_MANUAL');
            }
        }
        data[titlekey] = titlestr;
    };

    //配置 除冰位  title信息
    function setDeicePositionAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let source = obj.source || '';
        let value = obj.value || '';
        if(isValidVariable(source)){
            if(source == 'DEICE_POSITION_NORMAL' && isValidVariable(value)){
                titlestr = value;
            }else if(source == 'DEICE_POSITION_PENDDING'){
                titlestr = '待定';
            }
        }
        data[titlekey] = titlestr;
        //单元格有值则展示样式
        if( isValidVariable(obj.value) ){
            let stylekey = key + "_style";
            data[stylekey] = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('DEICE_POSITION') ;
        }
    };
    //配置 是否除冰  value信息
    function setDeiceStatusAttrs( key, obj ){
        const value = obj.value*1 || 0;
        let valueStr = ''
        if( value == 0 ){
            valueStr = '';
        }else if( value == 1 ){
            valueStr = '除冰';
        }
        data[key] = valueStr;
    };
    //配置 跑道  title信息
    function setRunwayAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let stylestr = '';
        let source = obj.source || '';
        let timestamp = obj.timestamp || '';
        let value = obj.value || '';
        if(isValidVariable(source) && isValidVariable(value)){
            if(source == 'RUNWAY_MANUAL'){
                // 人工
                titlestr = value + '\n'
                    + this.getDisplayStyleZh('RUNWAY_MANUAL');
                stylestr = this.getDisplayStyle('RUNWAY_MANUAL')
                // 显示录入时间
                if(isValidVariable(timestamp)){
                    titlestr = titlestr + '\n' + '录入时间: '
                        + convertToTableStandardDate(timestamp);
                }
            }else if(source == 'RUNWAY_IMPORT'){
                // 系统（时隙分配程序录入）
                titlestr = value + '\n'
                    + this.getDisplayStyleZh('RUNWAY_SLOT');
                stylestr = this.getDisplayStyle('RUNWAY_SLOT')
            }else if(source == 'RUNWAY_SYSTEM'){
                // 系统-推算
                titlestr = value + '\n'
                    + this.getDisplayStyleZh('RUNWAY_SYSTEM');
                stylestr = this.getDisplayStyle('RUNWAY_SYSTEM')
            }
        }
        data[titlekey] = titlestr;
        //单元格有值则展示样式
        if( isValidVariable(obj.value) ){
            let stylekey = key + "_style";
            if(!isValidVariable(stylestr)){
                stylestr = defaultStyle;
            }
            data[stylekey] = stylestr + this.getDisplayFontSize('RUNWAY') ;
        }
    };
    //配置 流控状态  title信息
    function setFlowcontrolStatusAttrs( key, obj ){
        const titlekey = key + "_title";
        let value = obj.value || '';
        let valueStr = ''
        if( value == 'ISCONT' ){
            valueStr = '受控';
        }else if( value == 'ISGS' ){
            valueStr = '停止';
        }else if( value == 'ISREQ' ){
            valueStr = '申请';
        }
        data[key] = valueStr;
        data[titlekey] = valueStr;
    };

    //配置 普通信息  title信息
    function setNormalAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let diff = obj.value || '';
        let source = obj.source || '';
        let value = '';
        if(isValidVariable(source) && isValidVariable(diff)){
            if(source == "NORMAL_CNL"){
                value = '取消';
            }else if(source == "NORMAL_CPL"){
                value = '返航/备降';
            }else if(source == "ABNORMAL_DELAY"){
                titlestr = '延误' + (diff - 5) + '分钟';
                value = '延误';
            }else if(source == "ABNORMAL_BEFORE"){
                titlestr = '提前' + (diff + 5) + '分钟';
                value = '提前';
            }else if(source == "ABNORMAL_C_DELAY"){
                titlestr = '延误-推测' + (diff - 5) + '分钟';
                value = '延误-推测';
            }else if(source == "ABNORMAL_C_BEFORE"){
                titlestr = '提前-推测' + (diff + 5) + '分钟';
                value = '提前-推测';
            }else{
                value = '正常';
            }
        }
        data[titlekey] = titlestr;
        data[key] = value;
    };

    //配置  延误原因  title信息
    function setDelayReasonAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let value = obj.value || '';
        let source = obj.source || '';
        if(isValidVariable(source) && source != 'DEFAULT' && isValidVariable(value)){
            titlestr = value;
        }
        data[titlekey] = titlestr;
        //单元格有值则展示样式
        if( isValidVariable(obj.value) ){
            let stylekey = key + "_style";
            data[stylekey] = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('DELAY_REASON') ;
            data[key] = FlowcontrolUtils.getReasonZh(value);
        }

    };

    //配置 
    function setGSOBTAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let value = obj.value || '';
        if(isValidVariable(value)){
            titlestr = convertToTableStandardDate(value);
        }
        data[titlekey] = titlestr;
    };

    //配置 流控点时间
    function setFlowcontrolPointPassTimeAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let processMap = obj.processMap || '';
        if(isValidVariable(processMap)){
            if(isValidVariable(processMap.FFIXT_REALITY)){
                titlestr += ('实际: '
                    + convertToTableStandardDate(processMap.FFIXT_REALITY.value) + '\n');
            }else if(isValidVariable(processMap.FFIXT_TARGET)){
                titlestr += ('已起飞人工: '
                    + convertToTableStandardDate(processMap.FFIXT_TARGET.value) + '\n');
            }else if(isValidVariable(processMap.FFIXT_PREDICT)){
                titlestr += ('预计: '
                    + convertToTableStandardDate(processMap.FFIXT_PREDICT.value) + '\n');
            }else if(isValidVariable(processMap.FFIXT_COBT_MANUAL)){
                titlestr += ('人工: '
                    + convertToTableStandardDate(processMap.FFIXT_COBT_MANUAL.value) + '\n');
            }else if(isValidVariable(processMap.FFIXT_COBT_LOCK)){
                titlestr += ('锁定: '
                    + convertToTableStandardDate(processMap.FFIXT_COBT_LOCK.value) + '\n');
            }
            if(isValidVariable(processMap.FFIXT_COBT_AUTO)){
                titlestr += ('计算: '
                    + convertToTableStandardDate(processMap.FFIXT_COBT_AUTO.value) + '\n');
            }
        }
        data[titlekey] = titlestr;
    };
    //电子进程单 相关时间
    function setEfpsTimeAttrs( key, obj ){
        let titlekey = key + "_title";
        let titlestr = '';
        let value = obj.value || '';
        if(isValidVariable(value)){
            titlestr = convertToTableStandardDate(value);
        }
        data[titlekey] = titlestr;
        //单元格有值则展示样式
        if( isValidVariable(obj.value) ){
            let stylekey = key + "_style";
            data[stylekey] = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize(key) ;
        }
    };
    // 若航班已经入池  则认为航班原先锁定或者指定的CTOT,COBT时间失效时间以下划线显示
    function setInvalidData(flight){
        const statusMap = flight.POOL_STATUS || {};
        const poolStatus = statusMap.value || 0;
        let invalid = false;
        if(poolStatus == FlightCoordination.IN_POOL || poolStatus == FlightCoordination.IN_POOL_M) {
            invalid = true;
        }
        // 判断时间是否失效
        if(invalid){
            const { invalidDataStyle = "" } = this.props.property;
            if (isValidVariable(data.CTOT)) {
                data.CTOT_style = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('CTOT')
                    + invalidDataStyle;
                data.CTOT_title = data.CTOT.substring(6, 8) + '/'
                    + data.CTOT.substring(8, 12) + '\n失效CTOT时间';
            }
            if (isValidVariable(data.COBT)) {
                data.COBT_style = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('COBT')
                    + invalidDataStyle;
                data.COBT_title = data.COBT.substring(6, 8) + '/'
                    + data.COBT.substring(8, 12) + '\n失效COBT时间';
            }
            if (isValidVariable(data.HOBT)) {
                data.HOBT_style = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('HOBT')
                    + invalidDataStyle;
                data.HOBT_title = data.HOBT.substring(6, 8) + '/'
                    + data.HOBT.substring(8, 12) + '\n失效HOBT时间';
            }
            if (isValidVariable(data.FLOWCONTROL_POINT_PASSTIME)) {
                // 判断航班是否已起飞
                var flightDepStatus = flight.HADDEP.value;
                if(!flightDepStatus) {
                    data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('FLOWCONTROL_POINT_PASSTIME')
                        + invalidDataStyle;
                    data.FLOWCONTROL_POINT_PASSTIME_title = data.FLOWCONTROL_POINT_PASSTIME.substring(6, 8) + '/'
                        + data.FLOWCONTROL_POINT_PASSTIME.substring(8, 12) + '\n失效时间';
                }
            }
        }
    };

    // 返回结果
    return data;
};

const convertToTableStandardDate = function(time){
    if(isValidVariable(time)) {
        let day = time.substring(6, 8);
        let hhmm = time.substring(8, 12);
        return day + '/' + hhmm;
    } else {
        return '';
    }
};
//判断是否已起飞
const ifDep = function (obj){
    if(isValidVariable(obj)){
        let processMap = obj.processMap || '';
        if(isValidVariable(processMap) && isValidVariable(processMap.DEP)){
            return true;
        }
    }
    return false;
};
//告警航班表格数据转换
const convertAlarmData = function( flight, datatime, statusObj ){
    let resArr = [];
    if (isValidVariable(flight)) {
        let flightFieldViewMap = flight.flightFieldViewMap;
        if (isValidObject(flightFieldViewMap)) {
            //获取航班对应的状态信息，取自flightStatusFieldViewMap对应的ALARM_STATUS
            let statusArr = statusObj.statusInfos || [];
            if( statusArr.length > 0 ){
                for(let i = 0,len = statusArr.length; i < len; i++){
                    // 创建结果对象
                    let data = {};
                    let status = statusObj.statusInfos[i];
                    let commentStr = "";
                    if (isValidVariable(status)) {
                        let infoMap = status.infoMap;
                        if (isValidObject(infoMap)){
                            if (isValidVariable(infoMap.ID)) {
                                data.id = infoMap.ID;
                                data.ID = infoMap.ID;
                            }
                            if (isValidVariable(infoMap.FLIGHTID)) {
                                data.FLIGHTID = infoMap.FLIGHTID;
                            }
                            if (isValidVariable(infoMap.TYPE)) {
                                data.TYPE = AlarmType[infoMap.TYPE];
                                data.DESCRIBTION = "";
                                switch(infoMap.TYPE){
                                    case "FLIGHT_CLOSE":{
                                        data.DESCRIBTION = '航班未关舱门';break;
                                    }
                                    case "FLIGHT_CLOSE_WAIT":{
                                        data.DESCRIBTION = '航班未推出';break;
                                    }
                                    case "FLIGHT_PDEPTIME":{
                                        data.DESCRIBTION = '申请时间大于计划时间10分钟以上';break;
                                    }
                                    case "FLIGHT_HOBT":{
                                        data.DESCRIBTION = '实关时间大于协关时间5分钟以上';break;
                                    }
                                    case "FLIGHT_DELAY":{
                                        data.DESCRIBTION = '航班延误';break;
                                    }
                                }
                            }
                            if (isValidVariable(infoMap.REASON)) {
                                let reasonStr = infoMap.REASON;
                                let min = infoMap.VALUE ? infoMap.VALUE : "-";
                                let reason = "";
                                if( reasonStr.indexOf("HOBT_BEFORE") > -1){
                                    reason += "距离协关时间还剩" + min +  "分钟,"
                                }
                                if( reasonStr.indexOf("HOBT_ON") > -1){
                                    reason += "已到协关时间,"
                                }
                                if( reasonStr.indexOf("HOBT_BEYOND") > -1){
                                    reason += "超过协关时间" + min +  "分钟,"
                                }
                                if( reasonStr.indexOf("CLOSE_WAIT") > -1){
                                    reason += "关舱门等待超过" + min +  "分钟,"
                                }
                                if( reasonStr.indexOf("EOBT_GT_SOBT") > -1){
                                    reason += "申请时间大于计划时间" + min +  "分钟,"
                                }
                                if( reasonStr.indexOf("AGCT_GT_HOBT") > -1){
                                    reason += "实关时间大于协关时间" + min +  "分钟,"
                                }
                                if( reasonStr.indexOf("DELAY") > -1){
                                    reason += "航班延误" + min +  "分钟,"
                                }
                                data.REASON = reason.substring(0, reason.length-1);
                            }
                            resArr.push(data);
                        }}
                }
                return resArr;
            }
        }
        return resArr;
    }

};
//失效航班表格数据转换
const convertExpiredData = function (flight, datatime, statusObj ){
    let resArr = [];
    if (isValidVariable(flight)) {
        let flightFieldViewMap = flight.flightFieldViewMap;
        if (isValidObject(flightFieldViewMap)) {
            // 创建结果对象
            let data = this.convertData(flightFieldViewMap, datatime);
            let status = statusObj.value;
            let commentStr = "";
            if (isValidVariable(status)) {
                if (status.indexOf("100") > -1) {
                    commentStr += 'EOBT超时,';
                }
                if (status.indexOf("200") > -1) {
                    commentStr += '退出时隙分配,';
                }
                if (status.indexOf("300") > -1) {
                    commentStr += '人工标记取消,';
                }
                if (status.indexOf("310") > -1) {
                    commentStr += '报文取消,';
                }
            }
            if (commentStr.length > 0) {
                commentStr = commentStr.substring(0, commentStr.length - 1);
            }
            data.COMMENT = commentStr;
            data.COMMENT_title = commentStr;
            resArr.push(data);
            return resArr;
        }
    }
    return resArr;
};
//特殊航班表格数据转换
const converSpecialtData = function( flight, datatime, statusObj ) {
    let resArr = [];
    if (isValidVariable(flight)) {
        let flightFieldViewMap = flight.flightFieldViewMap;
        if (isValidObject(flightFieldViewMap)) {
            // 创建结果对象
            let data = this.convertData(flightFieldViewMap, datatime);
            let status = statusObj.value;
            let commentStr = "";
            if (isValidVariable(status)) {
                if (status.indexOf("NOSLOT") > -1) {
                    commentStr += '退出时隙分配,';
                }
                if (status.indexOf("CNL") > -1) {
                    commentStr += '取消航班,';
                }
                if (status.indexOf("ALN") > -1) {
                    commentStr += '本段返航,';
                }
                if (status.indexOf("RTN") > -1) {
                    commentStr += '本段备降,';
                }
                if (status.indexOf("FORMER_ALN") > -1) {
                    commentStr += '前段返航,';
                }
                if (status.indexOf("FORMER_RTN") > -1) {
                    commentStr += '前段备降,';
                }
                if (status.indexOf("FORMER_ALN_PATCH") > -1) {
                    commentStr += '返航补班,';
                }
                if (status.indexOf("FORMER_RTN_PATCH") > -1) {
                    commentStr += '备降补班,';
                }
            }
            if (commentStr.length > 0) {
                commentStr = commentStr.substring(0, commentStr.length - 1);
            }
            data.COMMENT = commentStr;
            data.COMMENT_title = commentStr;
            resArr.push(data);
            return resArr;
        }
    }
    return resArr;
};
//待办航班表格数据转换
const convertTodoData = function( flight, datatime, statusObj ){
    let resArr = [];
    if (isValidVariable(flight)) {
        let flightFieldViewMap = flight.flightFieldViewMap || {};
        if (isValidObject(flightFieldViewMap)) {
            let statusArr = statusObj.statusInfos || [];
            if(statusArr.length > 0){
                for(let i = 0,len=statusArr.length;i<len;i++){
                    // 创建结果对象
                    let data = {};
                    let status = statusObj.statusInfos[i];
                    let commentStr = "";
                    if (isValidVariable(status)) {
                        let infoMap = status.infoMap;
                        if (isValidVariable(infoMap)) {
                            if (isValidVariable(infoMap.ID)) {
                                data.id = infoMap.ID;
                                data.ID = infoMap.ID;
                            }
                            if (isValidVariable(infoMap.FLIGHTID)) {
                                data.FLIGHTID = infoMap.FLIGHTID;
                            }
                            if (isValidVariable(infoMap.TIMESTAMP)) {
                                data.TIMESTAMP = infoMap.TIMESTAMP.substring(8, 12);
                            }
                            if (isValidVariable(infoMap.TYPE)) {
                                switch (infoMap.TYPE) {
                                    case FlightCoordinationRecord.TYPE_PRIORITY :
                                    {
                                        data.TYPE = "任务";
                                        if (isValidVariable(infoMap.VALUE)) {
                                            data.VALUE = FlightCoordination.getPriorityZh(infoMap.VALUE);
                                        }
                                        break;
                                    }
                                    case FlightCoordinationRecord.TYPE_TOBT :
                                    {
                                        data.TYPE = "预关";
                                        data.VALUE = "";
                                        if (isValidVariable(infoMap.VALUE)) {
                                            data.VALUE = infoMap.VALUE.substring(8);
                                        }
                                        break;
                                    }
                                    case FlightCoordinationRecord.TYPE_HOBT :
                                    {
                                        data.TYPE = "协关";
                                        data.VALUE = "";
                                        if (isValidVariable(infoMap.VALUE)) {
                                            data.VALUE = infoMap.VALUE.substring(8);
                                        }
                                        break;
                                    }
                                    case FlightCoordinationRecord.TYPE_REQ_MANUAL_CTOT :
                                    {
                                        data.TYPE = "CTOT申请";
                                        data.VALUE = "";
                                        break;
                                    }
                                    case FlightCoordinationRecord.TYPE_INPOOL :
                                    {
                                        data.TYPE = "等待池";
                                        data.VALUE = "";
                                        if (isValidVariable(infoMap.VALUE)) {
                                            data.VALUE = FlightCoordination.getPoolStatusZh(infoMap.VALUE);
                                        }
                                        data.COMMENT = "";
                                        break;
                                    }
                                }
                            }
                            data.USER = "";
                            data.USERNAME = "";
                            data.COMMENT = "";
                        }

                        if (commentStr.length > 0) {
                            commentStr = commentStr.substring(0, commentStr.length - 1);
                        }
                        data.COMMENT = commentStr;
                        data.COMMENT_title = commentStr;
                        resArr.push(data);
                    }
                }
                return resArr;
            }
        }
    }
    return resArr;
};

export { convertData, convertDisplayStyle, getDisplayStyle, getDisplayStyleZh, getDisplayFontSize,
    convertAlarmData, convertExpiredData, converSpecialtData, convertTodoData };
