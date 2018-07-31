//可拖拽的对话框

import React from 'react';
import { Row, Col, Icon, Button } from 'antd';

import CreateLayer from '../Layer/Layer';
import DraggableModule from '../DraggableModule/DraggableModule';
import '../../style/button.less';
import './DraggableDialog.less';

class DraggableDialog extends React.Component{
    constructor( props ){
        super(props);
        this.state = {

        }
    }

    render(){
        const { titleName, type, width, clickCloseBtn} = this.props;
        const left = (document.body.offsetWidth - width)/2;
        return (
        <CreateLayer

        >
            <div>
                <DraggableModule
                    x = {left}
                    y = {100}
                >
                    <div className="dialog-wrapper no-cursor" style={{ width: width }}>
                        <div className="dialog">
                            {/* 头部*/}
                            <Row className="title drag-target cursor">
                                <span>{ titleName }</span>
                                <div
                                    className="close-target"
                                    onClick={ () => {
                                        clickCloseBtn(type);
                                    } }
                                >
                                    <Icon type="close" title="关闭"/>
                                </div>
                            </Row>
                            {/* 内容 */}
                            <Row className="content">
                                { this.props.children }
                            </Row>
                            {/* 底部*/}
                            <Row className="footer">
                                <Col className="" xs={{ span: 24}}  md={{ span: 24}} lg={{ span: 24}}  xl={{ span: 24}} xxl={{ span: 24}} >

                                    <Button className= 'c-btn c-btn-default'
                                            onClick={ () => {
                                                clickCloseBtn(type);
                                            }}
                                    >
                                        关闭
                                    </Button>
                                    <Button className='c-btn c-btn-blue'
                                            type="primary"
                                    >
                                        提交
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </DraggableModule>
            </div>
        </CreateLayer>
        )
    }
};

export default DraggableDialog;