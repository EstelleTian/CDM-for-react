import { isValidVariable, isValidObject, calculateStringTimeDiff, getFullTime } from './basic-verify';
import FmeToday from './fmetoday';
import BasicAirlines from './basic-airlines';
import BasicAddress from './basic-address';
import FlightCoordination from './flightcoordination';
import FlightCoordinationRecord from './flight-coordination-record';
import FlowcontrolUtils from './flowcontrol-utils';

const showLongFlowcontrol = true;

//根据colStyle转为displayStyle和displayStyleComment
const convertDisplayStyle = ( colStyle ) => {
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
    const { displayStyle } = this.props.tableConfig;
    let tempStr = '';
    if (!isValidVariable(displayStyle)
        || !isValidVariable(displayStyle[dataKey])) {
        return '';
    }
    if (isValidVariable(displayStyle[dataKey])) {
        tempStr = displayStyle[dataKey];
        if(tempStr.indexOf('transparent') != -1) {
            tempStr = tempStr.replace('transparent', '');
        }
    }
    return tempStr;
};

//根据dataKey获取指定样式-中文值
const getDisplayStyleZh = function( dataKey ){
    const { displayStyleComment } = this.props.tableConfig;
    if (!isValidVariable(displayStyleComment)
        || !isValidVariable(displayStyleComment[dataKey])) {
        return '';
    } else {
        return displayStyleComment[dataKey];
    }
};

//根据dataKey获取指定字体大小  displayFontSize == colFontSize
const getDisplayFontSize = function( dataKey ){
    const { colFontSize } = this.props.tableConfig;
    if (isValidObject(colFontSize)){
        if (!isValidVariable(colFontSize[dataKey])||!isValidVariable(colFontSize[dataKey]['font-size'])) {
            return '';
        } else {
            return "font-size:" + colFontSize[dataKey]['font-size']+";";
        }
    }
}
/**
 * 转换航班计划表格数据
 */
const convertData = function( flight ){
    // 判断数据有效性
    if (!isValidVariable(flight) || !isValidVariable(flight.fmeToday)) {
        return "";
    }
    //将fmeToday的每个值的首字母大写
    let newFmeToday = {};
    const fmeToday = flight.fmeToday;
    for(let word in fmeToday){
        const value = fmeToday[word];
        if( word == 'flightid' || word == 'formerId' || word == 'teletype' || word == 'editStatusToday'){
            newFmeToday[word] = value;
        }else{
            let newWord = word.replace(word.charAt(0), word.charAt(0).toUpperCase());
            newFmeToday[newWord] = value;
        }
    }
    flight.fmeToday = newFmeToday;

    // 创建结果对象
    let data = {};
    // 设置默认显示样式
    let defaultStyle = this.getDisplayStyle('DEFAULT');
    let defaultFontSize = this.getDisplayFontSize('DEFAULT');
    data.default_style = defaultStyle + defaultFontSize;

    const { invalidDataStyle }= this.props.tableConfig;
    const dataTime = getFullTime( new Date() );
    // 处理数据
    setId( flight, data);
    setsceneCaseId( flight, data);
    setFlightid( flight, data);
    setAircraftType.call(this, flight, data);
    setAircraftWakes.call(this, flight, data);
    setACode.call(this, flight, data);
    setRegistenum.call(this, flight, data);
    setDepapAndArrap.call(this, flight, data);
    setAppfixAndAccFix.call(this, flight, data);

    setPriority.call(this, flight, data);
    setSOBT.call(this, flight, data);
    setEOBT.call(this, flight, data);
    setTOBT.call(this, flight, data);
    setHOBT.call(this, flight, data);
    setCOBT.call(this, flight, dataTime, data);
    setCTOT.call(this, flight, dataTime, data);
    setASBT.call(this, flight, data);
    setAGCT.call(this, flight, data);
    setAOBT.call(this, flight, data);
    setATOT.call(this, flight, data);
    setFormerFlight.call(this, flight, data);
    //设置前段航班CTOT
    setFormerCtot.call(this, flight,data);

    //设置资质
    setQualifcations.call(this, flight,data);
    // setArrTime.call(this, flight, data);
    setALDT.call(this, flight, data);

    setSPOT.call(this, flight, data);
    setDeiceStatus.call(this, flight, data);
    setDeicePosition.call(this, flight, data);
    setDeiceGroup.call(this, flight, data);
    setRunway.call(this, flight, data);
    setTaxi.call(this, flight, data);

    setStatus.call(this, flight, data);
    setPoolStatus.call(this, flight, data);
    setSlotStatus.call(this, flight, data);
    setFlowcontrolStatus.call(this, flight, data);
    const points = undefined;
    const flowId = undefined;
    setFlowcontrolPoint.call(this, flight, data, points, flowId);
    setFlightAppPoint.call(this, flight, data, invalidDataStyle);
    setFlightAccPoint.call(this, flight, data, invalidDataStyle);
    setInvalidData.call(this, flight, data, invalidDataStyle);


    setNormal.call(this, flight, dataTime, data);
    setCloseWait.call(this, flight, data);
    setTaxiWait.call(this, flight, data);
    setDelay.call(this, flight, data);
    setDelayReason.call(this, flight, data);
    setGSOBTAndSEQ.call(this, flight, data);

    // EFPS
    setEfpsFlight.call(this, flight, data);

    setARDT.call(this, flight, data);
    // multi operator
    setMultiOperate.call(this, flight, data);

    markFlightidStyle.call(this, flight, data);
    markDEPFlightStyle.call(this, flight, data, invalidDataStyle);
    markCNLFlightStyle.call(this, flight, data);
    markStatusStyle.call(this, flight, data);

    clearInvalidData.call(this, flight, data);
    // 返回结果
    return data;
};

/**
 * Id
 *
 * @param flight
 
 * @param data
 */
const setId = function( flight, data ){
    data.id = flight.id;
    data.ID = flight.id;
};

/**
 * SCENECASEID
 *
 * @param flight
 * @param data
 */
const setsceneCaseId = function( flight, data){
    data.SCENECASEID = '';
    if(isValidVariable(flight.sceneCaseId)) {
        data.SCENECASEID = flight.sceneCaseId;
    }
};
/**
 * Flightid
 *
 * @param flight
 * @param data
 */
const setFlightid = function( flight, data){
    data.FLIGHTID = "";
    data.FLIGHTID_title = "";
    if (isValidVariable(flight.fmeToday.flightid)) {
        data.FLIGHTID = flight.fmeToday.flightid;
        data.FLIGHTID_title = 'ID:' + flight.id;
        if( FmeToday.isCDMFlight(flight) ){
            data.FLIGHTID_title += '\n' + "CDM航班";
        }else if(FmeToday.isCRSFlight(flight)){
            data.FLIGHTID_title += '\n' + "CRS航班";
        }

    }
    // if (this.codeType == 'IATA' && isValidVariable(data.FLIGHTID)) {
    if (null == 'IATA' && isValidVariable(data.FLIGHTID)) {
        let code = data.FLIGHTID.substring(0, 3);
        data.FLIGHTID = data.FLIGHTID.replace(code, BasicAirlines.getICAO2IATACode(code));
    }
};

/**
 * Registenum
 *
 * @param flight
 * @param data
 */
const setRegistenum = function( flight, data ){
    data.REGNUM = "";
    if (isValidVariable(flight.fmeToday.PRegistenum)) {
        data.REGNUM = flight.fmeToday.PRegistenum;
    }

    let style = this.getDisplayStyle('DEFAULT');
    let fontsize = this.getDisplayFontSize('REGNUM');
    data.REGNUM_style =  style+fontsize;
};

/**
 * ACode
 *
 * @param flight
 * @param data
 */
const setACode = function( flight, data){
    data.ACODE = "";
    if (isValidVariable(flight.fmeToday.RAcode)) {
        data.ACODE = flight.fmeToday.RAcode;
    }
    let style = this.getDisplayStyle('DEFAULT');
    let fontsize = this.getDisplayFontSize('ACODE');
    data.ACODE_style =  style+fontsize;
};

/**
 * AircraftType
 *
 * @param flight
 * @param data
 */
const setAircraftType = function( flight, data){
    data.ACTYPE = "";
    let style = this.getDisplayStyle('DEFAULT');
    let fontsize = this.getDisplayFontSize('ACTYPE');
    if (isValidVariable(flight.fmeToday.PAircrafttype)) {
        data.ACTYPE = flight.fmeToday.PAircrafttype;
    } else if (isValidVariable(flight.fmeToday.SAircrafttype)) {
        data.ACTYPE = flight.fmeToday.SAircrafttype;
    }
    data.ACTYPE_style =  style+fontsize;
};

/**
 * AircraftWakes
 *
 * @param flight
 * @param data
 */
const setAircraftWakes = function( flight, data){
    data.ACWAKES = "";
    let style = this.getDisplayStyle('DEFAULT');
    let fontsize = this.getDisplayFontSize('ACWAKES');
    if (isValidVariable(flight.aircraftWakes)) {
        data.ACWAKES = flight.aircraftWakes;
    }
    data.ACWAKES_style = style+fontsize;
};

/**
 * Depap & Arrap
 *
 * @param flight
 * @param data
 */
const setDepapAndArrap = function( flight, data){
    data.DEPAP = "";
    data.ARRAP = "";
    if (isValidVariable(FmeToday.getRPSDepAP(flight.fmeToday))) {
        data.DEPAP = FmeToday.getRPSDepAP(flight.fmeToday);
    }
    if (isValidVariable(FmeToday.getRPSArrAP(flight.fmeToday))) {
        data.ARRAP = FmeToday.getRPSArrAP(flight.fmeToday);
    }
    if (isValidVariable(data.DEPAP) && this.codeType == 'IATA') {
        data.DEPAP = BasicAddress.getICAO2IATACode(data.DEPAP);
    }
    if (isValidVariable(data.ARRAP) && this.codeType == 'IATA') {
        data.ARRAP = BasicAddress.getICAO2IATACode(data.ARRAP);
    }
    let style = this.getDisplayStyle('DEFAULT');
    let fontsizeD = this.getDisplayFontSize('DEPAP');
    let fontsizeA = this.getDisplayFontSize('ARRAP');
    data.DEPAP_style = style+fontsizeD;
    data.ARRAP_style = style+fontsizeA;
};

/**
 * Appfix & Accfix
 *
 * @param flight
 * @param data
 */
const setAppfixAndAccFix = function( flight, data){
    data.APPFIX = "";
    data.APPFIX_title = '';
    data.ACCFIX = "";
    data.ACCFIX_title = '';
    let slotMpi = "";
    let style = this.getDisplayStyle('DEFAULT');

    if(isValidVariable(flight.autoSlot)){
        slotMpi = FlightCoordination.parseAutoSlotMonitorPointInfo(flight.autoSlot);
    }
    //
    if (isValidVariable(flight.controlInnerWaypointName)) {
        data.APPFIX = flight.controlInnerWaypointName;
        if(isValidVariable(flight.eto2)){
            data.APPFIX_title += '预计:' + flight.eto2.substring(6, 8) + '/' + flight.eto2.substring(8, 12) + '\n';
        }
        if(slotMpi != null && isValidVariable(slotMpi[flight.controlInnerWaypointName])){
            data.APPFIX_title += '计算:' + slotMpi[flight.controlInnerWaypointName]['C'].substring(6, 8) + '/' + slotMpi[flight.controlInnerWaypointName]['C'].substring(8, 12) + '\n';
        }
        if(isValidVariable(flight.cto2)){
            data.APPFIX_title += '锁定:' + flight.cto2.substring(6, 8) + '/' + flight.cto2.substring(8, 12) + '\n';
        }
        if(isValidVariable(flight.ato2)){
            data.APPFIX_title += '实际:' + flight.ato2.substring(6, 8) + '/' + flight.ato2.substring(8, 12);
        }
    }
    if (isValidVariable(flight.controlWaypointName)) {
        data.ACCFIX = flight.controlWaypointName;
        if(isValidVariable(flight.eto)){
            data.ACCFIX_title += '预计:' + flight.eto.substring(6, 8) + '/' + flight.eto.substring(8, 12) + '\n';
        }
        if(slotMpi != null && isValidVariable(slotMpi[flight.controlWaypointName])){
            data.ACCFIX_title += '计算:' + slotMpi[flight.controlWaypointName]['C'].substring(6, 8) + '/' + slotMpi[flight.controlWaypointName]['C'].substring(8, 12) + '\n';
        }
        if(isValidVariable(flight.cto)){
            data.ACCFIX_title += '锁定:' + flight.cto.substring(6, 8) + '/' + flight.cto.substring(8, 12) + '\n';
        }
        if(isValidVariable(flight.ato)){
            data.ACCFIX_title += '实际:' + flight.ato.substring(6, 8) + '/' + flight.ato.substring(8, 12);
        }
    }

    data.APPFIX_style = style + this.getDisplayFontSize('APPFIX');
    data.ACCFIX_style = style + this.getDisplayFontSize('ACCFIX');

    // 显示顺序A、C、SLOT_C、E
    data.CTO2 = "";
    data.CTO2_title = '';
    if (isValidVariable(flight.controlInnerWaypointName)) {
        if(isValidVariable(flight.ato2)){
            // 实际过点时间
            data.CTO2 = flight.ato2;
        } else if(isValidVariable(flight.cto2)) {
            // 计算过点时间
            data.CTO2 = flight.cto2;
        } else if(slotMpi != null && isValidVariable(slotMpi[flight.controlInnerWaypointName])) {
            // slot_c
            data.CTO2 = slotMpi[flight.controlInnerWaypointName]['C'];
        } else if(isValidVariable(flight.eto2)){
            // 预计过点时间
            data.CTO2 = flight.eto2;
        }
        if(isValidVariable(flight.eto2)){
            data.CTO2_title = '预计:' + flight.eto2.substring(6, 8) + '/' + flight.eto2.substring(8, 12) + '\n';
        }
        if(slotMpi != null && isValidVariable(slotMpi[flight.controlInnerWaypointName])){
            data.CTO2_title += '计算:' + slotMpi[flight.controlInnerWaypointName]['C'].substring(6, 8) + '/' + slotMpi[flight.controlInnerWaypointName]['C'].substring(8, 12) + '\n';
        }
        if(isValidVariable(flight.cto2)) {
            data.CTO2_title += '锁定:' + flight.cto2.substring(6, 8) + '/' + flight.cto2.substring(8, 12) + '\n';
        }
        if(isValidVariable(flight.ato2)){
            data.CTO2_title += '实际:' + flight.ato2.substring(6, 8) + '/' + flight.ato2.substring(8, 12);
        }
    }
    data.CTO2_style = style + this.getDisplayFontSize('CTO2');

    // 显示顺序A、C、SLOT_C、E
    data.CTO = "";
    data.CTO_title = '';
    if (isValidVariable(flight.controlWaypointName)) {
        if(isValidVariable(flight.ato)){
            // 实际过点时间
            data.CTO = flight.ato;
        } else if(isValidVariable(flight.cto)){
            // 计算过点时间
            data.CTO = flight.cto;
        } else if(slotMpi != null && isValidVariable(slotMpi[flight.controlWaypointName])) {
            // slot_c
            data.CTO = slotMpi[flight.controlWaypointName]['C'];
        } else if(isValidVariable(flight.eto)){
            // 预计过点时间
            data.CTO = flight.eto;
        }
        if(isValidVariable(flight.eto)){
            data.CTO_title = '预计:' + flight.eto.substring(6, 8) + '/' + flight.eto.substring(8, 12) + '\n';
        }
        if(slotMpi != null && isValidVariable(slotMpi[flight.controlWaypointName])){
            data.CTO_title += '计算:' + slotMpi[flight.controlWaypointName]['C'].substring(6, 8) + '/' + slotMpi[flight.controlWaypointName]['C'].substring(8, 12) + '\n';
        }
        if(isValidVariable(flight.cto)){
            data.CTO_title += '锁定:' + flight.cto.substring(6, 8) + '/' + flight.cto.substring(8, 12) + '\n';
        }
        if(isValidVariable(flight.ato)){
            data.CTO_title += '实际:' + flight.ato.substring(6, 8) + '/' + flight.ato.substring(8, 12);
        }
    }
    data.CTO_style = style + this.getDisplayFontSize('CTO');

};

/**
 * Priority
 *
 * @param flight
 * @param data
 */
const setPriority = function( flight, data){
    data.PRIORITY = "";
    data.PRIORITY_title = "";
    data.PRIORITY_style = "";
    data.priority = "";
    let style = this.getDisplayStyle('DEFAULT');

    // 判断来源
    if ((isValidVariable(flight.cpriority)
            && flight.cpriority > FlightCoordination.PRIORITY_NORMAL
            && flight.cpriority > flight.priority)) {
        // 系统
        data.priority = flight.cpriority;
    } else if (isValidVariable(flight.priority)) {
        // 航班
        data.priority = flight.priority;
    } else {
        // 默认普通
        data.priority = FlightCoordination.PRIORITY_NORMAL;
    }
    data.PRIORITY = FlightCoordination.getPriorityZh(
        data.priority, data.ARRAP);

    // 判断协调情况
    if (isValidVariable(flight.coordinationRecords)) {
        let record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_PRIORITY];
        if (isValidVariable(record) && isValidVariable(record.status)) {
            let status = record.status;
            if (status == FlightCoordinationRecord.STATUS_APPLY) {
                // 申请
                style = this.getDisplayStyle('PRIORITY_APPLY');
                data.PRIORITY_title = this.getDisplayStyleZh('PRIORITY_APPLY');
            }
            if (status == FlightCoordinationRecord.STATUS_APPROVE
                || FlightCoordination.PRIORITY_ICE == flight.priority) {
                // 批复
                style = this.getDisplayStyle('PRIORITY_APPROVE');
                data.PRIORITY_title = this.getDisplayStyleZh('PRIORITY_APPROVE');
            }
            if (status == FlightCoordinationRecord.STATUS_REFUSE) {
                // 拒绝
                style = this.getDisplayStyle('PRIORITY_REFUSE');
                data.PRIORITY_title = this.getDisplayStyleZh('PRIORITY_REFUSE');
            }

        }
    }
    let fontsize = this.getDisplayFontSize('PRIORITY');
    data.PRIORITY_style = style + fontsize;
};

/**
 * SOBT
 *
 * @param flight
 * @param data
 */
const setSOBT = function( flight, data){
    data.SOBT = "";
    data.SOBT_style = "";
    data.SOBT_title = "";
    let style = this.getDisplayStyle('DEFAULT');
    //
    if (isValidVariable(flight.fmeToday.SDeptime)) {
        data.SOBT = flight.fmeToday.SDeptime;
        style = this.getDisplayStyle('SOBT');
        data.SOBT_title = data.SOBT.substring(6, 8) + '/'
            + data.SOBT.substring(8, 12) + '\n'
            + this.getDisplayStyleZh('SOBT');
    }
    let fontsize = this.getDisplayFontSize('SOBT');
    data.SOBT_style = style + fontsize;
};

const setEOBT = function( flight, data){
    data.EOBT = "";
    data.EOBT_style = "";
    data.EOBT_title = "";
    let style = this.getDisplayStyle('DEFAULT');
    //
    if (isValidVariable(flight.fmeToday.PDeptime)
        && !FmeToday.hadTele(flight.fmeToday, 'MRR')
        && FmeToday.hadFPL(flight.fmeToday)) {
        data.EOBT = flight.fmeToday.PDeptime;
        style = this.getDisplayStyle('EOBT');
        data.EOBT_title = data.EOBT.substring(6, 8) + '/'
            + data.EOBT.substring(8, 12) + '\n'
            + this.getDisplayStyleZh('EOBT');
        // 判断来源
        if (FmeToday.hadTele(flight.fmeToday, 'DLA')) {
            data.EOBT_title = 'DLA ' + data.EOBT_title;
        } else if (FmeToday.hadTele(flight.fmeToday, 'CHG')) {
            data.EOBT_title = 'CHG ' + data.EOBT_title;
        } else if (FmeToday.hadTele(flight.fmeToday, 'FPL')) {
            data.EOBT_title = 'FPL ' + data.EOBT_title;
        }
    }
    let fontsize = this.getDisplayFontSize('EOBT');
    data.EOBT_style = style + fontsize;
};

/**
 * TOBT
 *
 * @param flight
 * @param data
 */
const setTOBT = function( flight, data){
    data.TOBT = "";
    data.TOBT_style = "";
    data.TOBT_title = "";
    data.TOBT_UPDATE_TIME = "";
    data.TOBT_UPDATE_TIME_title = "";
    let style = this.getDisplayStyle('DEFAULT');

    let array = FlightCoordination.getTOBT(flight);
    if(array != null){
        // 判断来源
        data.TOBT = array[0];

        if(FlightCoordination.TOBT_PREDICT == array[1]){
            // 系统
            style = this.getDisplayStyle('TOBT_SYSTEM');
            data.TOBT_title = data.TOBT.substring(6, 8) + '/'
                + data.TOBT.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('TOBT_SYSTEM');
            data.STATUS_style = this.getDisplayStyle('TOBT_SYSTEM') + this.getDisplayFontSize('DEFAULT');

        } else if (FlightCoordination.TOBT_FPL == array[1]){
            // 报文
            style = this.getDisplayStyle('TOBT_EOBT');
            data.TOBT_title = data.TOBT.substring(6, 8) + '/'
                + data.TOBT.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('TOBT_EOBT');
        }

    }

    // 判断协调情况
    if (isValidVariable(data.TOBT)) {
        if (isValidVariable(flight.coordinationRecords)) {
            let tobtRecord = flight.coordinationRecords[FlightCoordinationRecord.TYPE_TOBT];
            if (isValidVariable(tobtRecord)
                && isValidVariable(tobtRecord.status)) {
                let status = tobtRecord.status;
                let value = tobtRecord.value;
                let originalValue = tobtRecord.originalValue;
                if (status == FlightCoordinationRecord.STATUS_APPLY
                    && (originalValue == data.TOBT || undefined == originalValue) ) {
                    // 申请
                    style = this.getDisplayStyle('TOBT_APPLY');
                    data.TOBT_title = data.TOBT.substring(6, 8) + '/'
                        + data.TOBT.substring(8, 12) + '\n'
                        + this.getDisplayStyleZh('TOBT_APPLY');
                } else if (status == FlightCoordinationRecord.STATUS_APPROVE
                    && value == data.TOBT) {
                    // 批复
                    style = this.getDisplayStyle('TOBT_APPROVE');
                    data.TOBT_title = data.TOBT.substring(6, 8) + '/'
                        + data.TOBT.substring(8, 12) + '\n'
                        + this.getDisplayStyleZh('TOBT_APPROVE');
                } else if (status == FlightCoordinationRecord.STATUS_REFUSE
                    && originalValue == data.TOBT) {
                    // 拒绝
                    style = this.getDisplayStyle('TOBT_REFUSE');
                    data.TOBT_title = data.TOBT.substring(6, 8) + '/'
                        + data.TOBT.substring(8, 12) + '\n'
                        + this.getDisplayStyleZh('TOBT_REFUSE');
                } else if (status == FlightCoordinationRecord.STATUS_MODIFY
                    && value == data.TOBT) {
                    // 调整
                    style = this.getDisplayStyle('TOBT_IMPROVE');
                    data.TOBT_title = data.TOBT.substring(6, 8) + '/'
                        + data.TOBT.substring(8, 12) + '\n'
                        + this.getDisplayStyleZh('TOBT_IMPROVE');
                }
            }
        }
    }
    if(isValidVariable(flight.tobtUpdateTime)) {
        data.TOBT_UPDATE_TIME = flight.tobtUpdateTime;
        data.TOBT_UPDATE_TIME_title  = '录入时间: ' + flight.tobtUpdateTime.substring(6, 8) + '/'
            + flight.tobtUpdateTime.substring(8, 12);

        //
        if(isValidVariable(data.TOBT_title)) {
            data.TOBT_title = data.TOBT_title  +  '\n' + '录入时间: ' + flight.tobtUpdateTime.substring(6, 8) + '/'
                + flight.tobtUpdateTime.substring(8, 12);
        } else {
            data.TOBT_title ='录入时间: ' + flight.tobtUpdateTime.substring(6, 8) + '/'
                + flight.tobtUpdateTime.substring(8, 12);
        }
    }
    let fontsize = this.getDisplayFontSize('TOBT');
    data.TOBT_style = fontsize + style;
};

/**
 * HOBT
 *
 * @param flight
 * @param data
 */
const setHOBT = function( flight, data){
    data.HOBT = "";
    data.HOBT_style = "";
    data.HOBT_title = "";

    //
    if (isValidVariable(flight.hobt)) {
        data.HOBT = flight.hobt;
        let style;
        // 判断协调情况
        if (isValidVariable(flight.coordinationRecords)) {
            // 有协调
            let hobtRecord = flight.coordinationRecords[FlightCoordinationRecord.TYPE_HOBT];
            if (isValidVariable(hobtRecord)
                && isValidVariable(hobtRecord.status)) {
                // 判断协调状态
                let status = hobtRecord.status;
                if (status == FlightCoordinationRecord.STATUS_APPLY) {
                    // 申请
                    style = this.getDisplayStyle('HOBT_APPLY');
                    data.HOBT_title = data.HOBT.substring(6, 8) + '/'
                        + data.HOBT.substring(8, 12) + '\n'
                        + this.getDisplayStyleZh('HOBT_APPLY');
                } else if (status == FlightCoordinationRecord.STATUS_APPROVE) {
                    // 批复
                    style = this.getDisplayStyle('HOBT_APPROVE');
                    data.HOBT_title = data.HOBT.substring(6, 8) + '/'
                        + data.HOBT.substring(8, 12) + '\n'
                        + this.getDisplayStyleZh('HOBT_APPROVE');
                } else if (status == FlightCoordinationRecord.STATUS_REFUSE) {
                    // 拒绝
                    style = this.getDisplayStyle('HOBT_REFUSE');
                    data.HOBT_title = data.HOBT.substring(6, 8) + '/'
                        + data.HOBT.substring(8, 12) + '\n'
                        + this.getDisplayStyleZh('HOBT_REFUSE');
                }
            } else {
                // 无协调默认显示
                data.HOBT_title = data.HOBT.substring(6, 8) + '/'
                    + data.HOBT.substring(8, 12) + '\n';
                style = this.getDisplayStyle('DEFAULT');
            }
        } else {
            // 无协调默认显示
            data.HOBT_title = data.HOBT.substring(6, 8) + '/'
                + data.HOBT.substring(8, 12) + '\n';
            style = this.getDisplayStyle('DEFAULT');
        }
        let fontsize = this.getDisplayFontSize('HOBT');
        data.HOBT_style = style + fontsize;
    }
};

/**
 * COBT 预撤时间
 *
 * @param flight
 * @param data
 */
const setCOBT = function( flight, dataTime, data){
    data.COBT = "";
    data.COBT_style = "";
    data.COBT_title = "";
    let style;
    if(flight.locked == FlightCoordination.LOCKED
        || flight.locked == FlightCoordination.LOCKED_IMPACT) {
        // 人工
        data.COBT = flight.cobt;
        if(isValidVariable(data.COBT)){
            style = this.getDisplayStyle('COBT_MANUAL');
            data.COBT_title = data.COBT.substring(6, 8) + '/'
                + data.COBT.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('COBT_MANUAL');
        }
    } else if(flight.locked == FlightCoordination.UNLOCK
        && (isValidVariable(flight.cobt)
            || isValidVariable(flight.ctd))) {
        // 锁定
        data.COBT = flight.cobt;
        // if(isValidVariable(this.systemConfigs.cobtPreLockStatus)) {
        //TODO 目前写固定值 this.systemConfigs.cobtPreLockStatus == 10
        //TODO 目前写固定值 this.systemConfigs.cobtPreLockTime == 15
        if(isValidVariable( 10 )) {
            let diff = calculateStringTimeDiff(flight.cobt, dataTime)/60/1000;
            //if( this.systemConfigs.cobtPreLockStatus != FlightCoordination.STATUS_COBT_PRE_LOCK && diff >= this.systemConfigs.cobtPreLockTime) {
            if( 10 != FlightCoordination.STATUS_COBT_PRE_LOCK && diff >= 15) {
                style = this.getDisplayStyle('COBT_LOCK');
                data.COBT_title = data.COBT.substring(6, 8) + '/'
                    + data.COBT.substring(8, 12) + '\n'
                    + this.getDisplayStyleZh('COBT_LOCK');
            } else {
                style = this.getDisplayStyle('COBT');
                data.COBT_title = data.COBT.substring(6, 8) + '/'
                    + data.COBT.substring(8, 12) + '\n'
                    + this.getDisplayStyleZh('COBT');
            }
        } else {
            style = this.getDisplayStyle('COBT');
            data.COBT_title = data.COBT.substring(6, 8) + '/'
                + data.COBT.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('COBT');
        }
    } else if(flight.locked == FlightCoordination.UNLOCK
        && isValidVariable(flight.autoSlot)
        && isValidVariable(flight.autoSlot.ctd)) {
        // 自动
        data.COBT = flight.autoSlot.cobt;
        style = this.getDisplayStyle('COBT_AUTO');
        data.COBT_title = data.COBT.substring(6, 8) + '/'
            + data.COBT.substring(8, 12) + '\n'
            + this.getDisplayStyleZh('COBT_AUTO');
    }
    let fontsize = this.getDisplayFontSize('COBT');
    data.COBT_style = style + fontsize;
};

/**
 * CTOT 预起时间
 *
 * @param flight
 * @param data
 */
const setCTOT = function( flight, dataTime, data){
    data.CTOT = '';
    data.CTOT_style = '';
    data.CTOT_title = '';
    let style;
    if(flight.locked == FlightCoordination.LOCKED
        || flight.locked == FlightCoordination.LOCKED_IMPACT) {
        // 人工
        data.CTOT = flight.ctd != undefined ? flight.ctd : "";
        if(isValidVariable(data.CTOT)){
            style = this.getDisplayStyle('CTOT_MANUAL');
            data.CTOT_title = data.CTOT.substring(6, 8) + '/'
                + data.CTOT.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('CTOT_MANUAL');
        }
    } else if(flight.locked == FlightCoordination.UNLOCK
        && (isValidVariable(flight.cobt)
            || isValidVariable(flight.ctd))) {
        // 锁定
        data.CTOT = flight.ctd != undefined ? flight.ctd : "";
        // 判断锁定状态：预锁/锁定  （锁定值<Now+参数为锁定，否则为预锁状态）
        // if(!$.isValidVariable(this.systemConfigs.cobtPreLockTime)) {
        if(!isValidVariable(15)) {
            console.info('error : systemConfigs.cobtPreLockTime is null');
        }
        // if($.isValidVariable(this.systemConfigs.cobtPreLockStatus)) {
        if(isValidVariable(10)) {
            let diff = calculateStringTimeDiff(flight.cobt, dataTime)/60/1000;
            if( 10 != FlightCoordination.STATUS_COBT_PRE_LOCK && diff >= 15) {
                style = this.getDisplayStyle('CTOT_LOCK');
                data.CTOT_title = data.CTOT.substring(6, 8) + '/'
                    + data.CTOT.substring(8, 12) + '\n'
                    + this.getDisplayStyleZh('CTOT_LOCK');
            } else {
                style = this.getDisplayStyle('CTOT');
                data.CTOT_title = data.CTOT.substring(6, 8) + '/'
                    + data.CTOT.substring(8, 12) + '\n'
                    + this.getDisplayStyleZh('CTOT');
            }
        } else {
            style = this.getDisplayStyle('CTOT');
            data.CTOT_title = data.CTOT.substring(6, 8) + '/'
                + data.CTOT.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('CTOT');
        }
    } else if(flight.locked == FlightCoordination.UNLOCK
        && isValidVariable(flight.autoSlot)
        && isValidVariable(flight.autoSlot.ctd)) {
        // 自动
        data.CTOT = flight.autoSlot.ctd != undefined ? flight.autoSlot.ctd : "";
        style = this.getDisplayStyle('CTOT_AUTO');
        data.CTOT_title = data.CTOT.substring(6, 8) + '/'
            + data.CTOT.substring(8, 12) + '\n'
            + this.getDisplayStyleZh('CTOT_AUTO');
    }
    let fontsize = this.getDisplayFontSize('CTOT');
    data.CTOT_style = style + fontsize;
};

/**
 * ASBT
 *
 * @param flight
 * @param data
 */
const setASBT = function( flight, data){
    data.ASBT = "";
    data.ASBT_style = "";
    data.ASBT_title = "";
    let style = this.getDisplayStyle('DEFAULT');

    //
    if (isValidVariable(flight.boardingTime)) {
        data.ASBT = flight.boardingTime;
        data.ASBT_title = flight.boardingTime.substring(6, 8) + '/'
            + flight.boardingTime.substring(8, 12) + '\n';
        // 判断来源
        if (isValidVariable(flight.coordinationRecords)
            && isValidVariable(flight.coordinationRecords[FlightCoordinationRecord.TYPE_BOARDINGTIME])) {
            // 人工
            let record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_BOARDINGTIME];
            data.ASBT_title = data.ASBT_title
                + this.getDisplayStyleZh('ASBT_MENUAL');
            style = this.getDisplayStyle('ASBT_MENUAL');
            // 显示录入时间
            data.ASBT_title = data.ASBT_title + '\n'
                + '录入时间: ' + record.timestamp.substring(6, 8) + '/'
                + record.timestamp.substring(8, 12);
        } else {
            // 引接
            data.ASBT_title = data.ASBT_title + this.getDisplayStyleZh('ASBT_IMPORT');
            style = this.getDisplayStyle('ASBT_IMPORT');
        }
    }
    let fontsize = this.getDisplayFontSize('ASBT');
    data.ASBT_style = style + fontsize;
};

/**
 * AGCT
 *
 * @param flight
 * @param data
 */
const setAGCT = function( flight, data){
    data.AGCT = "";
    data.AGCT_style = "";
    data.AGCT_title = "";
    let style = this.getDisplayStyle('DEFAULT');
    // 判断来源
    if (isValidVariable(flight.closeTime)) {
        // 人工或引接
        data.AGCT = flight.closeTime;
        // 判断是否有协调记录
        if (isValidVariable(flight.coordinationRecords)
            && isValidVariable(flight.coordinationRecords[FlightCoordinationRecord.TYPE_CLOSETIME])) {
            // 人工
            style = this.getDisplayStyle('AGCT_MANUAL');
            data.AGCT_title = data.AGCT.substring(6, 8) + '/'
                + data.AGCT.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('AGCT_MANUAL');
            // 显示录入时间
            let record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_CLOSETIME];
            data.AGCT_title = data.AGCT_title + '\n' + '录入时间: '
                + record.timestamp.substring(6, 8) + '/'
                + record.timestamp.substring(8, 12);
        } else {
            // 引接
            style = this.getDisplayStyle('AGCT_IMPORT');
            data.AGCT_title = data.AGCT.substring(6, 8) + '/'
                + data.AGCT.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('AGCT_IMPORT');
        }

        // 如同时存在报文，则在title中同时显示
        if (isValidVariable(flight.fmeToday.RCldtime)) {
            data.AGCT_title = data.AGCT_title + '\n'
                + flight.fmeToday.RCldtime.substring(6, 8) + '/'
                + flight.fmeToday.RCldtime.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('AGCT_TELE');
        }

    } else if (isValidVariable(flight.fmeToday.RCldtime)) {
        // 报文
        data.AGCT = flight.fmeToday.RCldtime;
        style = this.getDisplayStyle('AGCT_TELE');
        data.AGCT_title = data.AGCT.substring(6, 8) + '/'
            + data.AGCT.substring(8, 12) + '\n'
            + this.getDisplayStyleZh('AGCT_TELE');
    }
    let fontsize = this.getDisplayFontSize('AGCT');
    data.AGCT_style = style + fontsize;
};

/**
 * AOBT
 *
 * @param flight
 * @param data
 */
const setAOBT = function( flight, data){
    data.AOBT = "";
    data.AOBT_style = "";
    data.AOBT_title = "";
    let style = this.getDisplayStyle('DEFAULT');
    // 判断来源
    if(flight.efpsFlight != null && isValidVariable(flight.efpsFlight.pusTime)) {
        // 进程单许可的推出时间
        data.AOBT = flight.efpsFlight.pusTime;
        style = this.getDisplayStyle('AOBT_EFPS');
        data.AOBT_title = data.AOBT.substring(6, 8) + '/'
            + data.AOBT.substring(8, 12) + '\n'
            + this.getDisplayStyleZh('AOBT_EFPS');
        // 录入时间
        if(isValidVariable(flight.aobtAirline)){
            data.AOBT_title = data.AOBT_title + '\n'
                + flight.aobtAirline.substring(6, 8) + '/'
                + flight.aobtAirline.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('AOBT_MANUAL');
            // 显示录入时间
            let record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_AOBT];
            data.AOBT_title = data.AOBT_title + '\n' + '录入时间: '
                + record.timestamp.substring(6, 8) + '/'
                + record.timestamp.substring(8, 12);
        }
        // 引接
        if (isValidVariable(flight.aobt)) {
            data.AOBT_title = data.AOBT_title + '\n'
                + flight.aobt.substring(6, 8) + '/'
                + flight.aobt.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('AOBT_IMPORT');
        }
        // 如同时存在报文，则在title中同时显示
        if (isValidVariable(flight.fmeToday.ROuttime)) {
            data.AOBT_title = data.AOBT_title + '\n'
                + flight.fmeToday.ROuttime.substring(6, 8) + '/'
                + flight.fmeToday.ROuttime.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('AOBT_TELE');
        }
    } else if (isValidVariable(flight.aobt)) {
        // 引接
        data.AOBT = flight.aobt;
        style = this.getDisplayStyle('AOBT_IMPORT');
        data.AOBT_title = data.AOBT.substring(6, 8) + '/'
            + data.AOBT.substring(8, 12) + '\n'
            + this.getDisplayStyleZh('AOBT_IMPORT');
        // 录入时间
        if(isValidVariable(flight.aobtAirline)){
            data.AOBT_title = data.AOBT_title + '\n'
                + flight.aobtAirline.substring(6, 8) + '/'
                + flight.aobtAirline.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('AOBT_MANUAL');
            // 显示录入时间
            let record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_AOBT];
            data.AOBT_title = data.AOBT_title + '\n' + '录入时间: '
                + record.timestamp.substring(6, 8) + '/'
                + record.timestamp.substring(8, 12);
        }
        // 如同时存在报文，则在title中同时显示
        if (isValidVariable(flight.fmeToday.ROuttime)) {
            data.AOBT_title = data.AOBT_title + '\n'
                + flight.fmeToday.ROuttime.substring(6, 8) + '/'
                + flight.fmeToday.ROuttime.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('AOBT_TELE');
        }
    } else if(isValidVariable(flight.aobtAirline)){
        data.AOBT = flight.aobtAirline;
        style = this.getDisplayStyle('AOBT_MANUAL');
        data.AOBT_title = data.AOBT.substring(6, 8) + '/'
            + data.AOBT.substring(8, 12) + '\n'
            + this.getDisplayStyleZh('AOBT_MANUAL');
        // 显示录入时间
        let record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_AOBT];
        data.AOBT_title = data.AOBT_title + '\n' + '录入时间: '
            + record.timestamp.substring(6, 8) + '/'
            + record.timestamp.substring(8, 12);

        // 如同时存在报文，则在title中同时显示
        if (isValidVariable(flight.fmeToday.ROuttime)) {
            data.AOBT_title = data.AOBT_title + '\n'
                + flight.fmeToday.ROuttime.substring(6, 8) + '/'
                + flight.fmeToday.ROuttime.substring(8, 12) + '\n'
                + this.getDisplayStyleZh('AOBT_TELE');
        }
    } else if (isValidVariable(flight.fmeToday.ROuttime)) {
        // 报文
        data.AOBT = flight.fmeToday.ROuttime;
        style = this.getDisplayStyle('AOBT_TELE');
        data.AOBT_title = data.AOBT.substring(6, 8) + '/'
            + data.AOBT.substring(8, 12) + '\n'
            + this.getDisplayStyleZh('AOBT_TELE');
    }
    let fontsize = this.getDisplayFontSize('AOBT');
    data.AOBT_style = style + fontsize;
};

/**
 * ATOT
 *
 * @param flight
 * @param data
 */
const setATOT = function( flight, data){
    data.ATOT = "";
    data.ATOT_style = "";
    data.ATOT_title = "";
    let style = this.getDisplayStyle('DEFAULT');
    if (isValidVariable(flight.fmeToday.RDeptime)) {
        data.ATOT = flight.fmeToday.RDeptime;
        style = this.getDisplayStyle('ATOT');
        data.ATOT_title = data.ATOT.substring(6, 8) + '/'
            + data.ATOT.substring(8, 12) + '\n'
            + this.getDisplayStyleZh('ATOT');
    }
    let fontsize = this.getDisplayFontSize('ATOT');
    data.ATOT_style = style + fontsize;
};

/**
 * ALDT
 *
 * @param flight
 * @param data
 */
const setALDT = function( flight, data){
    data.ALDT = "";
    data.ALDT_style = "";
    data.ALDT_title = "";
    let style = this.getDisplayStyle('DEFAULT');
    if (isValidVariable(flight.fmeToday.RArrtime)) {
        data.ALDT = flight.fmeToday.RArrtime;
        style = this.getDisplayStyle('ATOT');
        data.ALDT_title = data.ALDT.substring(6, 8) + '/'
            + data.ALDT.substring(8, 12) + '\n'
            + this.getDisplayStyleZh('ATOT');
    }
    let fontsize = this.getDisplayFontSize('ATOT');
    data.ALDT_style = style + fontsize;
};

/**
 * 本厂离港航班的落地时间eta
 *
 * @param flight
 * @param data
 */
/*const setArrTime = function( flight, data) =>{
	 data.ALDT = "";
	 data.ALDT_style = "";
	 data.ALDT_title = "";

	 // 前段降落
	 if (isValidVariable(flight.arrTime)
	 && flight.arrTime.length >= 13) {
	 // 降落时间
	 data.ALDT = flight.arrTime.substring(1);
	 // 降落时间缩写
	 let arrTime = flight.arrTime.substring(7, 9) + '/'
	 + flight.arrTime.substring(9, 13);

	 // 判断降落时间类型
	 if (flight.arrTime.indexOf('R') == 0) {
	 // 实际
	 data.ALDT_style = this
	 .this.getDisplayStyle('FORMER_ARR_REALITY');
	 data.ALDT_title = '实际降落: ' + arrTime;
	 } else if (flight.arrTime.indexOf('D') == 0) {
	 // 雷达降落
	 data.ALDT_style = this
	 .this.getDisplayStyle('FORMER_ARR_RADAR');
	 data.ALDT_title = '雷达降落: ' + arrTime;
	 } else if (flight.arrTime.indexOf('P') == 0) {
	 // 预计
	 data.ALDT_style = this
	 .this.getDisplayStyle('FORMER_ARR_PREDICT');
	 data.ALDT_title = '预计降落: ' + arrTime;
	 } else if (flight.arrTime.indexOf('T') == 0) {
	 // 预计-未起飞超时
	 data.ALDT_style = this
	 .this.getDisplayStyle('FORMER_ARR_TIMEOUT');
	 data.ALDT_title = '未起飞超时: ' + arrTime;
	 } else if (flight.arrTime.indexOf('N') == 0) {
	 // 预计-未正常起飞
	 data.ALDT_style = this
	 .this.getDisplayStyle('FORMER_ARR_NORMAL');
	 data.ALDT_title = '未起飞正常: ' + arrTime;
	 }
	 }
	 };
	 */

/**
 *
 * @param flight
 * @param data
 */
const setInvalidData = function( flight, data, invalidDataStyle){
    // 若航班已经入池  则认为航班原先锁定或者指定的CTOT,COBT时间失效时间以下划线显示
    // 判断是否进入等待池
    let invalid = false;
    if(flight.poolStatus == FlightCoordination.IN_POOL
        || flight.poolStatus == FlightCoordination.IN_POOL_M) {
        invalid = true;
    }

    // 判断时间是否失效
    if(invalid){
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
            let flightDepStatus = isValidVariable(flight.fmeToday.RDepap)
                || isValidVariable(flight.estInfo)
                || isValidVariable(flight.updateTime);
            if(!flightDepStatus) {
                data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('FLOWCONTROL_POINT_PASSTIME')
                    + invalidDataStyle;
                data.FLOWCONTROL_POINT_PASSTIME_title = data.FLOWCONTROL_POINT_PASSTIME.substring(6, 8) + '/'
                    + data.FLOWCONTROL_POINT_PASSTIME.substring(8, 12) + '\n失效时间';
            }
        }
    }
};

/**
 * FormerFlight
 *
 * @param flight
 * @param data
 */
const setFormerFlight = function( flight, data){
    data.FORMER_FLIGHTID = flight.formerFlightid;
    data.FORMER_DEP = "";
    data.FORMER_ARR = "";
    data.FORMER_DEP_title = "";
    data.FORMER_DEP_style = "";
    data.FORMER_ARR_title = "";
    data.FORMER_ARR_style = "";

    // 前段航班号
    if (isValidVariable(flight.formerFlightid)) {
        if (isValidVariable(flight.formerId)) {
            data.FORMER_FLIGHTID_title = 'ID:' + flight.formerId + '\n';
        } else if (isValidVariable(flight.fmeToday.formerId)) {
            data.FORMER_FLIGHTID_title = 'ID:' + flight.fmeToday.formerId + '\n';
        }
    }
    if (this.codeType == 'IATA' && isValidVariable(data.FORMER_FLIGHTID)) {
        let code = data.FORMER_FLIGHTID.substring(0, 3);
        data.FORMER_FLIGHTID = data.FORMER_FLIGHTID.replace(code,
            BasicAirlines.getICAO2IATACode(code));
    }
    let style = this.getDisplayStyle('DEFAULT');
    // 前段起飞&前段降落信息
    if (isValidVariable(data.FORMER_FLIGHTID)) {
        // 前段起飞
        if (isValidVariable(flight.formerDeptime)
            && flight.formerDeptime.length >= 13) {
            // 起飞时间
            data.FORMER_DEP = flight.formerDeptime.substring(1);
            // 起飞时间缩写
            let formerDeptime = flight.formerDeptime.substring(7, 9) + '/'
                + flight.formerDeptime.substring(9, 13);
            // 起飞机场
            let formerDepap = flight.formerDepap;

            // 判断起飞时间类型
            if (flight.formerDeptime.indexOf('R') == 0) {
                // 实际
                data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
                    + data.FORMER_FLIGHTID + '\n' + '起飞机场: '
                    + formerDepap + '\n' + '实际起飞: ' + formerDeptime;
                data.FORMER_DEP_title = '实际起飞: ' + formerDeptime;
            } else if (flight.formerDeptime.indexOf('P') == 0) {
                // 预计
                data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
                    + data.FORMER_FLIGHTID + '\n' + '起飞机场: '
                    + formerDepap + '\n' + '预计起飞: ' + formerDeptime;
                data.FORMER_DEP_title = '预计起飞: ' + formerDeptime;
            } else if (flight.formerDeptime.indexOf('S') == 0) {
                // 计划
                data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
                    + data.FORMER_FLIGHTID + '\n' + '起飞机场: '
                    + formerDepap + '\n' + '计划起飞: ' + formerDeptime;
                data.FORMER_DEP_title = '计划起飞: ' + formerDeptime;
            }
        }
        // 前段降落
        if (isValidVariable(flight.formerArrtime)
            && flight.formerArrtime.length >= 13) {
            // 降落时间
            data.FORMER_ARR = flight.formerArrtime.substring(1);
            // 降落时间缩写
            let formerArrtime = flight.formerArrtime.substring(7, 9) + '/'
                + flight.formerArrtime.substring(9, 13);

            // 判断降落时间类型
            if (flight.formerArrtime.indexOf('R') == 0) {
                // 实际
                data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
                    + '\n' + '实际降落: ' + formerArrtime;
                style = this.getDisplayStyle('FORMER_ARR_REALITY');
                data.FORMER_ARR_title = '实际降落: ' + formerArrtime;
            } else if (flight.formerArrtime.indexOf('D') == 0) {
                // 雷达
                data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
                    + '\n' + '雷达降落: ' + formerArrtime;
                style = this.getDisplayStyle('FORMER_ARR_RADAR');
                data.FORMER_ARR_title = '雷达降落: ' + formerArrtime;
            } else if (flight.formerArrtime.indexOf('P') == 0) {
                // 预计
                data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
                    + '\n' + '预计降落: ' + formerArrtime;
                style = this.getDisplayStyle('FORMER_ARR_PREDICT');
                data.FORMER_ARR_title = '预计降落: ' + formerArrtime;
            } else if (flight.formerArrtime.indexOf('T') == 0) {
                // 预计-未起飞超时
                data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
                    + '\n' + '预计降落: ' + formerArrtime;
                style = this.getDisplayStyle('FORMER_ARR_TIMEOUT');
                data.FORMER_ARR_title = '未起飞超时: ' + formerArrtime;
            } else if (flight.formerArrtime.indexOf('N') == 0) {
                // 预计-未正常起飞
                data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
                    + '\n' + '预计降落: ' + formerArrtime;
                style = this.getDisplayStyle('FORMER_ARR_NORMAL');
                data.FORMER_ARR_title = '未起飞正常: ' + formerArrtime;
            }
        }
    }
    //前端航班样式只作用在前端降落时间上
    data.FORMER_ARR_style = style + this.getDisplayFontSize('FORMER_ARR');
    data.FORMER_DEP_style = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('FORMER_DEP');
    data.FORMER_FLIGHTID_style = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('FORMER_FLIGHTID');
    //前端航班样式作用在前端航班+前端航班起飞时间+前端航班降落时间上
//		data.FORMER_ARR_style = style + this.getDisplayFontSize('FORMER_ARR');
//		data.FORMER_DEP_style = style + this.getDisplayFontSize('FORMER_DEP');
//	    data.FORMER_FLIGHTID_style = style + this.getDisplayFontSize('FORMER_FLIGHTID');
};

/**
 * 前段航班CTOT
 * @param flight
 * @param data
 *
 * */
const setFormerCtot= function( flight, data){
    data.FORMER_CTOT = "";
    data.FORMER_CTOT_style = "";
    data.FORMER_CTOT_title = "";
    if(isValidVariable(flight.formerCtd)){
        data.FORMER_CTOT = flight.formerCtd;
        let style = this.getDisplayStyle('FORMER_CTOT');
        let fontsize = this.getDisplayFontSize('FORMER_CTOT');
        data.FORMER_CTOT_style = style + fontsize;
        data.FORMER_CTOT_title = "前段预计起飞时间：" + flight.formerCtd.substring(6,8) + '/' + flight.formerCtd.substring(8,12);
    }
};

/***
 * 资质
 * */

const setQualifcations = function( flight, data){
    data.QUALIFICATIONS = "";
    data.QUALIFICATIONS_style = "";
    data.QUALIFICATIONS_title = "";
    if(isValidVariable(flight.qualifications) && flight.qualifications.substring(1,2) == '2'){
        data.QUALIFICATIONS = flight.qualifications;
        let style = this.getDisplayStyle('QUALIFICATIONS');
        let fontsize = this.getDisplayFontSize('QUALIFICATIONS');
        data.QUALIFICATIONS_style = style + fontsize;
        data.QUALIFICATIONS_title = "资质：" + '二类';
    }
};


/**
 * SPOT
 *
 * @param flight
 * @param data
 */
const setSPOT = function( flight, data){
    data.POSITION = "";
    data.POSITION_style = "";
    data.POSITION_title = "";
    let style = this.getDisplayStyle('DEFAULT');
    //
    if (isValidVariable(flight.position)) {
        data.POSITION = flight.position;
        // 判断来源
        if (isValidVariable(flight.coordinationRecords)
            && isValidVariable(flight.coordinationRecords[FlightCoordinationRecord.TYPE_POSITION])) {
            // 人工
            style = this.getDisplayStyle('SPOT_MANUAL');
            data.POSITION_title = flight.position + '\n'
                + this.getDisplayStyleZh('SPOT_MANUAL');

            // 显示录入时间
            let record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_POSITION];
            data.POSITION_title = data.POSITION_title + '\n' + '录入时间: '
                + record.timestamp.substring(6, 8) + '/'
                + record.timestamp.substring(8, 12);
        } else {
            // 引接
            style = this.getDisplayStyle('SPOT_IMPORT');
            data.POSITION_title = flight.position + '\n'
                + this.getDisplayStyleZh('SPOT_IMPORT');
        }
    }
    let fontsize = this.getDisplayFontSize('POSITION');
    data.POSITION_style = style + fontsize;
};

/**
 * DeiceStatus
 * @param {} flight
 * @param {} data
 */
const setDeiceStatus= function( flight, data){
    data.DEICE_STATUS='';
    let style = this.getDisplayStyle('DEFAULT');
    if(isValidVariable(flight.deiceStatus) && flight.deiceStatus==FlightCoordination.STATUS_DEICE_ON){
        data.DEICE_STATUS='除冰';
    }

    let fontsize = this.getDisplayFontSize('DEICE_STATUS');
    data.DEICE_STATUS_style = style + fontsize;
};

/**
 * DeicePosition
 *
 * @param flight
 * @param data
 */
const setDeicePosition = function( flight, data){
    data.DEICE_POSITION = "";
    data.DEICE_POSITION_title = "";
    data.DEICE_POSITION_style = "";
    let style = this.getDisplayStyle('DEFAULT');
    if (isValidVariable(flight.deicePosition)) {
        data.DEICE_POSITION = flight.deicePosition;
        data.DEICE_POSITION_title = flight.deicePosition;
//			style = this.getDisplayStyle('DEICE_POSITION');
    }else if(isValidVariable(flight.deiceStatus) && flight.deiceStatus == 1){
        data.DEICE_POSITION = '待定';
        data.DEICE_POSITION_title ='待定';
    }
    let fontsize = this.getDisplayFontSize('DEICE_POSITION');
    data.DEICE_POSITION_style = style + fontsize;
};

/**
 * DeiceGroup
 * @param {} flight
 * @param {} data
 */
const setDeiceGroup= function( flight, data){
    data.DEICE_GROUP='';
    if (isValidVariable(flight.deiceGroup)) {
        data.DEICE_GROUP=flight.deiceGroup;
    }
    let style = this.getDisplayStyle('DEFAULT');
    let fontsize = this.getDisplayFontSize('DEICE_GROUP');
    data.DEICE_GROUP_style = style + fontsize;
};

/**
 * Runway
 *
 * @param flight
 * @param data
 */
const setRunway = function( flight, data){
    data.RUNWAY = "";
    data.RUNWAY_style = "";
    data.RUNWAY_title = "";
    let style = this.getDisplayStyle('DEFAULT');
    // 判断来源
    if (isValidVariable(flight.runway)
        && isValidVariable(flight.coordinationRecords)
        && isValidVariable(flight.coordinationRecords[FlightCoordinationRecord.TYPE_RUNWAY])) {
        // 人工
        data.RUNWAY = flight.runway;
        style = this.getDisplayStyle('RUNWAY_MANUAL');
        data.RUNWAY_title = data.RUNWAY + '\n'
            + this.getDisplayStyleZh('RUNWAY_MANUAL');
        // 显示录入时间
        let record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_RUNWAY];
        data.RUNWAY_title = data.RUNWAY_title + '\n' + '录入时间: '
            + record.timestamp.substring(6, 8) + '/'
            + record.timestamp.substring(8, 12);
    } else if (isValidVariable(flight.runway)) {
        // 系统（时隙分配程序录入）
        data.RUNWAY = flight.runway;
        style = this.getDisplayStyle('RUNWAY_SLOT');
        data.RUNWAY_title = data.RUNWAY + '\n'
            + this.getDisplayStyleZh('RUNWAY_SLOT');
    } else if (isValidVariable(flight.crunway)) {
        // 系统-推算
        data.RUNWAY = flight.crunway;
        style = this.getDisplayStyle('RUNWAY_SYSTEM');
        data.RUNWAY_title = data.RUNWAY + '\n'
            + this.getDisplayStyleZh('RUNWAY_SYSTEM');
    }
    let fontsize = this.getDisplayFontSize('RUNWAY');
    data.RUNWAY_style = style + fontsize;
};

/**
 * Taxi
 *
 * @param flight
 * @param data
 */
const setTaxi = function( flight, data){
    data.TAXI = "";
    if (isValidVariable(flight.taxi)) {
        data.TAXI = flight.taxi;
    }
    let style = this.getDisplayStyle('TAXI');
    let fontsize = this.getDisplayFontSize('TAXI');
    data.TAXI_style = style + fontsize;
};

/**
 * Status
 *
 * @param flight
 * @param data
 */
const setStatus = function( flight, data){
    data.STATUS = "";
    if (isValidVariable(flight.status)) {
        data.STATUS = FlightCoordination.getStatusZh(flight);
    }
    let style = this.getDisplayStyle('DEFAULT');
    let fontsize = this.getDisplayFontSize('STATUS');
    data.STATUS_style = style + fontsize;
};

/**
 * PoolStatus
 *
 * @param flight
 * @param data
 */
const setPoolStatus = function( flight, data){
    data.POOL_STATUS = "";
    if (isValidVariable(flight.poolStatus)) {
        //判断如果是没有发报
        if( !FmeToday.hadFPL(flight.fmeToday) ){
            //未发报不显示
            data.POOL_STATUS = "";
        }else{
            data.POOL_STATUS = FlightCoordination.getPoolStatusZh(flight.poolStatus);
        }

    }
    let style = this.getDisplayStyle('DEFAULT');
    let fontsize = this.getDisplayFontSize('POOL_STATUS');
    data.POOL_STATUS_style = style + fontsize;
};

/**
 * FlowcontrolStatus
 *
 * @param flight
 * @param data
 */
const setFlowcontrolStatus = function( flight, data){
    data.FLOWCONTROL_STATUS = '';
    data.FLOWCONTROL_STATUS_title = '';
    let flowcontrolCount = 0;
    let flowcontrolInfo = '';
    let isGS = false;
    let isREQ = false;

    // 判断是否受流控影响
    if (isValidVariable(flight.flowcontrols)) {
        for ( let id in flight.flowcontrols) {
            let fc = flight.flowcontrols[id];
            let fcname = fc[0];
            let fctype = fc[1];
            let fcreason = fc[2];
            let flowcontrolType = fc[3];
            let flowcontrolValue = fc[4];
            if (!showLongFlowcontrol && flowcontrolType == 0) {
                continue;
            }
            let status =  fc[5];
            if(status != 'FINISHED'&&status != 'STOP'&&status != 'TERMINATED'){
                if (fctype == FlowcontrolUtils.TYPE_GS) {
                    isGS = true;
                }
                if (fctype == FlowcontrolUtils.TYPE_REQ) {
                    isREQ = true;
                }
            }
            flowcontrolInfo += '[ ' + fcname + ' '
                + FlowcontrolUtils.getReasonZh(fcreason) + ' '
                + FlowcontrolUtils.getTypeZh(fctype) + ' ';
            if(fctype == FlowcontrolUtils.TYPE_TIME){
                flowcontrolInfo += flowcontrolValue + '分钟  ]\n';
            } else {
                flowcontrolInfo += ']\n';
            }
            flowcontrolCount++;
        }
    }
    if (flowcontrolCount > 0) {
        if (isGS) {
            data.FLOWCONTROL_STATUS = '停止';
        } else if(isREQ){
            data.FLOWCONTROL_STATUS = '申请';
        }else {
            data.FLOWCONTROL_STATUS = '受控';
        }
        data.FLOWCONTROL_STATUS_title += ('受影响流控:\n' + flowcontrolInfo);
    }
};

/**
 * SlotStatus
 *
 * @param flight
 * @param data
 */
const setSlotStatus = function( flight, data){
    data.SLOT_STATUS = '';
    // 判断航班是否已经起飞
    if (!FmeToday.hadDEP(flight.fmeToday)) {
        // 未起飞
        if (FlightCoordination.isInPoolFlight(flight)) {
            data.SLOT_STATUS = '入池';
        } else if (flight.locked == FlightCoordination.LOCKED_IMPACT
            || flight.locked == FlightCoordination.LOCKED) {
            data.SLOT_STATUS = '人工';
        } else if (flight.locked == FlightCoordination.UNLOCK
            && (isValidVariable(flight.cobt) || isValidVariable(flight.ctd))) {
            data.SLOT_STATUS = '锁定';
        } else if (flight.locked == FlightCoordination.UNLOCK
            && (isValidVariable(flight.autoSlot)
                && (isValidVariable(flight.autoSlot.ctd)
                    || isValidVariable(flight.autoSlot.cobt)))) {
            data.SLOT_STATUS = '自动';
        } else if (flight.locked == FlightCoordination.LOCKED_NOSLOT) {
            data.SLOT_STATUS = '不参加';
        }
    }
    let style = this.getDisplayStyle('DEFAULT');
    let fontsize = this.getDisplayFontSize('SLOT_STATUS');
    data.SLOT_STATUS_style = style + fontsize;
};

/**
 * Normal
 *
 * @param flight
 * @param data
 */
const setNormal = function( flight, dataTime, data){
    data.NORMAL = "";
    let aobt = "";
    let sobt = "";
    let atot = "";
    //
    if (isValidVariable(flight.aobt)) {
        aobt = flight.aobt;
    } else if (isValidVariable(flight.fmeToday.ROuttime)) {
        aobt = flight.fmeToday.ROuttime;
    }
    if (isValidVariable(flight.fmeToday.SDeptime)) {
        sobt = flight.fmeToday.SDeptime;
    } else if (isValidVariable(flight.fmeToday.PDeptime)) {
        sobt = flight.fmeToday.PDeptime;
    }
    if (isValidVariable(flight.fmeToday.RDeptime)) {
        atot = flight.fmeToday.RDeptime;
    } else if (isValidVariable(flight.atd)) {
        atot = flight.atd;
    }
    let style;
    // 判断是否取消
    if (FmeToday.isCNLStatus(flight.fmeToday) || FmeToday.isPCancel(flight.fmeToday)) {
        data.NORMAL = '取消';
        style = this.getDisplayStyle('NORMAL_CNL');
    } else
    // 判断是否返航备降
    if (FmeToday.isCPLStatus(flight.fmeToday)) {
        data.NORMAL = '返航/备降';
        style = this.getDisplayStyle('NORMAL_CPL');
    } else
    // 判断AOBT - SOBT
    if (isValidVariable(aobt) && isValidVariable(sobt)) {
        let diff = calculateStringTimeDiff(aobt, sobt) / 1000 / 60;
        if (diff > 5) {
            data.NORMAL = '延误';
            data.NORMAL_title = data.NORMAL + (diff - 5) + '分钟';
            style = this.getDisplayStyle('ABNORMAL_DELAY');
        } else if (diff < -5) {
            data.NORMAL = '提前';
            data.NORMAL_title = data.NORMAL + (diff + 5) + '分钟';
            style = this.getDisplayStyle('ABNORMAL_BEFORE');
        } else {
            data.NORMAL = '正常';
            style = this.getDisplayStyle('NORMAL');
        }
    } else
    // 判断ATOT - TAXI - SOBT
    if (isValidVariable(atot) && isValidVariable(sobt)
        && isValidVariable(data.TAXI)) {
        let diff = (calculateStringTimeDiff(atot, sobt) / 1000 / 60)
            - data.TAXI;
        if (diff > 5) {
            data.NORMAL = '延误-推测';
            data.NORMAL_title = data.NORMAL + (diff - 5) + '分钟';
            style = this.getDisplayStyle('ABNORMAL_C_DELAY');
        } else if (diff < -5) {
            data.NORMAL = '提前-推测';
            data.NORMAL_title = data.NORMAL + (diff + 5) + '分钟';
            style = this.getDisplayStyle('ABNORMAL_C_BEFORE');
        } else {
            data.NORMAL = '正常';
            style = this.getDisplayStyle('NORMAL');
        }
    } else
    // 判断NOW - SOBT
    if (isValidVariable(dataTime) && isValidVariable(sobt)) {
        let diff = (calculateStringTimeDiff(dataTime, sobt) / 1000 / 60);
        if (diff > 5) {
            data.NORMAL = '延误-推测';
            data.NORMAL_title = data.NORMAL + (diff - 5) + '分钟';
            style = this.getDisplayStyle('ABNORMAL_C_DELAY');
        } else {
            data.NORMAL = '正常';
            style = this.getDisplayStyle('NORMAL');
        }
    } else {
        data.NORMAL = '正常';
        style = this.getDisplayStyle('NORMAL');
    }
    let fontsize = this.getDisplayFontSize('NORMAL');
    data.NORMAL_style = style + fontsize;
};

/**
 * CloseWait
 *
 * @param flight
 * @param data
 */
const setCloseWait = function( flight, data){
    data.CLOSE_WAIT = -1;
    if (isValidVariable(flight.closeWait) && flight.closeWait > 0) {
        data.CLOSE_WAIT = flight.closeWait;
    }
    let style = this.getDisplayStyle('DEFAULT');
    let fontsize = this.getDisplayFontSize('CLOSE_WAIT');
    data.CLOSE_WAIT_style = style + fontsize;
};

/**
 * TaxiWait
 *
 * @param flight
 * @param data
 */
const setTaxiWait = function( flight, data){
    data.TAXIWait = -1;
    if (isValidVariable(flight.taxiWait) && flight.taxiWait > 0) {
        data.TAXIWait = flight.taxiWait;
    }
};

/**
 * Delay
 *
 * @param flight
 * @param data
 */
const setDelay = function( flight, data){
    data.DELAY = -1;
    if (isValidVariable(flight.delay) && flight.delay > 0) {
        data.DELAY = flight.delay;
    }
    let style = this.getDisplayStyle('DEFAULT');
    let fontsize = this.getDisplayFontSize('DELAY');
    data.DELAY_style = style + fontsize;
};

/**
 * DelayReason
 *
 * @param flight
 * @param data
 */
const setDelayReason = function( flight, data){
    data.DELAY_REASON = "";

    // 判断延误原因类型
    if (isValidVariable(flight.delayReason)) {
        if (flight.delayReason != FlightCoordination.DELAY_REASON_FORMER
            && flight.delayReason != FlightCoordination.DELAY_REASON_AOC) {
            // 流控
            data.DELAY_REASON = FlowcontrolUtils.getReasonZh(flight.delayReason);
            data.DELAY_REASON_title = data.DELAY_REASON;
        } else {
            // 前序或公司
            data.DELAY_REASON = FlightCoordination.getDelayReasonZh(flight.delayReason);
            data.DELAY_REASON_title = data.DELAY_REASON;
        }
    }
    else if (isValidVariable(flight.cdelayReason)) {
        if (flight.cdelayReason != FlightCoordination.DELAY_REASON_FORMER
            && flight.cdelayReason != FlightCoordination.DELAY_REASON_AOC) {
            // 流控
            data.DELAY_REASON = FlowcontrolUtils.getReasonZh(flight.cdelayReason);
            data.DELAY_REASON_title = data.DELAY_REASON;
        } else {
            // 前序或公司
            data.DELAY_REASON = FlightCoordination
                .getDelayReasonZh(flight.cdelayReason);
            data.DELAY_REASON_title = data.DELAY_REASON;
        }
    }

    // 判断公司延误情况下具体原因
    if (isValidVariable(data.DELAY_REASON)
        && data.DELAY_REASON == FlightCoordination.DELAY_REASON_AOC) {
        // 原因1：申请时间 > 计划时间
        if (isValidVariable(flight.fmeToday.teletype)
            && FmeToday.hadFPL(flight.fmeToday)
            && isValidVariable(data.EOBT)
            && isValidVariable(data.SOBT)
            && data.EOBT > data.SOBT) {
            data.DELAY_REASON_title = data.DELAY_REASON + '\n'
                + '原因：申请时间晚于计划时间';
        }
        // 原因2：实关时间 > 协关时间
        if (isValidVariable(data.AGCT)
            && isValidVariable(data.HOBT)
            && data.AGCT > data.HOBT) {
            data.DELAY_REASON_title = data.DELAY_REASON + '\n'
                + '原因：实关时间晚于协关时间';
        }
    }
    let style = this.getDisplayStyle('DEFAULT');
    let fontsize = this.getDisplayFontSize('DELAY_REASON');
    data.DELAY_REASON_style = style + fontsize;
};

/**
 * GSOBT & GSSEQ
 *
 * @param flight
 * @param data
 */
const setGSOBTAndSEQ = function( flight, data){
    data.GSSEQ = "";
    if (isValidVariable(flight.gsseq)) {
        data.GSSEQ = flight.gsseq;
    }
    data.GSOBT = "";
    data.GSOBT_title = "";
    if (isValidVariable(flight.gsobt)) {
        data.GSOBT = flight.gsobt;
        data.GSOBT_title = flight.gsobt.substring(6, 8) + '/'
            + flight.gsobt.substring(8, 12);
    }
    let style = this.getDisplayStyle('DEFAULT');
    let fontsize = this.getDisplayFontSize('GSSEQ');
    data.GSSEQ_style = style + fontsize;
};

/**
 *
 * @param flight
 * @param data
 * @param points
 */
const setFlowcontrolPoint=  function( flight, data, points, flowId){

    // 初始化受控过点信息
    data.FLOWCONTROL_POINT = "";
    data.FLOWCONTROL_POINT_title = "";
    data.FLOWCONTROL_POINT_PASSTIME = "";
    data.FLOWCONTROL_POINT_PASSTIME_style = "";
    data.FLOWCONTROL_POINT_PASSTIME_title = "";
    data.FLOWCONTROL_POINT_PASSTIME_E = "";
    data.FLOWCONTROL_POINT_PASSTIME_interval = false;
    // 初始化受控过点信息ETO
    data.FLOWCONTROL_POINT_PASSTIME_ETO = "";
    data.FLOWCONTROL_POINT_PASSTIME_ETO_style = "";
    data.FLOWCONTROL_POINT_PASSTIME_ETO_title = "";
    // 初始化受控过点信息CTO
    data.FLOWCONTROL_POINT_PASSTIME_CTO = "";
    data.FLOWCONTROL_POINT_PASSTIME_CTO_style = "";
    data.FLOWCONTROL_POINT_PASSTIME_CTO_title = "";

    // 无受控航路点 不计算受控过点时间
    if(!isValidVariable(points)){
        return;
    }

    // 航班起飞机场
    let depap = FmeToday.getRPSDepAP(flight.fmeToday);

    // 获取FC、SLOT的过点信息
    let fcMpi = FlightCoordination.parseMonitorPointInfo(flight);
    let slotMpi = FlightCoordination.parseAutoSlotMonitorPointInfo(flight.autoSlot);
    // 获取航班所过的受控航路点
    let hitPoint = "";
    //解析传入航路点
    let pointsArr = points.split(',')
    //逐一匹配航路点，首次匹配成功后即返回
    for (let num in pointsArr){
        let fcPoint = pointsArr[num]
        for ( let point in fcMpi) {
            if ( fcPoint == point) {
                hitPoint = point;
                break;
            }
        }
        if(hitPoint != ''){
            break;
        }
    }
    // 拆解出受控的航路点过点信息
    let hitPointFcInfo = fcMpi[hitPoint];
    let hitPointSlotInfo = slotMpi[hitPoint];

    // 确定航班所过的受控航路点
    data.FLOWCONTROL_POINT = hitPoint;

    // 计算受控过点时间
    let passtime_A = "";
    let passtime_C = "";
    let passtime_Auto_C = "";
    let passtime_E = "";
    let passtime_T = "";
    let passtime_P = "";
    if (isValidVariable(hitPointFcInfo)) {
        if(isValidVariable(hitPointFcInfo['A'])){
            passtime_A = hitPointFcInfo['A'];
        }
        if(isValidVariable(hitPointFcInfo['C'])){
            passtime_C = hitPointFcInfo['C'];
        }
        if(isValidVariable(hitPointFcInfo['E'])){
            passtime_E = hitPointFcInfo['E'];
        }
        if(isValidVariable(hitPointFcInfo['T'])){
            passtime_T = hitPointFcInfo['T'];
        }
        if(isValidVariable(hitPointFcInfo['P'])){
            passtime_P = hitPointFcInfo['P'];
        }
    }
    if (isValidVariable(hitPointSlotInfo) && isValidVariable(hitPointSlotInfo['C'])) {
        passtime_Auto_C = hitPointSlotInfo['C'];
    }

    // 已起飞按照A、T、E、C、AUTO_C的顺序显示航班受控点时间
    if (isValidVariable(flight.atd)
        || isValidVariable(flight.estInfo)
        || isValidVariable(flight.updateTime)) {
        // FLOWCONTROL_POINT_PASSTIME
        if (isValidVariable(passtime_A)){
            data.FLOWCONTROL_POINT_PASSTIME = passtime_A;
        } else if (isValidVariable(passtime_T)){
            data.FLOWCONTROL_POINT_PASSTIME = passtime_T;
        } else if (isValidVariable(passtime_E)){
            data.FLOWCONTROL_POINT_PASSTIME = passtime_E;
        } else if (isValidVariable(passtime_C)){
            data.FLOWCONTROL_POINT_PASSTIME = passtime_C;
        } else if (isValidVariable(passtime_Auto_C)){
            data.FLOWCONTROL_POINT_PASSTIME = passtime_Auto_C;
        } else {
            data.FLOWCONTROL_POINT_PASSTIME = '';
        }
        // FLOWCONTROL_POINT_PASSTIME_ETO
        if(isValidVariable(passtime_E)){
            data.FLOWCONTROL_POINT_PASSTIME_ETO = passtime_E;
        }
        // FLOWCONTROL_POINT_PASSTIME_CTO
        if (isValidVariable(passtime_T)){
            data.FLOWCONTROL_POINT_PASSTIME_CTO = passtime_T;
        } else if (isValidVariable(passtime_C)){
            data.FLOWCONTROL_POINT_PASSTIME_CTO = passtime_C;
        } else if (isValidVariable(passtime_Auto_C)){
            data.FLOWCONTROL_POINT_PASSTIME_CTO = passtime_Auto_C;
        } else {
            data.FLOWCONTROL_POINT_PASSTIME_CTO = '';
        }
    } else {
        // FLOWCONTROL_POINT_PASSTIME
        if (isValidVariable(passtime_C)){
            data.FLOWCONTROL_POINT_PASSTIME = passtime_C;
        } else if (isValidVariable(passtime_Auto_C)){
            data.FLOWCONTROL_POINT_PASSTIME = passtime_Auto_C;
        } else if (flight.clearanceType == FlightCoordination.CLEARANCE_OVERFLY
            && isValidVariable(passtime_E)
            && checkFlightIsInternationalDepap(depap)){
            // 国内飞越航班受控过点时间（不存在C值时，使用E/P值参与已分配时隙表格排序）
            data.FLOWCONTROL_POINT_PASSTIME = passtime_E + "_HIDE";
        } else {
            // 航班受控过点时间（不存在C值时，使用E/P值参与未分配时隙表格排序）
            data.FLOWCONTROL_POINT_PASSTIME_E = passtime_E;
            data.FLOWCONTROL_POINT_PASSTIME = '';
        }

// 			暂时屏蔽功能 未分配时隙航班 后续分配顺序
//			else if( $.isValidObject(flight.flowcontrols)
//					&& isValidVariable(flowId)
//					&& isValidVariable(flight.flowcontrols[flowId][11])){
//				// 航班未分配分配时隙航班 排序（流控信息提供）
//				let num = flight.flowcontrols[flowId][11];
//				data.FLOWCONTROL_POINT_PASSTIME = 't_' + num;
//			}

        // FLOWCONTROL_POINT_PASSTIME_CTO
        if (isValidVariable(passtime_C)){
            data.FLOWCONTROL_POINT_PASSTIME_CTO = passtime_C;
        } else if (isValidVariable(passtime_Auto_C)){
            data.FLOWCONTROL_POINT_PASSTIME_CTO = passtime_Auto_C;
        } else {
            data.FLOWCONTROL_POINT_PASSTIME_CTO = '';
        }

        // 没有预起时间和预撤时间，不显示受控过点时间
        if (flight.clearanceType == FlightCoordination.CLEARANCE_FLIGHTS
            && !isValidVariable(data.COBT)
            && !isValidVariable(data.CTOT)
            && data.FLOWCONTROL_POINT_PASSTIME.indexOf("t") <= -1){
            data.FLOWCONTROL_POINT_PASSTIME = '';
            data.FLOWCONTROL_POINT_PASSTIME_CTO = '';
            return;
        }
    }

    // 受控过点时间样式显示
    if (isValidVariable(passtime_A)
        && data.FLOWCONTROL_POINT_PASSTIME == passtime_A){
        data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('ATOT');
    } else if (isValidVariable(passtime_T)
        && data.FLOWCONTROL_POINT_PASSTIME == passtime_T){
        if (flight.locked == FlightCoordination.LOCKED
            || flight.locked == FlightCoordination.LOCKED_IMPACT) {
            data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('CTOT_MANUAL');
            data.FLOWCONTROL_POINT_PASSTIME_CTO_style = this.getDisplayStyle('CTOT_MANUAL');
        }
    } else if(isValidVariable(passtime_C)
        && data.FLOWCONTROL_POINT_PASSTIME == passtime_C){
        if (flight.locked == FlightCoordination.LOCKED
            || flight.locked == FlightCoordination.LOCKED_IMPACT) {
            data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('CTOT_MANUAL');
            data.FLOWCONTROL_POINT_PASSTIME_CTO_style = this.getDisplayStyle('CTOT_MANUAL');
        } else {
            let COBTStyleStr = data.COBT_style;
            let COBTLockStr = this.getDisplayStyle('COBT_LOCK');
            if (isValidVariable(COBTStyleStr) && isValidVariable(COBTLockStr) && COBTStyleStr.indexOf(COBTLockStr) > -1) {
                data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('CTOT_LOCK');
                data.FLOWCONTROL_POINT_PASSTIME_CTO_style = this.getDisplayStyle('CTOT_LOCK');
            } else {
                data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('CTOT');
                data.FLOWCONTROL_POINT_PASSTIME_CTO_style = this.getDisplayStyle('CTOT');
            }
        }
    } else if (isValidVariable(passtime_Auto_C)
        && data.FLOWCONTROL_POINT_PASSTIME == passtime_Auto_C){
        data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('CTOT_AUTO');
        data.FLOWCONTROL_POINT_PASSTIME_CTO_style = this.getDisplayStyle('CTOT_AUTO');
    }

    //  入池航班
    if (!isValidVariable(flight.fmeToday.RDeptime)
        && FlightCoordination.isInPoolFlight(flight)) {
        data.FLOWCONTROL_POINT_PASSTIME = passtime_C;
    }

    // 提示信息显示所有过点时间
    data.FLOWCONTROL_POINT_PASSTIME_title = '';
    data.FLOWCONTROL_POINT_PASSTIME_ETO_title = '';
    data.FLOWCONTROL_POINT_PASSTIME_CTO_title = '';
    if(isValidVariable(passtime_A)){
        data.FLOWCONTROL_POINT_PASSTIME_title += ('实际: '
            + formatTime(passtime_A) + '\n');
    }
    if (isValidVariable(passtime_T)) {
        data.FLOWCONTROL_POINT_PASSTIME_title += ('已起飞人工: '
            + formatTime(passtime_T) + '\n');
        data.FLOWCONTROL_POINT_PASSTIME_CTO_title += ('已起飞人工: '
            + formatTime(passtime_T) + '\n');
    }
    if(isValidVariable(passtime_E)){
        data.FLOWCONTROL_POINT_PASSTIME_title += ('预计: '
            + formatTime(passtime_E) + '\n');
        data.FLOWCONTROL_POINT_PASSTIME_ETO_title += ('预计: '
            + formatTime(passtime_E) + '\n');
    }
    if(isValidVariable(passtime_C)){
        if (flight.locked == FlightCoordination.LOCKED
            || flight.locked == FlightCoordination.LOCKED_IMPACT) {
            data.FLOWCONTROL_POINT_PASSTIME_title += ('人工: '
                + formatTime(passtime_C) + '\n');
            data.FLOWCONTROL_POINT_PASSTIME_CTO_title += ('人工: '
                + formatTime(passtime_C) + '\n');
        } else {
            data.FLOWCONTROL_POINT_PASSTIME_title += ('锁定: '
                + formatTime(passtime_C) + '\n');
            data.FLOWCONTROL_POINT_PASSTIME_CTO_title += ('锁定: '
                + formatTime(passtime_C) + '\n');
        }
    }
    if(isValidVariable(passtime_Auto_C)){
        data.FLOWCONTROL_POINT_PASSTIME_title += ('计算: '
            + formatTime(passtime_Auto_C) + '\n');
        data.FLOWCONTROL_POINT_PASSTIME_CTO_title += ('计算: '
            + formatTime(passtime_Auto_C) + '\n');
    }
};


/**
 *
 * @param flight
 * @param data
 */
const setFlightAccPoint=  function( flight, data, invalidDataStyle){

    // 初始化关注出区域点信息
    data.FLIGHT_ACC_POINT = "";
    data.FLIGHT_ACC_POINT_title = "";
    data.FLIGHT_ACC_POINT_PASSTIME = "";
    data.FLIGHT_ACC_POINT_PASSTIME_style = "";
    data.FLIGHT_ACC_POINT_PASSTIME_title = "";

    // 获取航班关注出区域点
    let hitPoint = flight.controlWaypointName;
    // 无 关注出区域点 不计算受控过点时间
    if(!isValidVariable(hitPoint)){
        return;
    }
    //  受控过点时间为空时 不显示关注出区域点时间
    if(!isValidVariable(data.FLOWCONTROL_POINT_PASSTIME)){
        return;
    }
    // 获取FC、SLOT的过点信息
    let fcMpi = FlightCoordination.parseMonitorPointInfo(flight);
    let slotMpi = FlightCoordination.parseAutoSlotMonitorPointInfo(flight.autoSlot);

    // 拆解出受控的航路点过点信息
    let hitPointFcInfo = fcMpi[hitPoint];
    let hitPointSlotInfo = slotMpi[hitPoint];

    // 确定航班所过的受控航路点
    data.FLIGHT_ACC_POINT = hitPoint;

    // 计算受控过点时间
    let passtime_A = "";
    let passtime_C = "";
    let passtime_Auto_C = "";
    let passtime_E = "";
    let passtime_T = "";
    if (isValidVariable(hitPointFcInfo)) {
        if(isValidVariable(hitPointFcInfo['A'])){
            passtime_A = hitPointFcInfo['A'];
        }
        if(isValidVariable(hitPointFcInfo['C'])){
            passtime_C = hitPointFcInfo['C'];
        }
        if(isValidVariable(hitPointFcInfo['E'])){
            passtime_E = hitPointFcInfo['E'];
        }
        if(isValidVariable(hitPointFcInfo['T'])){
            passtime_T = hitPointFcInfo['T'];
        }
    }
    if (isValidVariable(hitPointSlotInfo) && isValidVariable(hitPointSlotInfo['C'])) {
        passtime_Auto_C = hitPointSlotInfo['C'];
    }

    // 已起飞按照A、E、C、AUTO_C的顺序显示航班受控点时间
    if (isValidVariable(flight.atd)
        || isValidVariable(flight.estInfo)
        || isValidVariable(flight.updateTime)) {
        // 实际过点时间
        if (isValidVariable(passtime_A)){
            data.FLIGHT_ACC_POINT_PASSTIME = passtime_A;
            data.FLIGHT_ACC_POINT_PASSTIME_style = this.getDisplayStyle('ATOT') + this.getDisplayFontSize('DEFAULT');
        } else if (isValidVariable(passtime_T)){
            // 已起飞 人工指定过点时间
            data.FLIGHT_ACC_POINT_PASSTIME = passtime_T;
            data.FLIGHT_ACC_POINT_PASSTIME_style = data.FLOWCONTROL_POINT_PASSTIME_style;
        } else if (isValidVariable(passtime_E)){
            data.FLIGHT_ACC_POINT_PASSTIME = passtime_E;
        } else {
            data.FLIGHT_ACC_POINT_PASSTIME = '';
        }
    } else {
        // 未起飞按照 C、AUTO_C的顺序显示航班受控点时间
        if (isValidVariable(passtime_C)){
            data.FLIGHT_ACC_POINT_PASSTIME = passtime_C;
        } else if (isValidVariable(passtime_Auto_C)){
            data.FLIGHT_ACC_POINT_PASSTIME = passtime_Auto_C;
        } else {
            data.FLIGHT_ACC_POINT_PASSTIME = '';
        }
        data.FLIGHT_ACC_POINT_PASSTIME_style = data.FLOWCONTROL_POINT_PASSTIME_style;
    }

    //  入池航班
    if (!isValidVariable(flight.fmeToday.RDeptime)
        && FlightCoordination.isInPoolFlight(flight)) {
        data.FLIGHT_ACC_POINT_PASSTIME = passtime_C;
        data.FLIGHT_ACC_POINT_PASSTIME_style = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('DEFAULT')
            + invalidDataStyle;
    }

    // 提示信息显示所有过点时间
    data.FLIGHT_ACC_POINT_PASSTIME_title = '';
    if(isValidVariable(passtime_A)){
        data.FLIGHT_ACC_POINT_PASSTIME_title += ('实际: '
            + formatTime(passtime_A) + '\n');
    }
    if (isValidVariable(passtime_T)) {
        data.FLIGHT_ACC_POINT_PASSTIME_title += ('已起飞人工: '
            + formatTime(passtime_T) + '\n');
    }
    if(isValidVariable(passtime_E)){
        data.FLIGHT_ACC_POINT_PASSTIME_title += ('预计: '
            + formatTime(passtime_E) + '\n');
    }
    if(isValidVariable(passtime_C)){
        if (flight.locked == FlightCoordination.LOCKED
            || flight.locked == FlightCoordination.LOCKED_IMPACT) {
            data.FLIGHT_ACC_POINT_PASSTIME_title += ('人工: '
                + formatTime(passtime_C) + '\n');
        } else {
            data.FLIGHT_ACC_POINT_PASSTIME_title += ('锁定: '
                + formatTime(passtime_C) + '\n');
        }
    }
    if(isValidVariable(passtime_Auto_C)){
        data.FLIGHT_ACC_POINT_PASSTIME_title += ('计算: '
            + formatTime(passtime_Auto_C) + '\n');
    }
};

/**
 *
 * @param flight
 * @param data
 */
const setFlightAppPoint=  function( flight, data, invalidDataStyle){

    // 初始化关注进区域点信息
    data.FLIGHT_APP_POINT = "";
    data.FLIGHT_APP_POINT_title = "";
    data.FLIGHT_APP_POINT_PASSTIME = "";
    data.FLIGHT_APP_POINT_PASSTIME_style = "";
    data.FLIGHT_APP_POINT_PASSTIME_title = "";

    // 获取航班关注进区域点
    let hitPoint = flight.controlInnerWaypointName;
    // 无关注进区域点 不计算受控过点时间
    if(!isValidVariable(hitPoint)){
        return;
    }
    //  受控过点时间为空时 不显示关注出区域点时间
    if(!isValidVariable(data.FLOWCONTROL_POINT_PASSTIME)){
        return;
    }
    // 获取FC、SLOT的过点信息
    let fcMpi = FlightCoordination.parseMonitorPointInfo(flight);
    let slotMpi = FlightCoordination.parseAutoSlotMonitorPointInfo(flight.autoSlot);

    // 拆解出受控的航路点过点信息
    let hitPointFcInfo = fcMpi[hitPoint];
    let hitPointSlotInfo = slotMpi[hitPoint];

    // 确定航班所过的受控航路点
    data.FLIGHT_APP_POINT = hitPoint;

    // 计算受控过点时间
    let passtime_A = "";
    let passtime_C = "";
    let passtime_Auto_C = "";
    let passtime_E = "";
    let passtime_T = "";
    if (isValidVariable(hitPointFcInfo)) {
        if(isValidVariable(hitPointFcInfo['A'])){
            passtime_A = hitPointFcInfo['A'];
        }
        if(isValidVariable(hitPointFcInfo['C'])){
            passtime_C = hitPointFcInfo['C'];
        }
        if(isValidVariable(hitPointFcInfo['E'])){
            passtime_E = hitPointFcInfo['E'];
        }
        if(isValidVariable(hitPointFcInfo['T'])){
            passtime_T = hitPointFcInfo['T'];
        }
    }
    if (isValidVariable(hitPointSlotInfo) && isValidVariable(hitPointSlotInfo['C'])) {
        passtime_Auto_C = hitPointSlotInfo['C'];
    }

    // 已起飞按照A、E、C、AUTO_C的顺序显示航班受控点时间
    if (isValidVariable(flight.atd)
        || isValidVariable(flight.estInfo)
        || isValidVariable(flight.updateTime)) {
        if (isValidVariable(passtime_A)){
            data.FLIGHT_APP_POINT_PASSTIME = passtime_A;
            data.FLIGHT_APP_POINT_PASSTIME_style = this.getDisplayStyle('ATOT') + this.getDisplayFontSize('DEFAULT');
        } else if (isValidVariable(passtime_T)){
            data.FLIGHT_APP_POINT_PASSTIME = passtime_T;
            data.FLIGHT_APP_POINT_PASSTIME_style = data.FLOWCONTROL_POINT_PASSTIME_style;
        } else if (isValidVariable(passtime_E)){
            data.FLIGHT_APP_POINT_PASSTIME = passtime_E;
        } else {
            data.FLIGHT_APP_POINT_PASSTIME = '';
        }
    } else {
        // 未起飞按照 C、AUTO_C的顺序显示航班受控点时间
        if (isValidVariable(passtime_C)){
            data.FLIGHT_APP_POINT_PASSTIME = passtime_C;
        } else if (isValidVariable(passtime_Auto_C)){
            data.FLIGHT_APP_POINT_PASSTIME = passtime_Auto_C;
        } else {
            data.FLIGHT_APP_POINT_PASSTIME = '';
        }
        data.FLIGHT_APP_POINT_PASSTIME_style = data.FLOWCONTROL_POINT_PASSTIME_style;
    }

    //  入池航班
    if (!isValidVariable(flight.fmeToday.RDeptime)
        && FlightCoordination.isInPoolFlight(flight)) {
        data.FLIGHT_APP_POINT_PASSTIME = passtime_C;
        data.FLIGHT_APP_POINT_PASSTIME_style = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize('DEFAULT')
            + invalidDataStyle;
    }

    // 提示信息显示所有过点时间
    data.FLIGHT_APP_POINT_PASSTIME_title = '';
    if(isValidVariable(passtime_A)){
        data.FLIGHT_APP_POINT_PASSTIME_title += ('实际: '
            + formatTime(passtime_A) + '\n');
    }
    if (isValidVariable(passtime_T)) {
        data.FLIGHT_APP_POINT_PASSTIME_title += ('已起飞人工: '
            + formatTime(passtime_T) + '\n');
    }
    if(isValidVariable(passtime_E)){
        data.FLIGHT_APP_POINT_PASSTIME_title += ('预计: '
            + formatTime(passtime_E) + '\n');
    }
    if(isValidVariable(passtime_C)){
        if (flight.locked == FlightCoordination.LOCKED
            || flight.locked == FlightCoordination.LOCKED_IMPACT) {
            data.FLIGHT_APP_POINT_PASSTIME_title += ('人工: '
                + formatTime(passtime_C) + '\n');
        } else {
            data.FLIGHT_APP_POINT_PASSTIME_title += ('锁定: '
                + formatTime(passtime_C) + '\n');
        }
    }
    if(isValidVariable(passtime_Auto_C)){
        data.FLIGHT_APP_POINT_PASSTIME_title += ('计算: '
            + formatTime(passtime_Auto_C) + '\n');
    }
};

/**
 *
 * @param flight
 * @param data
 */
const setEfpsFlight = function( flight, data){
    let style = this.getDisplayStyle('DEFAULT');
    //
    data.EFPS_SID = "";
    if(flight.efpsFlight != null && flight.efpsFlight.sid != null){
        data.EFPS_SID = flight.efpsFlight.sid;
    }
    data.EFPS_SID_style = style + this.getDisplayFontSize('EFPS_SID');
    //
    data.EFPS_ICEID = "";
    if(flight.efpsFlight != null && flight.efpsFlight.iceId != null){
        data.EFPS_ICEID = flight.efpsFlight.iceId;
    }
    data.EFPS_ICEID_style = style + this.getDisplayFontSize('EFPS_ICEID');
    //
    data.EFPS_REQTIME = "";
    data.EFPS_REQTIME_title = "";
    if(flight.efpsFlight != null && isValidVariable(flight.efpsFlight.reqTime)){
        data.EFPS_REQTIME = flight.efpsFlight.reqTime;
        data.EFPS_REQTIME_title = flight.efpsFlight.reqTime.substring(6, 8)
            + '/' + flight.efpsFlight.reqTime.substring(8, 12);
    }
    data.EFPS_REQTIME_style = style + this.getDisplayFontSize('EFPS_REQTIME');
    //
    data.EFPS_PUSTIME = "";
    data.EFPS_PUSTIME_title = "";
    if(flight.efpsFlight != null && isValidVariable(flight.efpsFlight.pusTime)){
        data.EFPS_PUSTIME = flight.efpsFlight.pusTime;
        data.EFPS_PUSTIME_title = flight.efpsFlight.pusTime.substring(6, 8)
            + '/' + flight.efpsFlight.pusTime.substring(8, 12);
    }
    data.EFPS_PUSTIME_style = style + this.getDisplayFontSize('EFPS_PUSTIME');
    //
    data.EFPS_LINTIME = "";
    data.EFPS_LINTIME_title = "";
    if(flight.efpsFlight != null && isValidVariable(flight.efpsFlight.linTime)){
        data.EFPS_LINTIME = flight.efpsFlight.linTime;
        data.EFPS_LINTIME_title = flight.efpsFlight.linTime.substring(6, 8)
            + '/' + flight.efpsFlight.linTime.substring(8, 12);
    }
    data.EFPS_LINTIME_style = style + this.getDisplayFontSize('EFPS_LINTIME');
    //
    data.EFPS_IN_DHLTIME = "";
    data.EFPS_IN_DHLTIME_title = "";
    if(flight.efpsFlight != null && isValidVariable(flight.efpsFlight.inDhlTime)){
        data.EFPS_IN_DHLTIME = flight.efpsFlight.inDhlTime;
        data.EFPS_IN_DHLTIME_title = flight.efpsFlight.inDhlTime.substring(6, 8)
            + '/' + flight.efpsFlight.inDhlTime.substring(8, 12);
    }
    data.EFPS_IN_DHLTIME_style = style + this.getDisplayFontSize('EFPS_IN_DHLTIME');
    //
    data.EFPS_OUT_DHLTIME = "";
    data.EFPS_OUT_DHLTIME_title = "";
    if(flight.efpsFlight != null && isValidVariable(flight.efpsFlight.outDhlTime)){
        data.EFPS_OUT_DHLTIME = flight.efpsFlight.outDhlTime;
        data.EFPS_OUT_DHLTIME_title = flight.efpsFlight.outDhlTime.substring(6, 8)
            + '/' + flight.efpsFlight.outDhlTime.substring(8, 12);
    }
    data.EFPS_OUT_DHLTIME_style = style + this.getDisplayFontSize('EFPS_OUT_DHLTIME');
    //
    data.EFPS_IN_ICETIME = "";
    data.EFPS_IN_ICETIME_title = "";
    if(flight.efpsFlight != null && isValidVariable(flight.efpsFlight.inIceTime)){
        data.EFPS_IN_ICETIME = flight.efpsFlight.inIceTime;
        data.EFPS_IN_ICETIME_title = flight.efpsFlight.inIceTime.substring(6, 8)
            + '/' + flight.efpsFlight.inIceTime.substring(8, 12);
    }
    data.EFPS_IN_ICETIME_style = style + this.getDisplayFontSize('EFPS_IN_ICETIME');
    //
    data.EFPS_OUT_ICETIME = "";
    data.EFPS_OUT_ICETIME_title = "";
    if(flight.efpsFlight != null && isValidVariable(flight.efpsFlight.outIcTime)){
        data.EFPS_OUT_ICETIME = flight.efpsFlight.outIcTime;
        data.EFPS_OUT_ICETIME_title = flight.efpsFlight.outIcTime.substring(6, 8)
            + '/' + flight.efpsFlight.outIcTime.substring(8, 12);
    }
    data.EFPS_OUT_ICETIME_style = style + this.getDisplayFontSize('EFPS_OUT_ICETIME');
    //
    data.EFPS_STATUS = "";
    if(flight.efpsFlight != null && isValidVariable(flight.efpsFlight.status)){
        data.EFPS_STATUS = FlightCoordination.getEfpsStatusZh(flight.efpsFlight.status);
    }
    data.EFPS_STATUS_style = style + this.getDisplayFontSize('EFPS_STATUS');
    //
    data.EFPS_TAXTIME = "";
    data.EFPS_TAXTIME_title = "";
    if(flight.efpsFlight != null && isValidVariable(flight.efpsFlight.taxTime)){
        data.EFPS_TAXTIME = flight.efpsFlight.taxTime;
        data.EFPS_TAXTIME_title = flight.efpsFlight.taxTime.substring(6, 8)
            + '/' + flight.efpsFlight.taxTime.substring(8, 12);
    }
    data.EFPS_TAXTIME_style = style + this.getDisplayFontSize('EFPS_TAXTIME');
};

const setARDT = function( flight, data){
    data.READY = "";
    if(flight.ardtManual != null){
        data.READY = flight.ardtManual;
        data.READY_title = '准备完毕时间: ' + flight.ardtManual.substring(6, 8)
            + '/' + flight.ardtManual.substring(8, 12);
    }
};
/**
 * 设置流控影响航班中批量清C操作
 */
const setMultiOperate = function( flight, data){
    data.MULTI_OPERATE = '';
    data.MULTI_OPERATE_title = '';
    if( !isValidObject(flight.fmeToday) ){
        return;
    };
    let fmeObj = flight.fmeToday;
    //如果发了FPL报、航班未取消、未落地、未起飞、未返航、未备降
    //let flag = FmeToday.hadFPL(fmeObj) && !( FmeToday.hadCNL(fmeObj) || FmeToday.hadARR(fmeObj) || FmeToday.hadDEP(fmeObj) || FmeToday.hadRTN(fmeObj) || FmeToday.hadALN(fmeObj) );
    let flag = FmeToday.hadFPL(fmeObj) && !( FmeToday.isCNLStatus(fmeObj) || FmeToday.hadARR(fmeObj) || FmeToday.hadDEP(fmeObj) || FmeToday.hadRTN(fmeObj) || FmeToday.hadALN(fmeObj) );
    if( flag ){
        //人工 橙色   人工修改/人工修改+锁定 且有ctd值
        if( (flight.locked == FlightCoordination.LOCKED || flight.locked == FlightCoordination.LOCKED_IMPACT)
            && isValidVariable(flight.ctd))
        {
            // data.MULTI_OPERATE = '<input type="checkbox"  class="clear-locked-time" id="clear-' + flight.id + '" />';
            data.MULTI_OPERATE = flight.id;
            data.MULTI_OPERATE_title = '清除COBT时间';
        }else if( flight.locked == FlightCoordination.UNLOCK && (isValidVariable(flight.cobt) || isValidVariable(flight.ctd)))
        {
            //锁定 粉色   非人工修改 且有cobt或ctd
            // data.MULTI_OPERATE = '<input type="checkbox"  class="clear-locked-time" id="clear-' + flight.id + '" />';
            data.MULTI_OPERATE = flight.id;
            data.MULTI_OPERATE_title = '清除COBT时间';
        }
    }

};

/**
 *
 * 取消、退出、入池、豁免、放行、准备完毕
 * @param flight
 * @param data
 */
const markFlightidStyle = function( flight, data){
    let style = this.getDisplayStyle('DEFAULT') ;

    // 退出时隙分配
    if(isValidVariable(flight.coordinationRecords)
        && isValidVariable(flight.coordinationRecords['MARK_NEED_SLOT'])){
        let originalValue = flight.coordinationRecords['MARK_NEED_SLOT'].originalValue;
        if(originalValue == '0'){
            style = this.getDisplayStyle('MARK_NEED_SLOT');
            data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '已退出时隙分配';
        }
    }

    // 已入池
    if (!isValidVariable(data.FLIGHTID_style)
        && FlightCoordination.isInPoolFlight(flight)
        && !FmeToday.hadDEP(flight.fmeToday)) {
        style = this.getDisplayStyle('IN_WAIT_POOL');

        data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '已入池';
    }
    //标记为二类
    if(isValidVariable(flight.qualifications) && flight.qualifications.substring(1,2) == '2'){
        style = this.getDisplayStyle('FLIGHT_QUALIFICATIONS_MANUAL');
        data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '已标记为二类飞行资质';
    }
    // 豁免
    if(data.priority == FlightCoordination.PRIORITY_EXEMPT){
        style = this.getDisplayStyle('MARK_EXEMPT');
        data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '已豁免';
    }
    if(isValidVariable(flight.DelayType)){
        //延误航班起飞告警
        if(this.getDisplayStyle('DELAY_DEP_ALARM') != "" && flight.DelayType=="DELAY_DEP_ALARM"){
            style = this.getDisplayStyle('DELAY_DEP_ALARM')
            data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '延误起飞告警';
        }
        //临界特殊航班告警
        if(this.getDisplayStyle('CRITICAL_FLIGHT') != "" && flight.DelayType=="CRITICAL_FLIGHT"){
            style = this.getDisplayStyle('CRITICAL_FLIGHT')
            data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '临界(特殊航班)';
        }
    }

//		if(!isValidVariable(data.ATOT)){
//			if( this.getDisplayStyle('CRITICAL_FLIGHT') != "" && isValidVariable(data.CTOT) && isValidVariable(data.SOBT)){
//				if( calculateStringTimeDiff( data.CTOT, data.SOBT )/1000/60 >= 22
//					&& calculateStringTimeDiff( data.CTOT, data.SOBT )/1000/60 <= 28 ){
//					style = this.getDisplayStyle('CRITICAL_FLIGHT')
//					data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '临界(特殊航班)';
//				}
//			}
//		}


    // 已放行
    if (isValidVariable(flight.coordinationRecords)) {
        let clearanceRecord = flight.coordinationRecords[FlightCoordinationRecord.TYPE_MARK_CLEARANCE];
        if (isValidVariable(clearanceRecord)
            && isValidVariable(clearanceRecord.status)) {
            let status = clearanceRecord.value;
            if (status == 1) {
                style = this.getDisplayStyle('CLEARANCE_MANUAL');
                data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '已放行';
            }
        }
    }

    // 已准备完毕
    if(isValidVariable(flight.coordinationRecords)
        && isValidVariable(flight.coordinationRecords['MARK_READY'])){
        if(!isValidVariable(flight.coordinationRecords['MARK_READY'].originalValue)){
            style = this.getDisplayStyle('MARK_READY');
            data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '已标记准备完毕';
        }
    }

    // 已被流控影响（航班受流控影响&&COBT-TOBT>5）
//		if (!isValidVariable(data.FLIGHTID_style)
//				&& isValidVariable(data.COBT)
//				&& isValidVariable(data.TOBT)
//				&& isValidVariable(data.FLOWCONTROL_STATUS)
//				&& !FmeToday.hadDEP(flight.fmeToday)) {
//			let subtract = calculateStringTimeDiff(data.COBT, data.TOBT);
//			if (isValidVariable(subtract) && subtract > (60 * 1000 * 5)) {
//				data.FLIGHTID_style = this
//						.this.getDisplayStyle('FLOWCONTROL_IMPACT_FLIGHT');
//				data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '已被流控影响';
//			}
//		}

    // 添加航班号字体大小
    if (!isValidVariable(data.FLIGHTID_style)) {
//			style = this.getDisplayFontSize('FLIGHTID');
    }
    let fontsize = this.getDisplayFontSize('FLIGHTID');
    data.FLIGHTID_style = style + fontsize;

};

/**
 *
 *
 * @param flight
 * @param data
 */
const markDEPFlightStyle = function( flight, data, invalidDataStyle){
    if (isValidVariable(flight.fmeToday.RDeptime)) {
        for ( let pro in data) {
            if (pro.indexOf('_style') < 0 && pro.indexOf('_title') < 0
                && isValidVariable(data[pro])) {
                if (
                    //pro == 'TOBT'||
                pro == 'HOBT'
                || pro == 'COBT'
                || pro == 'CTOT'
                || pro == 'ASBT'
                || pro == 'AGCT'
                || pro == 'AOBT') {
                    if ((pro == 'COBT' || pro == 'CTOT')&& data[pro + '_style'] ==
                        (this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize(pro) + invalidDataStyle))
                    //{
                    //	data[pro + '_style'] = this.getDisplayStyle('DEFAULT')
                    //	+ invalidDataStyle + this.getDisplayStyle('OUT_OR_DEP') + this.getDisplayFontSize('OUT_OR_DEP');
                    //} else {
                    //	data[pro + '_style'] = this.getDisplayStyle('OUT_OR_DEP') + this.getDisplayFontSize('OUT_OR_DEP');
                    //}
                    {
                        data[pro + '_style'] = this.getDisplayStyle('DEFAULT') + invalidDataStyle + this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize(pro);
                    } else {
                        data[pro + '_style'] = this.getDisplayStyle('DEFAULT') + this.getDisplayFontSize(pro);
                    }
                }
            }
        }
        if (isValidVariable(data.COBT)) {
            data.COBT_style = data.COBT_style
                + this.getDisplayStyle('OUT_OR_DEP');
        }
        if (isValidVariable(data.HOBT)) {
            data.HOBT_style = data.HOBT_style
                + this.getDisplayStyle('OUT_OR_DEP');
        }
        if (isValidVariable(data.CTOT)) {
            data.CTOT_style = data.CTOT_style
                + this.getDisplayStyle('OUT_OR_DEP');
        }
//			if (isValidVariable(data.TOBT)) {
//				data.TOBT_style = data.TOBT_style
//						+ this.getDisplayStyle('OUT_OR_DEP');
//				data.STATUS_style = '';
//			}
        if (isValidVariable(data.AGCT)) {
            data.AGCT_style = data.AGCT_style
                + this.getDisplayStyle('OUT_OR_DEP');
        }
        if (isValidVariable(data.ASBT)) {
            data.ASBT_style = data.ASBT_style
                + this.getDisplayStyle('OUT_OR_DEP');
        }
        if (isValidVariable(data.AOBT)) {
            data.AOBT_style = data.AOBT_style
                + this.getDisplayStyle('OUT_OR_DEP');
        }
    }

};

/**
 *
 *
 * @param flight
 * @param data
 */
const markCNLFlightStyle = function( flight, data){
    if (flight.fmeToday.editStatusToday == FmeToday.EDIT_STATUS_TODAY_AOC_CANCEL) {
        for ( let pro in data) {
            if (pro.indexOf('_style') < 0
                && pro.indexOf('_title') < 0
                && isValidVariable(data[pro])) {
                data[pro + '_style'] = this.getDisplayStyle('FLIGHT_CANCEL') + this.getDisplayFontSize('DEFAULT');
                if(pro == 'FLIGHTID'){
                    data[pro + '_title'] = data[pro + '_title'] + '\n' + '已标记取消';
                }
            }
        }
    }
};

/**
 *
 *
 * @param flight
 * @param data
 */
const markStatusStyle = function( flight, data){
    // 判断前段航班降落时间情况
    if (isValidVariable(flight.formerArrtime)
        && flight.formerArrtime.indexOf('T') >= 0
        && !FmeToday.hadDEP(flight.fmeToday)) {
        data.STATUS_style = this.getDisplayStyle('FORMER_ARR_TIMEOUT') + this.getDisplayFontSize('DEFAULT');
//			data.TOBT_style = this.getDisplayStyle('FORMER_ARR_TIMEOUT');
    }
};

/**
 *
 *
 * @param flight
 * @param data
 */
const clearInvalidData = function( flight, data){
    for ( let key in data){
        if (!isValidVariable(data[key])) {
            data[key] = '';
        } else if (data[key].constructor == String
            && data[key].indexOf('undefined') >= 0) {
            data[key] = data[key].replace(/undefined/g, '');
        }
    }
};

/**
 * 格式化日期
 *
 * @param time
 * @returns {*}
 */
const formatTime = function( time ){
    if(isValidVariable(time)) {
        let day = time.substr(6, 2);
        let hhmm = time.substr(8, 4);
        return day + '/' + hhmm;
    } else {
        return '';
    }
};
/**
 * 校验是否为过国内起飞航班
 * @param depap
 * @returns {Boolean}
 */
const checkFlightIsInternationalDepap = function(depap){
    if (isValidVariable(depap)
        && (depap == 'VHHH'
            || depap == 'VMMC'
            || depap.substring(0, 2) == 'RC')
        || depap.substring(0, 1) == 'Z') {
        return true;
    } else {
        return false;
    }
};

export { convertData, convertDisplayStyle, getDisplayStyle, getDisplayStyleZh, getDisplayFontSize };
