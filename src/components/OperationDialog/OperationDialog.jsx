//航班表格上右键协调对话框
import React from 'react';
import { Icon, Input, Form } from 'antd';
import $ from 'jquery';
import './OperationDialog.less';
import { isValidVariable } from "utils/basic-verify";
import { requestGet } from "utils/request-actions";
import { host } from "utils/request-urls";
import FormDialog from './Form';

const { TextArea } = Input;

const FormDialogIns = Form.create()(FormDialog)

class OperationDialog extends React.Component{
    constructor( props ){
        super( props );
        this.handleFlightIdClick = this.handleFlightIdClick.bind(this);
        this.closeCollaborateDialog = this.closeCollaborateDialog.bind(this);
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


    //处理航班号id提交操作事件
    handleFlightIdClick( item, rowData ){
        //选中的操作名称
        const { en = "", url = "" } = item;
        //航班ID
        const id = rowData["ID"] || "";
        //备注输入的值
        const comment = this.refs.comment.textAreaRef.value || "";

        console.log( host, url, en, id, comment );
        let params = {};
        // 标记准备完毕 标记未准备完毕 标记豁免 取消豁免
        if( en == "READY_MARK" || en == "READY_UN_MARK" || en == "EXEMPT_MARK" || en == "EXEMPT_UN_MARK" ){
            params = {
                id,
                comment
            };
        }else if( en == "" ){

        }
        //发送请求
        requestGet( `${host}/${url}`, params, (res) => {
            console.log(res);
        });



    }

    render(){
        const { userId } = this.props;
        const { showName, x, y, auth, rowData } = this.props.operationDatas;

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
                    (showName == "COBT" || showName == "CTOT") ?
                        <div className="collaborate-dialog">
                            <div  className="title">
                                <span>{showName}时间变更</span>
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
                            />
                        </div>
                        : ""
                }
            </div>
        )
    }
};

export default OperationDialog;