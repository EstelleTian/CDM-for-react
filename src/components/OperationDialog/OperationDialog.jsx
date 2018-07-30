//航班表格上右键协调对话框
import React from 'react';
import { Icon } from 'antd';
import $ from 'jquery';
import './OperationDialog.less';
import {isValidVariable} from "utils/basic-verify";

class OperationDialog extends React.Component{
    constructor( props ){
        super( props );
    }

    componentDidUpdate(){
        console.log("componentDidUpdate");
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
    }

    render(){
        const { showName, x, y, auth, rowData } = this.props.operationDatas;
        const dialogStyle = {
          left: x,
          top: y
        };
        return (
            <div className="collaborate-canvas" style={ dialogStyle }>
                {
                    (showName == "flightid") ?
                        <div className="collaborate-dialog">
                            <div  className="title">
                                <span>{ rowData["FLIGHTID"] }</span>
                                <div
                                    className="close-target"
                                    onClick={ () => {
                                        // clickCloseBtn(type);
                                    } }
                                >
                                    <Icon type="close" title="关闭"/>
                                </div>
                            </div>
                            <div className="content flightid">
                                {
                                    auth.map((item, index) => {
                                        return (
                                            <div key = {index} title={item.cn}>
                                                <i className={`iconfont icon-${item.type}`}></i>
                                                <span className="word">{item.cn}</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        : ""
                }
            </div>
        )
    }

};

export default OperationDialog;