//航班表格上右键协调对话框
import React from 'react';
import { Icon, Input, Form, message } from 'antd';
import $ from 'jquery';
import {isValidObject, isValidVariable} from "utils/basic-verify";
import { request } from "utils/request-actions";
import { host } from "utils/request-urls";
import FormDialog from './Form';
import { convertData, getDisplayStyle, getDisplayStyleZh, getDisplayFontSize } from "utils/flight-grid-table-data-util";
import { OperationTypeForTimeColumn, OperationReason } from "utils/flightcoordination";
import CreateLayer from "components/CreateLayer/CreateLayer";
import CollaborateRecords from "components/OperationDialog/CollaborateRecords";
import FormerFlight from "components/OperationDialog/FormerFlight";
import OutPoolByTOBT from "components/OperationDialog/OutPoolByTOBT";
import './OperationDialog.less';

message.config({
    top: 140,
    getContainer: () => document.getElementsByClassName("main-table")[0]
});

const { TextArea } = Input;

const FormDialogIns = Form.create()(FormDialog);

const ReasonDialog = ({timeAuth, closeCollaborateDialog}) => (
    <div className="collaborate-dialog popover-dialog">
        <div className="popover-arrow left top"></div>
        <div className="content">
            <span>{OperationReason[timeAuth.reason] || "不可操作"}</span>
            <div
                className="reason close-target"
                onClick={ closeCollaborateDialog }
            >
                <Icon type="close" title="关闭"/>
            </div>
        </div>
    </div>
);

class OperationDialog extends React.Component{
    constructor( props ){
        super( props );
        this.handleFlightIdClick = this.handleFlightIdClick.bind(this);
        this.closeCollaborateDialog = this.closeCollaborateDialog.bind(this);
        this.convertData = convertData.bind(this);
        this.getDisplayStyle = getDisplayStyle.bind(this);
        this.getDisplayStyleZh = getDisplayStyleZh.bind(this);
        this.getDisplayFontSize = getDisplayFontSize.bind(this);
        this.getTimeColumnsAuth = this.getTimeColumnsAuth.bind(this);
        this.resetDialogPositon = this.resetDialogPositon.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.requestCallBackFunc = this.requestCallBackFunc.bind(this);

        this.state = {
            collaborateRecords: { //协调记录窗口显隐
                show: false
            },
            formerFlight: { //指定前序航班窗口显隐
                show: false
            },
            outPoolByTOBT: {
                show: false,
                name: ""
            }
        }
    }

    componentDidUpdate(){
        const { showName } = this.props.operationDatas;
        //若协调窗口打开才监听，没打开不监听
        if( isValidVariable(showName) ){
            this.resetDialogPositon();
            const $scrollDom = $(".ant-table-body");
            let orgTop = $scrollDom[0].scrollTop;
            let orgLeft = $scrollDom[0].scrollLeft;
            const $colCanvas = $(".collaborate-canvas");
            let canvasTop = $colCanvas[0].offsetTop;
            let canvasLeft = $colCanvas[0].offsetLeft;
            $scrollDom.off("scroll.collaborate").on("scroll.collaborate", ( e ) => {
                //滚动的高度
                const newTop = $scrollDom[0].scrollTop;
                const diff = newTop - orgTop;
                const newCanvasTop = canvasTop - diff;
                //协调窗口位置重新定位
                $colCanvas.css("top", newCanvasTop + 'px' );
                //更新高度
                orgTop = newTop;
                canvasTop = newCanvasTop;

                //滚动的高度
                const newLeft = $scrollDom[0].scrollLeft;
                const diffLeft = newLeft - orgLeft;
                const newCanvasLeft = canvasLeft - diffLeft;
                //协调窗口位置重新定位
                $colCanvas.css("left", newCanvasLeft + 'px' );
                //更新高度
                orgLeft = newLeft;
                canvasLeft = newCanvasLeft;
            });
        }
    };

    //关闭协调窗口
    closeCollaborateDialog(){
        const { updateOperationDatasShowNameAndPosition, tableName } = this.props;
        //更新数据，需要展开的协调窗口名称和位置
        updateOperationDatasShowNameAndPosition( "", 0, 0, tableName );
    };
    //关闭弹出模态框窗口
    closeDialog( dialogKey ){
        this.setState({
            [dialogKey]: { //协调窗口关闭
                show: false
            }
        });
    };

    requestCallBackFunc( res, mes ){
        this.closeCollaborateDialog();
        this.props.requestCallback( res, mes );
    };

    //处理航班号id提交操作事件
    handleFlightIdClick( item, rowData ){
        const { userId = "", generateTime, requestCallback } = this.props;
        //选中的操作名称
        const { en = "", cn = "", url = "" } = item;
        if( en == "COORDINATION_DETAIL" ){ // 查看协调记录
            this.setState({
                collaborateRecords: { //协调记录窗口显隐
                    show: true
                }
            });
            this.closeCollaborateDialog();
        }else if( en == "FORMER_UPDATE" ){ // 指定前序航班
            this.setState({
                formerFlight: { //指定前序航班窗口显隐
                    show: true
                }
            });
            this.closeCollaborateDialog();
        }else{
            //航班ID
            const id = rowData["ID"]*1 || 0;
            //备注输入的值
            const comment = this.refs.comment.textAreaRef.value || "";
            // 标记准备完毕 标记未准备完毕 标记豁免 取消豁免
            let params = { id, userId, comment };
            if( en == "ASSIGNSLOT_MARK"  ){ //退出时隙分配
                params["assignSlotStatus"] = 3;
            }else if( en == "ASSIGNSLOT_UN_MARK" ){ //参加时隙分配
                params["assignSlotStatus"] = 0;
            }else if( en == "CLEARANCE_MARK"  ){ //标记已放行 1 标记已放行
                params["status"] = 1;
            }else if( en == "CLEARANCE_UN_MARK" ){ //标记未放行 0 标记未放行
                params["status"] = 0;
            }else if( en == "QUALIFICATIONS_MARK"  ){ //标记二类飞行资质 2 标记二类飞行
                params["type"] = 2;
            }else if( en == "QUALIFICATIONS_UN_MARK" ){ //取消二类飞行资质 0 标记没有二类飞行资质
                params["type"] = 0;
            }else if( en == "INPOOL_UPDATE" ){ //移入等待池 0
                params["status"] = 2;
            }else if( en == "OUTPOOL_APPLY" || en == "OUTPOOL_APPROVE" ){ //申请移出等待池 批复移出等待池
                //比较当前时间和TOBT
                const tobt = rowData["TOBT"];
                if( tobt*1 < generateTime*1 ){
                    this.setState({
                        outPoolByTOBT: {
                            show: true,
                            name: en
                        }
                    });
                    this.closeCollaborateDialog();
                    return;
                }else{
                    params["tobt"] = tobt;
                }
            }else if( en == "CANCEL_MARK" ){ //标记航班取消 3
                params["status"] = 3;
            }else if( en == "CANCEL_UN_MARK" ){ //标记航班恢复 0
                params["status"] = 0;
            }
            //发送请求
            request( `${host}/${url}`, "post", params, (res) => {
                this.closeCollaborateDialog();
                requestCallback(res, rowData['FLIGHTID'] + " " + cn);
            }, ( err ) => {
                message.error(rowData['FLIGHTID'] + " " + cn + "请求失败", 5 );
            });
        }
    };

    //获取时间类协调窗口权限
    getTimeColumnsAuth( rowData, showName ){
        let res = "";
        if( isValidObject(rowData) && isValidVariable(showName) ){
            if( showName == "FLIGHTID" ){
                res =  "";
            }else if(showName == "COBT" || showName == "CTOT" || showName == "ASBT" || showName == "AGCT" || showName == "AOBT"
             || showName == "DELAY_REASON" || showName == "DEICE_STATUS" || showName == "DEICE_GROUP" || showName == "DEICE_POSITION"
             || showName == "POSITION" || showName == "RUNWAY"
            ){ // 两个按钮的【申请】【清除】
                if(showName == "DEICE_STATUS" || showName == "DEICE_GROUP" || showName == "DEICE_POSITION"){
                    showName = "DEICE";
                }
                const authMap = rowData.originalData.flightAuthMap;
                const updateKey = showName+"_UPDATE";
                const cancelKey = showName+"_CLEAR";
                const updateAuth = authMap[updateKey] || {};
                const cancelAuth = authMap[cancelKey] || {};
                const updateObj = OperationTypeForTimeColumn[updateKey] || {};
                const cancelObj = OperationTypeForTimeColumn[cancelKey] || {};
                res = {
                    show: false,
                    reason: "",
                    cn: updateObj.cn || "",
                    updateBtn: {
                        show: false,
                        url: updateObj.url
                    },
                    cancelBtn: {
                        show: true,
                        url: cancelObj.url
                    }
                };
                if( isValidVariable(updateAuth.status) && updateAuth.status == "Y" ){
                    res.show = true;
                    res.updateBtn.show = true;
                }else{
                    res.reason = updateAuth.reason;
                }
                if( isValidVariable(cancelAuth.status) && cancelAuth.status == "Y" ){
                    res.show = true;
                    res.cancelBtn.show = true;
                }
                //跑道，增加跑道值
                if( showName == "RUNWAY" ){
                    const { availableInfo } = updateAuth;
                    if( isValidVariable(availableInfo) ){
                        const { ORUNWAY = "" } = availableInfo;
                        const runwayArr = ORUNWAY.split(',');
                        res["runwayArr"] = runwayArr;
                    }else{
                        res["runwayArr"] = [];
                    }

                }
            }else if(showName == "HOBT" || showName == "TOBT" || showName == "PRIORITY"){ // HOBT TOBT 优先级(TASK)申请
                // 两种情况 三个按钮的： 申请=>【申请】 批复=>【批复】【拒绝】
                const authMap = rowData.originalData.flightAuthMap;
                const applyKey = showName+"_APPLY";  //申请
                const applyAuth = authMap[applyKey] || {};
                const applyObj = OperationTypeForTimeColumn[applyKey] || {};
                const approveKey = showName+"_APPROVE";  //批复
                const approveAuth = authMap[approveKey] || {};
                const approveObj = OperationTypeForTimeColumn[approveKey] || {};
                const refuseKey = showName+"_REFUSE";  //拒绝
                const refuseAuth = authMap[refuseKey] || {};
                const refuseObj = OperationTypeForTimeColumn[refuseKey] || {};
                res = {
                    show: false,
                    reason: "",
                    cn: "",
                    type: "",
                    applyBtn: {
                        show: false,
                        url: applyObj.url
                    },
                    approveBtn: {
                        show: false,
                        url: approveObj.url
                    },
                    refuseBtn: {
                        show: false,
                        url: refuseObj.url
                    }
                };

                if( isValidVariable(applyAuth.status) && applyAuth.status == "Y" ){
                    res.show = true;
                    res.type = "apply";
                    res.cn = applyObj.cn;
                    res["applyBtn"].show = true;
                }else if( isValidVariable(approveAuth.status) && approveAuth.status == "Y" ){
                    res.show = true;
                    res.type = "approve";
                    res.cn = approveObj.cn;
                    res["approveBtn"].show = true;
                    if( isValidVariable(refuseAuth.status) && refuseAuth.status == "Y" ){
                        res["refuseBtn"].show = true; //拒绝按钮
                    }
                }else{
                    res.reason = applyAuth.reason;
                }
            }
        }
        return res;
    };

    //计重置协调窗口位置
    resetDialogPositon(){
        const { x = 0, y = 0 } = this.props.operationDatas;
        let left = x;
        let top = y;
        const $tableDom = $(".main-table");
        //协调窗口对象
        const $collaborateDom = $(".collaborate-canvas");
        if( x > 0 && y > 0 && $tableDom.length > 0 && $collaborateDom.length > 0 ){
            const tableHeight = $tableDom.height();
            const tableWidth = $tableDom.width();
            const collaborateHeight = $collaborateDom.height();
            const collaborateWidth = $collaborateDom.width();
            //箭头对象
            const $arrow = $(".popover-arrow", $collaborateDom);
            //如果协调窗口高度 + y 超出了表高度，对称显示
            if( collaborateHeight + y > tableHeight && y >= collaborateHeight){
                top = y - collaborateHeight + 32;
                //修改箭头位置 下
                $arrow.removeClass("top").addClass("bottom");
            }else{
                top = y;
                //上
                $arrow.removeClass("bottom").addClass("top");
            }
            //如果协调窗口宽度 + x 超出了表宽度，对称显示
            if( collaborateWidth + x > tableWidth && x >= tableWidth){
                left = x - collaborateWidth;
                //右
                $arrow.removeClass("left").addClass("right");
            }else{
                left = x;
                //左
                $arrow.removeClass("right").addClass("left");
            }
            $collaborateDom.css({
                top: top + 'px',
                left: left + 'px'
            })
        }
    };

    render(){
        const { userId, deiceGroupName, deicePositionArray, generateTime } = this.props;
        const { auth, showName = "", rowData = {}, x = 0, y = 0 } = this.props.operationDatas;
        //时间列显示权限
        let timeAuth = this.getTimeColumnsAuth( rowData, showName );

        const dialogStyle = {
            left: x,
            top: y
        };

        return (
            <div className="collaborate-canvas" style={ dialogStyle }>
                {
                    (showName == "FLIGHTID") ?
                        <div className="collaborate-dialog dialog-container">
                            <div className="popover-arrow left top"></div>
                            <div className="title">
                                <span>{ rowData["FLIGHTID"] }</span>
                                <div
                                    className="close-target"
                                    onClick={ this.closeCollaborateDialog }
                                >
                                    <Icon type="close" title="关闭"/>
                                </div>
                            </div>
                            <div className={`content ${showName}`}>
                                {
                                    auth.map((item, index) => {
                                        return (
                                            <div key = {index} title={item.cn} onClick={(e) => { this.handleFlightIdClick(item, rowData); }}>
                                                <i className={`iconfont icon-${item.type}`}></i>
                                                <span className="word">{item.cn}</span>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    auth.length == 1 ? "" :
                                        <div className="comment" key="comment" title="操作备注">
                                            <TextArea placeholder="操作备注"  ref="comment"/>
                                        </div>
                                }

                            </div>
                        </div>
                        : ""
                }
                {
                    (
                        (showName == "COBT" || showName == "CTOT" || showName == "ASBT" || showName == "AGCT" ||
                         showName == "AOBT" || showName == "HOBT" || showName == "TOBT" || showName == "PRIORITY" ||
                         showName == "DELAY_REASON" || showName == "DEICE_STATUS" || showName == "DEICE_GROUP" ||
                         showName == "DEICE_POSITION" || showName == "POSITION" || showName == "RUNWAY"
                        ) ?
                            (
                                (isValidVariable(timeAuth) && timeAuth.show)
                                    ? <div className="collaborate-dialog dialog-container">
                                        <div className="popover-arrow left top"></div>
                                        <div className="title">
                                            <span>{timeAuth.cn}</span>
                                            <div
                                                className="close-target"
                                                onClick={ this.closeCollaborateDialog }
                                            >
                                                <Icon type="close" title="关闭"/>
                                            </div>
                                        </div>
                                        <FormDialogIns
                                            rowData={rowData}
                                            showName={showName}
                                            userId={userId}
                                            deiceGroupName={deiceGroupName}
                                            deicePositionArray={deicePositionArray}
                                            timeAuth={timeAuth}
                                            requestCallback = {this.requestCallBackFunc}
                                        />
                                    </div>
                                    : <ReasonDialog
                                        timeAuth = {timeAuth}
                                        closeCollaborateDialog = { this.closeCollaborateDialog }
                                    />
                            ): ""
                    )
                }
                {
                    this.state.collaborateRecords.show ? (
                        <CreateLayer
                            className="collaborate-records-layer"
                        >
                            <CollaborateRecords
                                flightid = { rowData["FLIGHTID"] }
                                id = { rowData["ID"]  }
                                userId = {userId}
                                x = { 300 }
                                y = { 240 }
                                clickCloseBtn = { () => {
                                    this.closeDialog("collaborateRecords");
                                } }
                            />

                        </CreateLayer>
                    ) : ""
                }
                {
                    this.state.formerFlight.show ? (
                        <CreateLayer
                            className="former-layer"
                        >
                            <FormerFlight
                                flightid = { rowData["FLIGHTID"] }
                                id = { rowData["ID"]  }
                                userId = {userId}
                                x = { 600 }
                                y = { 350 }
                                requestCallback = {this.requestCallBackFunc}
                                clickCloseBtn = { () => {
                                    this.closeDialog("formerFlight");
                                } }
                            />

                        </CreateLayer>
                    ) : ""
                }
                {
                    this.state.outPoolByTOBT.show ? (
                        <CreateLayer
                            className="outpool-by-tobt-layer"
                            style = {{
                                top: "35rem",
                                left: "28rem"
                            }}
                        >
                            <OutPoolByTOBT
                                userId = { userId }
                                id = { rowData["ID"] }
                                flightid = { rowData["FLIGHTID"] }
                                tobt = { rowData["TOBT"] }
                                generateTime = { generateTime }
                                requestCallback = {this.requestCallBackFunc}
                                name =  { this.state.outPoolByTOBT.name }
                                clickCloseBtn = { () => {
                                    this.closeDialog("outPoolByTOBT");
                                } }
                            />

                        </CreateLayer>
                    ) : ""
                }
            </div>
        )
    }
};

export default OperationDialog;