//机场流控页面
import React from 'react';
import { Row, Icon } from 'antd';
import APContent from "components/FlowcontrolModule/APContent/APContent";
import APGSDepContent from "components/FlowcontrolModule/APGSDepContent/APGSDepContent";
import POINTContent from "components/FlowcontrolModule/POINTContent/POINTContent";
import DraggableModule from "components/DraggableModule/DraggableModule";

import './FlowcontrolDialog.less';

class FlowcontrolDialog extends React.Component{
    constructor( props ){
        super(props);
    }
    render(){
        const { titleName, clickCloseBtn, width = 1050, dialogName, x, y, loginUserInfo, systemConfig, generateTime, id, placeType, limitType} = this.props;
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
                        {/*机场流控*/}
                        {
                            (placeType == 'AP' && limitType !='GS_DEP') ? <APContent
                                clickCloseBtn = {clickCloseBtn}
                                dialogName = {dialogName}
                                loginUserInfo = {loginUserInfo}
                                systemConfig = {systemConfig}
                                generateTime = {generateTime}
                                id = {id}
                                placeType = {placeType}
                            /> : ''
                        }
                        {/*低能见度受限*/}
                        {

                            (placeType == 'AP' && limitType =='GS_DEP') ? <APGSDepContent
                                clickCloseBtn = {clickCloseBtn}
                                dialogName = {dialogName}
                                loginUserInfo = {loginUserInfo}
                                systemConfig = {systemConfig}
                                generateTime = {generateTime}
                                id = {id}
                                placeType = {placeType}
                            /> : ''
                        }
                        {
                            placeType == 'POINT' ? <POINTContent
                                clickCloseBtn = {clickCloseBtn}
                                dialogName = {dialogName}
                                loginUserInfo = {loginUserInfo}
                                systemConfig = {systemConfig}
                                generateTime = {generateTime}
                                id = {id}
                                placeType = {placeType}
                            />  : ''
                        }

                    </div>
                </div>
            </DraggableModule>
        )
    }
};

export default FlowcontrolDialog ;