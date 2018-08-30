//机场流控页面
import React from 'react';
import { Row, Icon } from 'antd';
import APContent from "components/FlowcontrolModule/APContent/APContent";
import DraggableModule from "components/DraggableModule/DraggableModule";

import './FlowcontrolDialog.less';

class FlowcontrolDialog extends React.Component{
    constructor( props ){
        super(props);
    }

    render(){
        const { titleName, clickCloseBtn, width = 1000, dialogName, x, y, loginUserInfo, systemConfig, generateTime} = this.props;
        return (
            <DraggableModule
                bounds = ".root"
                x = {x}
                y = {y}
            >
                <div className="box center no-cursor" style={{ width: width }}>
                    <div className="dialog">
                        {/* 头部*/}
                        <Row className="title drag-target cursor">
                            <span>{ titleName }</span>
                            <div
                                className="close-target"
                                onClick={ () => {
                                    clickCloseBtn(dialogName);
                                } }
                            >
                                <Icon type="close" title="关闭"/>
                            </div>
                        </Row>
                        {/* 表单内容*/}
                        <APContent
                            clickCloseBtn = {clickCloseBtn}
                            dialogName = {dialogName}
                            loginUserInfo = {loginUserInfo}
                            systemConfig = {systemConfig}
                            generateTime = {generateTime}
                        />
                    </div>
                </div>
            </DraggableModule>
        )
    }
};

export default FlowcontrolDialog ;