//航班表格上右键协调对话框
import React from 'react';
import { Icon, Input, Form } from 'antd';
import $ from 'jquery';
import {isValidObject, isValidVariable} from "utils/basic-verify";
import { request } from "utils/request-actions";
import { host } from "utils/request-urls";
import FormDialog from './Form';
import { convertData, getDisplayStyle, getDisplayStyleZh, getDisplayFontSize } from "utils/flight-grid-table-data-util";

import './OperationDialog.less';
import {OperationTypeForTimeColumn} from "utils/flightcoordination";

const { TextArea } = Input;

const FormDialogIns = Form.create()(FormDialog)

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
        this.requestCallback = this.requestCallback.bind(this);
    }

    componentDidUpdate(){
        const { showName } = this.props.operationDatas;
        //若协调窗口打开才监听，没打开不监听
        if( isValidVariable(showName) ){
            const $scrollDom = $(".ant-table-body");
            let orgTop = $scrollDom[0].scrollTop;
            const $colCanvas = $(".collaborate-canvas");
            let canvasTop = $colCanvas[0].offsetTop;

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
            });
        }
    };
    //关闭协调窗口
    closeCollaborateDialog(){
        const { updateOperationDatasShowNameAndPosition } = this.props;
        //更新数据，需要展开的协调窗口名称和位置
        updateOperationDatasShowNameAndPosition( "", 0, 0 );
    };
    //表单提交后--单条数据更新方法
    requestCallback( res ){
        this.closeCollaborateDialog();
        const { updateMultiTableDatas } = this.props;
        const { flightView = {}, generateTime } = res;
        const { flightFieldViewMap = {}, flightAuthMap = {} } = flightView;
        const { ID = {} } =flightFieldViewMap;
        const id = ID.value;

        const data = this.convertData( flightFieldViewMap, flightAuthMap, generateTime );
        //将航班原数据补充到航班对象中
        data.originalData = flightView;
        const map = {
            [id]: data
        }
        updateMultiTableDatas( map );
    };


    //处理航班号id提交操作事件
    handleFlightIdClick( item, rowData ){
        const { userId = "", updateMultiTableDatas } = this.props;
        //选中的操作名称
        const { en = "", url = "" } = item;
        //航班ID
        const id = rowData["ID"]*1 || null;
        //备注输入的值
        const comment = this.refs.comment.textAreaRef.value || "";
        // 标记准备完毕 标记未准备完毕 标记豁免 取消豁免
        let params = {
            id,
            userId,
            comment
        };

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
            params["status"] = 0;
        }
        //发送请求
        request( `${host}/${url}`, "post", params, (res) => {
            console.log(res);
            this.requestCallback(res);
        });
    };

    getTimeColumnsAuth( rowData, showName ){
        let res = "";
        if( isValidObject(rowData) && isValidVariable(showName) ){
            if( showName == "FLIGHTID" ){
                res =  "";
            }else if(showName == "COBT" || showName == "CTOT" || showName == "ASBT" || showName == "AGCT" || showName == "AOBT"){
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
            }else if(showName == "HOBT"){
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

    render(){
        const { userId } = this.props;
        const { showName = "", x, y, auth, rowData = {} } = this.props.operationDatas;
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
                        <div className="collaborate-dialog">
                            <div  className="title">
                                <span>{ rowData["FLIGHTID"] }</span>
                                <div
                                    className="close-target"
                                    onClick={ this.closeCollaborateDialog }
                                >
                                    <Icon type="close" title="关闭"/>
                                </div>
                            </div>
                            <div className="content flightid">
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
                                    auth.length == 2 ? "" :
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
                        (showName == "COBT" || showName == "CTOT" || showName == "ASBT" || showName == "AGCT" || showName == "AOBT") ?
                            (
                                (isValidVariable(timeAuth) && timeAuth.show)
                                    ? <div className="collaborate-dialog">
                                        <div  className="title">
                                            <span>{timeAuth.cn}变更</span>
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
                                            timeAuth={timeAuth}
                                            requestCallback = { this.requestCallback }
                                        />
                                    </div>
                                    : <div className="collaborate-dialog">
                                         <div>{timeAuth.reason}</div>
                                      </div>
                            ): ""
                    )
                }
                {
                    (showName == "HOBT") ?
                        (
                            (isValidVariable(timeAuth) && timeAuth.show)
                                ? <div className="collaborate-dialog">
                                    <div  className="title">
                                        <span>{timeAuth.cn}变更</span>
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
                                        timeAuth={timeAuth}
                                        requestCallback = { this.requestCallback }
                                    />
                                </div>
                                : <div className="collaborate-dialog">
                                    <div>{timeAuth.reason}</div>
                                </div>
                        ): ""
                }
            </div>
        )
    }
};

export default OperationDialog;