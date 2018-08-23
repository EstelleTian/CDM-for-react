/**
 * 协调记录表格数据
 */
import {isValidVariable} from "utils/basic-verify";
import FlightCoordinationRecord from "utils/flight-coordination-record";
import { FlightCoordination } from "utils/flightcoordination";
import FmeToday from "utils/fmetoday";

const FlightCoordinationRecordGridTableDataUtil = {		
		/**
		 * 
		 * @param record
		 * @returns {___data0}
		 */
		convertData : function (record){
			
			let data = {};
			
			data.id = record.id;
			
			if(isValidVariable(record.version)){
				data.version = record.version;
			}
			
			if(isValidVariable(record.fid)){
				data.fid = record.fid;
			}
			
			if(isValidVariable(record.flightid)){
				data.flightid = record.flightid;
			}
			
			if(isValidVariable(record.comment)){
				data.comments = record.comment;
			}
			
			if(isValidVariable(record.ipAddress)){
				data.ipAddress = record.ipAddress;
			}
			
			if(isValidVariable(record.executedate)){
				data.executedate = record.executedate;
			}
			
			if(isValidVariable(record.timestamp)){
			    const time = record.timestamp.substring(0, 12);
				data.timestamp = time;
			}
			
			if(isValidVariable(record.username)){
				data.username = record.username;
			}
			
			if(isValidVariable(record.usernameZh)){
				data.usernameZh = record.usernameZh;
			}
			
			if(isValidVariable(record.status)){
				data.status = FlightCoordinationRecord.getStatusZh(record.status);
			}

            if(isValidVariable(record.type)){
                data.type = FlightCoordinationRecord.getCoordinationTypeZh(record.type);
                if(record.type == FlightCoordinationRecord.TYPE_MARK_CLEARANCE){
                    data.originalValue = FlightCoordination.getMarkClearanceStatusZhFull(record.originalValue);
                    data.value = FlightCoordination.getMarkClearanceStatusZhFull(record.value);
                } else if(record.type == FlightCoordinationRecord.TYPE_CLEARANCE){
                    data.originalValue = FlightCoordination.getClearanceStatusZhFull(record.originalValue);
                    data.value = FlightCoordination.getClearanceStatusZhFull(record.value);
                } else if (record.type == FlightCoordinationRecord.TYPE_PRIORITY){
                    data.originalValue = FlightCoordination.getPriorityZh(record.originalValue);
                    data.value = FlightCoordination.getPriorityZh(record.value);
                } else if (record.type == FlightCoordinationRecord.TYPE_INPOOL){
                    data.originalValue = FlightCoordination.getPoolStatusZh(record.originalValue);
                    data.value = FlightCoordination.getPoolStatusZh(record.value);
                } else if (record.type == FlightCoordinationRecord.TYPE_DELAYREASON){
                    data.originalValue = FlightCoordination.getDelayReasonZh(record.originalValue);
                    data.value = FlightCoordination.getDelayReasonZh(record.value);
                } else if (record.type == FlightCoordinationRecord.TYPE_CANCEL) {
                    data.originalValue = FmeToday.getCancelZh(record.originalValue);
                    data.value = FmeToday.getCancelZh(record.value);
                } else if(record.type == FlightCoordinationRecord.TYPE_FME_TODAY){
                    data.originalValue = FlightCoordination.getMarkClearanceStatusZhFull(record.originalValue);
                    data.value = FlightCoordination.getMarkClearanceStatusZhFull(record.value);
                } else if (record.type == FlightCoordinationRecord.TYPE_DEICE) {
                    data.originalValue = FlightCoordination.getDeiceZh(record.originalValue);
                    data.value = FlightCoordination.getDeiceZh(record.value);
                } else if (record.type == FlightCoordinationRecord.TYPE_MARK_NEED_SLOT) {
                    data.originalValue = FlightCoordination.getMarkNeedSlotZh(record.originalValue);
                    data.value = FlightCoordination.getMarkNeedSlotZh(record.value);
                } else if (record.type == FlightCoordinationRecord.TYPE_SLOT_MANUAL_COBT
                    || record.type == FlightCoordinationRecord.TYPE_SLOT_MANUAL_CTOT
                    || record.type == FlightCoordinationRecord.TYPE_SLOT_MANUAL_CTO
                    || record.type == FlightCoordinationRecord.TYPE_SLOT_MANUAL_DEP_CTO
                    || record.type == FlightCoordinationRecord.TYPE_EXCHANGE_SLOT
                    || record.type == FlightCoordinationRecord.TYPE_REQ_MANUAL_CTOT
                ) {
                    var originalMap = null;
                    var newMap = null;
                    var original = '';
                    var value = '';
                    if(isValidVariable(record.originalValue)){
                        originalMap = JSON.parse(record.originalValue);
                    }
                    if(isValidVariable(record.value)){
                        newMap = JSON.parse(record.value);
                    }
                    for (var index in originalMap){
                        var point = index;
                        var passtime = originalMap[point];
                        if(isValidVariable(original)){
                            if(point == 'LOCKED') {
                                if(passtime == 0) {
                                    original = original  + ' \n ' + point+':自动';
                                }
                                if(passtime == 1) {
                                    original = original  + ' \n ' + point+':禁止调整';
                                }
                                if(passtime == 2) {
                                    original = original  + ' \n ' + point+':允许调整';
                                }
                            } else {
                                original = original  + ' \n ' + point+':'+passtime.substring(6, 8)
                                    + '/' + passtime.substring(8, 12);
                            }

                        } else {
                            if(point == 'LOCKED') {
                                if(passtime == 0) {
                                    original = point+':自动';
                                }
                                if(passtime == 1) {
                                    original = point+':禁止调整';
                                }
                                if(passtime == 2) {
                                    original = point+':允许调整';
                                }
                            } else {
                                original = point+':'+passtime.substring(6, 8)
                                    + '/' + passtime.substring(8, 12);
                            }
                        }
                    }
                    for (var index in newMap){
                        var point = index;
                        var passtime = newMap[point];
                        if(isValidVariable(value)){
                            if(point == 'LOCKED') {
                                if(passtime == 0) {
                                    value = value  + ' \n ' + point+':自动';
                                }
                                if(passtime == 1) {
                                    value = value  + ' \n ' + point+':禁止调整';
                                }
                                if(passtime == 2) {
                                    value = value  + ' \n ' + point+':允许调整';
                                }
                            } else {
                                value = value  + ' \n ' + point+':'+passtime.substring(6, 8)
                                    + '/' + passtime.substring(8, 12);
                            }

                        } else {
                            if(point == 'LOCKED') {
                                if(passtime == 0) {
                                    value = point+':自动';
                                }
                                if(passtime == 1) {
                                    value = point+':禁止调整';
                                }
                                if(passtime == 2) {
                                    value = point+':允许调整';
                                }
                            } else {
                                value = point+':'+passtime.substring(6, 8)
                                    + '/' + passtime.substring(8, 12);
                            }
                        }
                    }
                    data.originalValue = original;
                    data.value = value;
                }else if( record.type == FlightCoordinationRecord.TYPE_MARK_QUAL_FLIGHT ){
                    data.originalValue = FlightCoordination.getMarkQualFlightZh(record.originalValue);
                    data.value = FlightCoordination.getMarkQualFlightZh(record.value);
                } else {
                    if(isValidVariable(record.originalValue) && record.originalValue.length >= 12){
                        //循环处理以'/'分割的时间数值
                        var oriValTimes = record.originalValue.split('/');
                        var oriValTimeTem = '';
                        for(var i in oriValTimes){
                            var oriValTime = oriValTimes [i];
                            if(i == 0){
                                oriValTimeTem = '  '+oriValTime.substring(6,8) + '/' + oriValTime.substring(8,12);
                            }else{
                                oriValTimeTem = ' '+oriValTimeTem + ' \n ' + ' '+oriValTime.substring(6,8) + '/' + oriValTime.substring(8,12);
                            }
                        }
                        data.originalValue = oriValTimeTem ;
                        data.title = record.originalValue;
                    } else {
                        data.originalValue = record.originalValue;
                    }
                    if(isValidVariable(record.value) && record.value.length >= 12){
                        //循环处理以'/'分割的时间数值
                        var valTimes = record.value.split('/');
                        var valTimeTem = '';
                        for(var i in valTimes){
                            var valTime = valTimes [i];
                            if(i == 0){
                                valTimeTem = '  '+valTime.substring(6,8) + '/' + valTime.substring(8,12);
                            }else{
                                valTimeTem = ' '+valTimeTem + ' \n ' + ' '+valTime.substring(6,8) + '/' + valTime.substring(8,12);
                            }
                        }
                        data.value = valTimeTem;
                        data.title = record.value;
                    } else {
                        data.value = record.value;
                    }
                }
            }
			if(!isValidVariable(data.originalValue)){
				data.originalValue = '';
			}
			if(!isValidVariable(data.value)){
				data.value = '';
			}
			return data;
		}
};

export default FlightCoordinationRecordGridTableDataUtil;