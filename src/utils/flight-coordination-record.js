/**
 * FlightCoordinationRecord对象常量
 */
const FlightCoordinationRecord = {
	/**
	 * 协调类型
	 */
	TYPE_PRIORITY : "PRIORITY",
	TYPE_TOBT : "TOBT",
	TYPE_HOBT : "HOBT",
	TYPE_RUNWAY : "RUNWAY",
	TYPE_BOARDINGTIME : "BOARDING",
	TYPE_CLOSETIME : "CLOSETIME",
	TYPE_AOBT : "AOBT",
	TYPE_POSITION : "POSITION",
	TYPE_CLEARANCE : "CLEARANCE",
	TYPE_MARK_CLEARANCE : "MARK_CLEARANCE",
	TYPE_DELAYREASON : "DELAY",
	TYPE_INPOOL : "INPOOL",
	TYPE_CANCEL : "CANCEL",
	TYPE_DEICE : "DEICE",
	TYPE_MARK_NEED_SLOT: "MARK_NEED_SLOT",
	TYPE_POINT_TIME : "POINT_TIME",
	TYPE_EXCHANGE_SLOT : "EXCHANGE_SLOT",
	TYPE_FORMER_ID : "FORMER_ID",
	TYPE_FME_TODAY : "FME_TODAY",
	TYPE_SLOT_HOBT_PUB : "SLOT_HOBT_PUB",
	TYPE_SLOT_HOBT_CNL : "SLOT_HOBT_CNL",
	TYPE_SLOT_CTOT_PUB : "SLOT_CTOT_PUB",
	TYPE_SLOT_CTOT_CNL : "SLOT_CTOT_CNL",
	TYPE_SLOT_INPOOL : "SLOT_INPOOL",
	TYPE_SLOT_MANUAL : "SLOT_MANUAL",
	TYPE_SLOT_MANUAL_COBT : "SLOT_MANUAL_COBT",
	TYPE_SLOT_MANUAL_CTOT : "SLOT_MANUAL_CTOT",
	TYPE_SLOT_MANUAL_CTO : "SLOT_MANUAL_CTO",
	TYPE_SLOT_MANUAL_DEP_CTO : "SLOT_MANUAL_DEP_CTO",
	TYPE_MARK_READY : 'MARK_READY',
	TYPE_REQ_MANUAL_CTOT : 'REQ_MANUAL_CTOT',
	TYPE_MARK_QUAL_FLIGHT : 'MARK_QUAL_FLIGHT',
	
	/**
	 * 协调状态
	 */
	STATUS_DEFAULT : 0,
	STATUS_APPLY : 1,
	STATUS_APPROVE : 2,
	STATUS_REFUSE : 3,
	STATUS_MODIFY : 4,
	
	/**
	 * 获取协调状态中文
	 * 
	 * @param status
	 * @returns
	 */
	getStatusZh : (status) => {
		let s = parseInt(status, 10); 
		let zh = null;
		switch (s) {
			case this.STATUS_APPLY:
				zh = '申请';
				break;
			case this.STATUS_APPROVE:
				zh = '批复';
				break;
			case this.STATUS_REFUSE:
				zh = '拒绝';
				break;
			case this.STATUS_MODIFY:
				zh = '调整';
				break;
			default:
				break;
		}
		return zh;
	},
	
	/**
	 * 获取协调类型中文
	 * 
	 * @param type
	 * @returns
	 */
	getCoordinationTypeZh : function(type){
		let zh = null;
		switch (type) {
			case this.TYPE_PRIORITY:
				zh = '任务';
				break;
			case this.TYPE_TOBT:
				zh = '预关时间TOBT';
				//zh = '预关时间';
				break;
			case this.TYPE_HOBT:
				zh = '协关时间HOBT';
				//zh = '协关时间';
				break;
			case this.TYPE_RUNWAY:
				zh = '跑道RWY';
				//zh = '跑道';
				break;
			case this.TYPE_BOARDINGTIME:
				zh = '上客时间ASBT';
				//zh = '上客时间';
				break;
			case this.TYPE_CLOSETIME:
				zh = '实关时间AGCT';
				//zh = '实关时间';
				break;
			case this.TYPE_AOBT:
				zh = '推出时间AOBT';
				//zh = '推出时间';
				break;
			case this.TYPE_POSITION:
				zh = '机位SPOT';
				//zh = '机位';
				break;
			case this.TYPE_SLOT_MANUAL_CTOT:
				zh = '人工指定CTOT';
				//zh = '人工指定';
				break;
			case this.TYPE_SLOT_MANUAL_COBT:
				zh = '人工指定COBT';
				//zh = '人工指定';
				break;
			case this.TYPE_MARK_CLEARANCE:
				zh = '标记放行';
				break;
			case this.TYPE_CLEARANCE:
				zh = '放行';
				break;	
			case this.TYPE_DELAYREASON:
				zh = '延误原因';
				break;	
			case this.TYPE_INPOOL:
				zh = '等待池';
				break;		
			case this.TYPE_CANCEL:
				zh = '标记取消';
				break;
			case this.TYPE_DEICE:
				zh = '除冰';
				break;
			case this.TYPE_MARK_NEED_SLOT:
				zh = '时隙分配标记';
				break;
			case this.TYPE_POINT_TIME:
				zh = '调整过点时间';
				break;
			case this.TYPE_SLOT_MANUAL_DEP_CTO:
				zh = '起飞指定CTO';
				//zh = '人工指定';
				break;
			case this.TYPE_SLOT_MANUAL_CTO:
				zh = '人工指定CTO';
				//zh = '人工指定';
				break;
			case this.TYPE_EXCHANGE_SLOT:
				zh = '时隙交换';
				break;
			case this.TYPE_FORMER_ID:
				zh = '指定前序航班';
				break;
			case this.TYPE_FME_TODAY:
				zh = '航班计划管理';
				break;
			case this.TYPE_SLOT_HOBT_PUB:
				zh = '发布协关HOBT';
				//zh = '发布协关';
				break;
			case this.TYPE_SLOT_HOBT_CNL:
				zh = '取消协关HOBT';
				//zh = '取消协关';
				break;
			case this.TYPE_SLOT_CTOT_PUB:
				zh = '发布预撤COBT';
				break;
			case this.TYPE_SLOT_CTOT_CNL:
				zh = '取消预撤COBT';
				break;
			case this.TYPE_SLOT_INPOOL:
				zh = '系统入池';
				break;
			case this.TYPE_SLOT_MANUAL:
				zh = '人工指定';
				break;	
			case this.TYPE_MARK_READY:
				zh = '标记准备完毕';
				break;
			case this.TYPE_MARK_QUAL_FLIGHT:
				zh = '标记二类飞行资质';
				break;
			default:
				zh = type;
				break;
		}
		return zh;
	}
};

export default FlightCoordinationRecord;