import React from 'react';
import { Row, Icon } from 'antd';
import {requestGet} from "utils/request-actions";
import {getSingleCollaborateRecordUrl} from "utils/request-urls";
import DraggableModule from "components/DraggableModule/DraggableModule";
import TableLayoutDetail from "components/DetailModule/TableLayoutDetail";


class CollaborateRecords extends React.Component{
    componentWillUpdate(){
        const { id, userId, updateCollaborateRecords } = this.props;
        //根据航班id获取协调记录
        const params = {
            userId: userId,
            id: id*1
        };
        requestGet( getSingleCollaborateRecordUrl, params, (res) => {
            const { result = {}, generateTime = "" } = res;
            //更新协调记录
            updateCollaborateRecords( result, generateTime );
        })
    };
    shouldComponentUpdate(nextProps, nextState){
        if( nextProps.id == this.props.id ){
            return false;
        }else{
            return true;
        }
    };

    render(){
        const { width = 1000, flightid, clickCloseBtn, collaborateRecords } = this.props;
        const { records = {} } = collaborateRecords;
        return (
            <DraggableModule
                bounds = ".root"
            >
                <div className="box center no-cursor" style={{ width: width }}>
                    <div className="dialog">
                        {/* 头部*/}
                        <Row className="title drag-target cursor">
                            <span>{ flightid }协调记录</span>
                            <div
                                className="close-target"
                                onClick={ clickCloseBtn }
                            >
                                <Icon type="close" title="关闭"/>
                            </div>
                        </Row>
                        {/* 表单内容*/}
                        <TableLayoutDetail
                            name = "recordMap"
                            orgMap = { records }
                        />
                    </div>
                </div>
            </DraggableModule>
        )
    }
};

export default CollaborateRecords;