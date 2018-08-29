import React from 'react';
import { Row, Icon } from 'antd';
import {requestGet} from "utils/request-actions";
import {getSingleCollaborateRecordUrl} from "utils/request-urls";
import DraggableModule from "components/DraggableModule/DraggableModule";
import TableLayoutDetail from "components/DetailModule/TableLayoutDetail";


class CollaborateRecords extends React.Component{
    constructor(props){
        super(props);
        this.getRecordRequest = this.getRecordRequest.bind(this);
        this.state = {
            records: {}
        };
    };
    //请求方法
    getRecordRequest(){
        const { id, userId } = this.props;
        //根据航班id获取协调记录
        const params = {
            userId: userId,
            id: id*1
        };
        requestGet( getSingleCollaborateRecordUrl, params, (res) => {
            const { result = {}, generateTime = "" } = res;
            //更新协调记录
            this.setState({
                records: result
            });
        })
    };
    componentWillMount(){
        this.getRecordRequest();
    };
    componentWillUpdate(){
        this.getRecordRequest();
    };
    shouldComponentUpdate(nextProps, nextState){
        if( nextProps.id == this.props.id ){
            var keysA = Object.keys(this.state.records);
            var keysB = Object.keys(nextState.records);
            if (keysA.length !== keysB.length) {
                return true;
            }else{
                for (let idx = 0; idx < keysA.length; idx++) {
                    let key = keysA[idx];
                    if( keysB.indexOf(key) == -1 ){
                        return true;
                    }
                }
                return false;
            }
        }else{
            return true;
        }
    };

    render(){
        const { width = 1000, flightid, clickCloseBtn } = this.props;
        const { records = {} } = this.state;
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