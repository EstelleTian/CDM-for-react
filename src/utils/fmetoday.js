import { isValidVariable } from './basic-verify';
/**
 * FmeToday工具脚本
 */
const FmeToday = {

	/**
	 * STATUS 字段常量
	 */
	STATUS_SCH : 0,
	STATUS_FPL : 1,
	STATUS_DEP : 2,
	STATUS_ARR : 3,
	STATUS_DLA : 4,
	STATUS_RTN_CPL : 5,
	STATUS_CNL : 6,

	/**
	 * EDIT_STATUS 字段常量
	 */
	EDIT_STATUS_UNCHECK : 0,
	EDIT_STATUS_ASS_Y : 1,
	EDIT_STATUS_ASS_N : 2,
	EDIT_STATUS_ADD_Y : 3,
	EDIT_STATUS_ADD_N : 4,
	EDIT_STATUS_AOC_CANCEL : 5,

	/**
	 * EDIT_STATUS_TODAY 字段常量
	 */
	EDIT_STATUS_TODAY_UN : 0,// 恢复
	EDIT_STATUS_TODAY_AOC_ADD : 1,
	EDIT_STATUS_TODAY_AOC_UPDATE : 2,
	EDIT_STATUS_TODAY_AOC_CANCEL : 3,// 取消

	/**
	 * 获取放行状态中文-简
	 * 
	 * @param status
	 * @returns
	 */
	getStatusZh : function(status) {
		let zh = '';
		if(!isValidVariable(status)){
			return zh;
		}
		let s = parseInt(status, 10); 
		switch (s) {
			case this.STATUS_SCH:
				zh = '未起飞';
				break;
			case this.STATUS_FPL:
				zh = '预起飞';
				break;
			case this.STATUS_DEP:
				zh = '已起飞';
				break;
			case this.STATUS_ARR:
				zh = '已落地';
				break;
			case this.STATUS_DLA:
				zh = '延误';
				break;
			case this.STATUS_RTN_CPL:
				zh = '返航/备降';
				break;
			case this.STATUS_CNL:
				zh = '已取消';
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
	getStatusEN : function(status) {
		let en = '';
		if(!isValidVariable(status)){
			return en;
		}
		let s = parseInt(status, 10); 
		switch (s) {
		case this.STATUS_SCH:
			en = 'SCH';
			break;
		case this.STATUS_FPL:
			en = 'FPL';
			break;
		case this.STATUS_DEP:
			en = 'DEP';
			break;
		case this.STATUS_ARR:
			en = 'ARR';
			break;
		case this.STATUS_DLA:
			en = 'DLA';
			break;
		case this.STATUS_RTN_CPL:
			en = 'RTN/ALN';
			break;
		case this.STATUS_CNL:
			en = 'CNL';
			break;
		default:
			break;
		}
		return en;
	},
	
	/**
	 * 获取取消中文
	 * 
	 * @param cancel
	 * @returns
	 */
	getCancelZh : function(status) {
		let zh = '';
		if (!isValidVariable(status)) {
			return zh;
		}
		let s = parseInt(status, 10);
		switch (s) {
		case this.EDIT_STATUS_TODAY_AOC_CANCEL:
			zh = '取消';
			break;
		case this.EDIT_STATUS_TODAY_UN:
			zh = '正常';
			break;
		default:
			break;
		}
		return zh;
	},

	/**
	 * 按照R、P、S的顺序获取起飞机场
	 * 
	 * @return 起飞机场四字码
	 */
	getRPSDepAP : function(fme) {
		if (isValidVariable(fme.RDepap)) {
			return fme.RDepap;
		} else if (isValidVariable(fme.PDepap)) {
			return fme.PDepap;
		} else if (isValidVariable(fme.SDepap)) {
			return fme.SDepap;
		}
		return "";
	},

	/**
	 * 按照R、P、S的顺序获取降落机场
	 * 
	 * @return 降落机场四字码
	 */
	getRPSArrAP : function(fme) {
		if (isValidVariable(fme.RArrtime)) {
			if (isValidVariable(fme.RArrap)) {
				return fme.RArrap;
			} else if (isValidVariable(fme.PArrap)) {
				return fme.PArrap;
			} else if (isValidVariable(fme.SArrap)) {
				return fme.SArrap;
			}
		} else {
			if (isValidVariable(fme.PArrap)) {
				return fme.PArrap;
			} else if (isValidVariable(fme.SArrap)) {
				return fme.SArrap;
			}
		}
		
		return "";
	},

	/**
	 * 按照S、P、R的顺序获取起飞机场
	 * 
	 * @return 起飞机场四字码
	 */
	getSPRDepAP : function(fme) {
		if (isValidVariable(fme.SDepap)) {
			return fme.SDepap;
		} else if (isValidVariable(fme.PDepap)) {
			return fme.PDepap;
		} else if (isValidVariable(fme.RDepap)) {
			return fme.RDepap;
		}
		return "";
	},

	/**
	 * 按照S、P、R的顺序获取降落机场
	 * 
	 * @return 降落机场四字码
	 */
	getSPRArrAP : function(fme) {
		if (isValidVariable(fme.SArrap)) {
			return fme.SArrap;
		} else if (isValidVariable(fme.PArrap)) {
			return fme.PArrap;
		} else if (isValidVariable(fme.RArrap)) {
			return fme.RArrap;
		}
		return "";
	},

	/**
	 * 按照R、P、S的顺序获取起飞时间
	 * 
	 * @return 起飞时间 格式：yyyyMMddHHmm
	 */
	getRPSDepTime : function(fme) {
		if (isValidVariable(fme.RDeptime)) {
			return fme.RDeptime;
		} else if (isValidVariable(fme.PDeptime)) {
			return fme.PDeptime;
		} else if (isValidVariable(fme.SDeptime)) {
			return fme.SDeptime;
		}
		return "";
	},

	/**
	 * 按照R、P、S的顺序获取降落时间
	 * 
	 * @return 降落时间 格式：yyyyMMddHHmm
	 */
	getRPSArrTime : function(fme) {
		if (isValidVariable(fme.RArrtime)) {
			return fme.RArrtime;
		} else if (isValidVariable(fme.PArrtime)) {
			return fme.PArrtime;
		} else if (isValidVariable(fme.SArrtime)) {
			return fme.SArrtime;
		}
		return "";
	},

	/**
	 * 按照S、P、R的顺序获取起飞时间
	 * 
	 * @return 起飞时间 格式：yyyyMMddHHmm
	 */
	getSPRDepTime : function(fme) {
		if (isValidVariable(fme.SDeptime)) {
			return fme.SDeptime;
		} else if (isValidVariable(fme.PDeptime)) {
			return fme.PDeptime;
		} else if (isValidVariable(fme.RDeptime)) {
			return fme.RDeptime;
		}
		return "";
	},

	/**
	 * 按照S、P、R的顺序获取降落时间
	 * 
	 * @return 降落时间 格式：yyyyMMddHHmm
	 */
	getSPRArrTime : function(fme) {
		if (isValidVariable(fme.SArrtime)) {
			return fme.SArrtime;
		} else if (isValidVariable(fme.PArrtime)) {
			return fme.PArrtime;
		} else if (isValidVariable(fme.RArrtime)) {
			return fme.RArrtime;
		}
		return "";
	},

	/**
	 * 按照P、S的顺序获取机型
	 * 
	 * @return 机型
	 */
	getPSAircrafttype : function(fme) {
		if (isValidVariable(fme.PAircrafttype)) {
			return fme.PAircrafttype;
		} else if (isValidVariable(fme.SAircrafttype)) {
			return fme.SAircrafttype;
		}
		return "";
	},

	/**
	 * 按照R、P、A、S的顺序获取起飞时间
	 * 
	 * @return 起飞时间 格式：yyyyMMddHHmm
	 */
	getRPASDepTime : function(fme) {
		if (isValidVariable(fme.RDeptime)) {
			return fme.RDeptime;
		} else if (isValidVariable(fme.PDeptime)) {
			return fme.PDeptime;
		} else if (isValidVariable(fme.alDeptime)) {
			return fme.alDeptime;
		} else if (isValidVariable(fme.SDeptime)) {
			return fme.SDeptime;
		}
		return "";
	},

	/**
	 * 按照R、P、A、S的顺序获取降落时间
	 * 
	 * @return 降落时间 格式：yyyyMMddHHmm
	 */
	getRPASArrTime : function(fme) {
		if (isValidVariable(fme.RArrtime)) {
			return fme.RArrtime;
		} else if (isValidVariable(fme.PArrtime)) {
			return fme.PArrtime;
		} else if (isValidVariable(fme.alArrtime)) {
			return fme.alArrtime;
		} else if (isValidVariable(fme.SArrtime)) {
			return fme.SArrtime;
		}
		return "";
	},

	/**
	 * 按照S、A、P、R的顺序获取起飞时间
	 * 
	 * @return 起飞时间 格式：yyyyMMddHHmm
	 */
	getSAPRDepTime : function(fme) {
		if (isValidVariable(fme.SDeptime)) {
			return fme.SDeptime;
		} else if (isValidVariable(fme.alDeptime)) {
			return fme.alDeptime;
		} else if (isValidVariable(fme.PDeptime)) {
			return fme.PDeptime;
		} else if (isValidVariable(fme.RDeptime)) {
			return fme.RDeptime;
		}
		return "";
	},

	/**
	 * 按照S、A、P、R的顺序获取降落时间
	 * 
	 * @return 降落时间 格式：yyyyMMddHHmm
	 */
	getSAPRArrTime : function(fme) {
		if (isValidVariable(fme.SArrtime)) {
			return fme.SArrtime;
		} else if (isValidVariable(fme.alArrtime)) {
			return fme.alArrtime;
		} else if (isValidVariable(fme.PArrtime)) {
			return fme.PArrtime;
		} else if (isValidVariable(fme.RArrtime)) {
			return fme.RArrtime;
		}

		return "";
	},

	/**
	 * 按照P、A、S的顺序获取机型
	 * 
	 * @return 机型
	 */
	getPASAircrafttype : function(fme) {
		if (isValidVariable(fme.PAircrafttype)) {
			return fme.PAircrafttype;
		} else if (isValidVariable(fme.alAircrafttype)) {
			return fme.alAircrafttype;
		} else if (isValidVariable(fme.SAircrafttype)) {
			return fme.SAircrafttype;
		}
		return "";
	},

	/**
	 * 判断航班是否已经派发某种报文
	 * 
	 * @param tele
	 *            报文 例如:FPL、DEP等
	 * @return true / false
	 */
	hadTele : function(fme, tele) {
		if (isValidVariable(fme.teletype) && fme.teletype.indexOf(tele) >= 0) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否已经派发FPL
	 * <p>
	 * 满足以下条件之一
	 * <ul>
	 * <li>已发FPL报文</li>
	 * <li>已发CHG报文</li>
	 * <li>已发DLA报文</li>
	 * <ul>
	 * 
	 * @return true / false
	 */
	hadFPL : function(fme) {
		if (this.isFPLStatus(fme) || this.isDEPStatus(fme)
				|| this.isARRStatus(fme) || this.isDLAStatus(fme)
				|| this.isCPLStatus(fme)) {
			return true;
		}
		if (this.hadTele(fme, "FPL") || this.hadTele(fme, "CHG")
				|| this.hadTele(fme, "DLA")) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否已经起飞（包含已降落）
	 * <p>
	 * 满足以下条件之一
	 * <ul>
	 * <li>已发DEP报文</li>
	 * <li>有实际起飞时间</li>
	 * <li>有实际降落时间</li>
	 * <ul>
	 * 
	 * @return true / false
	 */
	hadDEP : function(fme) {
		if (this.hadTele(fme, "DEP") && (isValidVariable(fme.RDeptime)
				|| isValidVariable(fme.RArrtime))) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否已经降落
	 * <p>
	 * 满足以下条件之一
	 * <ul>
	 * <li>已发ARR报文</li>
	 * <li>有实际降落时间</li>
	 * <ul>
	 * 
	 * @return true / false
	 */
	hadARR : function(fme) {
		if (this.hadTele(fme, "ARR") && isValidVariable(fme.RArrtime)) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否已经取消
	 * <p>
	 * 满足以下条件之一
	 * <ul>
	 * <li>已发CNL报文</li>
	 * <li>航班状态为已取消</li>
	 * <ul>
	 * 
	 * @return true / false
	 */
	hadCNL : function(fme) {
		if (this.hadTele(fme, "CNL") || this.isCNLStatus(fme)) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否已经返航/备降
	 * <p>
	 * 满足以下条件之一
	 * <ul>
	 * <li>已发CPL报文</li>
	 * <li>航班状态为已返航/备降</li>
	 * <ul>
	 * 
	 * @return true / false
	 */
	hadCPL : function(fme) {
		if (this.hadTele(fme, "CPL") || this.isCPLStatus(fme)) {
			return true;
		}
		return false;
	},
	
	/**
	 * 判断航班是否已经返航
	 * 
	 * @return true / false
	 */
	hadRTN : function(fme) {
		if (this.hadTele(fme, "RTN")
				|| (isValidVariable(fme.cplinfo) 
						&& fme.cplinfo.indexOf('RTN') >= 0)) {
			return true;
		}
		return false;
	},
	
	/**
	 * 判断航班是否已经备降
	 * 
	 * @return true / false
	 */
	hadALN : function(fme) {
		if (this.hadTele(fme, "ALN")
				|| (isValidVariable(fme.cplinfo) 
						&& fme.cplinfo.indexOf('ALN') >= 0)) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否处于计划阶段SCH状态
	 * 
	 * @return true / false
	 */
	isSCHStatus : function(fme) {
		if (isValidVariable(fme.status)
				&& parseInt(fme.status, 10) == FmeToday.STATUS_SCH) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否处于已发FPL报状态
	 * 
	 * @return true / false
	 */
	isFPLStatus : function(fme) {
		if (isValidVariable(fme.status)
				&& parseInt(fme.status, 10) == FmeToday.STATUS_FPL) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否处于起飞DEP状态
	 * 
	 * @return true / false
	 */
	isDEPStatus : function(fme) {
		if (isValidVariable(fme.status)
				&& parseInt(fme.status, 10) == FmeToday.STATUS_DEP) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否处于降落ARR状态
	 * 
	 * @return true / false
	 */
	isARRStatus : function(fme) {
		if (isValidVariable(fme.status)
				&& parseInt(fme.status, 10) == FmeToday.STATUS_ARR) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否处于延误DLA状态
	 * 
	 * @return true / false
	 */
	isDLAStatus : function(fme) {
		if (isValidVariable(fme.status)
				&& parseInt(fme.status, 10) == FmeToday.STATUS_DLA) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否处于返航备降RTN/ALN状态
	 * 
	 * @return true / false
	 */
	isCPLStatus : function(fme) {
		if (isValidVariable(fme.status)
				&& parseInt(fme.status, 10) == FmeToday.STATUS_RTN_CPL) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否处于取消CNL状态
	 * 
	 * @return true / false
	 */
	isCNLStatus : function(fme) {
		if (isValidVariable(fme.status)
				&& parseInt(fme.status, 10) == FmeToday.STATUS_CNL) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否在计划核对阶段被取消
	 * 
	 * @return true / false
	 */
	isSCancel : function(fme) {
		if (isValidVariable(fme.editStatus)
				&& parseInt(fme.editStatus, 10) == FmeToday.EDIT_STATUS_AOC_CANCEL) {
			return true;
		}
		return false;
	},

	/**
	 * 判断航班是否在当日被取消
	 * <p>
	 * 公司协调取消、CNL报取消
	 * 
	 * @return true / false
	 */
	isPCancel : function(fme) {
		if (isValidVariable(fme.editStatusToday)
				&& parseInt(fme.editStatusToday, 10) == FmeToday.EDIT_STATUS_TODAY_AOC_CANCEL) {
			return true;
		} else if (isValidVariable(fme.status)
				&& parseInt(fme.status, 10) == FmeToday.STATUS_CNL) {
			return true;
		}
		return false;
	},

	/**
	 * 判断是否为始发航班
	 * 
	 * @return true / false
	 */
	isStartFlight : function(fme) {
		if (isValidVariable(fme.startflt) && fme.startflt == 'Y') {
			return true;
		}
		return false;
	},

	/**
	 * 判断是否为VIP航班
	 * 
	 * @param fme
	 * @returns {Boolean}
	 */
	isVIPFlight : function(fme) {
		let task = null;
		if (isValidVariable(fme.PTask)) {
			task = fme.PTask;
		} else if (fme.STask) {
			task = fme.STask;
		}
		if (!isValidVariable(task)) {
			return false;
		} else {
			task = task.toUpperCase();
		}
		if (task == 'B/W' || task == 'J/B' || task == 'VIP') {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * 判断是否为CDM航班
	 *
	 * @param flight 航班对象
	 * @returns {Boolean}
	 */
	isCDMFlight: function(flight){
		if(isValidVariable(flight.cdmFlight) && isValidVariable(flight.crsFlight)){
			if(true == flight.cdmFlight && false == flight.crsFlight){
				return true;
			}
		}
		return false;
	},
	/**
	 * 判断是否为CRS航班
	 *
	 * @param flight 航班对象
	 * @returns {Boolean}
	 */
	isCRSFlight: function(flight){
		if(isValidVariable(flight.cdmFlight) && isValidVariable(flight.crsFlight)){
			if( false == flight.cdmFlight && true == flight.crsFlight){
				return true;
			}
		}
		return false;
	},

};

export default FmeToday;