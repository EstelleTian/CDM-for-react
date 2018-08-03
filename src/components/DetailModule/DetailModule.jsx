//航班表格上右键协调对话框
import React from 'react';
import { Drawer, Row } from 'antd';
import BasicDetail from './BasicDetail';
import {formatTimeString} from "utils/basic-verify";
import './DetailModule.less';

class DetailModule extends React.Component{
    constructor( props ){
        super( props );
    }

    render(){
        const { detailModalDatas, updateDetailModalDatasVisible, name } = this.props;
        const show = detailModalDatas[name].show || false;
        const orgData = detailModalDatas[name].orgData || {};
        const { FlightDetailView = {}, generateTime } = orgData;
        const { flightBasicMap = {} } = FlightDetailView;
        const FLIGHTID = flightBasicMap.FLIGHTID || {};


        return (
            <Drawer
                title={(
                    <div className="title">
                        <span className="flightid">{FLIGHTID.value || "" } 航班详情</span>
                        <span className="time">(数据获取时间: {formatTimeString(generateTime)})</span>
                    </div>
                )}
                placement="bottom"
                closable={ false }
                visible={ show }
                onClose = {() =>{
                    updateDetailModalDatasVisible(name, false);
                }}
            >
                <Row className="content">
                    <BasicDetail
                        basicMap = { flightBasicMap }
                    />
                </Row>
            </Drawer>
        )
    }

};

export default DetailModule;