//机场流控页面
import React from 'react';
import { Row, Icon } from 'antd';
import APContent from "components/FlowcontrolModule/APContent/APContent";
import APGSDepContent from "components/FlowcontrolModule/APGSDepContent/APGSDepContent";
import POINTContent from "components/FlowcontrolModule/POINTContent/POINTContent";
import TRANSLATIONContent from "components/FlowcontrolModule/TRANSLATIONContent/TRANSLATIONContent";
import DraggableModule from "components/DraggableModule/DraggableModule";

import './FlowcontrolDialog.less';

class FlowcontrolDialog extends React.Component{
    constructor( props ){
        super(props);
    }
    render(){
        const { updateMultiFlowcontrolDatas } = this.props;
        const { titleName, clickCloseBtn, width = 1050, dialogName, x, y, loginUserInfo, systemConfig, generateTime, id, category, placeType} = this.props;
        console.log(this.props);
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
                            (category == 'AP' ) ? <APContent
                                clickCloseBtn = {clickCloseBtn}
                                dialogName = {dialogName}
                                loginUserInfo = {loginUserInfo}
                                systemConfig = {systemConfig}
                                generateTime = {generateTime}
                                id = {id}
                                placeType = {placeType}
                                updateMultiFlowcontrolDatas = { updateMultiFlowcontrolDatas }
                            /> : ''
                        }
                        {/*低能见度受限*/}
                        {

                            ( category =='GS_DEP') ? <APGSDepContent
                                clickCloseBtn = {clickCloseBtn}
                                dialogName = {dialogName}
                                loginUserInfo = {loginUserInfo}
                                systemConfig = {systemConfig}
                                generateTime = {generateTime}
                                id = {id}
                                placeType = {placeType}
                                updateMultiFlowcontrolDatas = { updateMultiFlowcontrolDatas }
                            /> : ''
                        }
                        {

                            ( category =='TRANSLATION') ? <TRANSLATIONContent
                                clickCloseBtn = {clickCloseBtn}
                                dialogName = {dialogName}
                                loginUserInfo = {loginUserInfo}
                                systemConfig = {systemConfig}
                                generateTime = {generateTime}
                                id = {id}
                                placeType = {placeType}
                                updateMultiFlowcontrolDatas = { updateMultiFlowcontrolDatas }
                            /> : ''
                        }
                        {
                            category == 'POINT' ? <POINTContent
                                clickCloseBtn = {clickCloseBtn}
                                dialogName = {dialogName}
                                loginUserInfo = {loginUserInfo}
                                systemConfig = {systemConfig}
                                generateTime = {generateTime}
                                id = {id}
                                placeType = {placeType}
                                updateMultiFlowcontrolDatas = { updateMultiFlowcontrolDatas }
                            />  : ''
                        }

                    </div>
                </div>
            </DraggableModule>
        )
    }
};

export default FlowcontrolDialog ;