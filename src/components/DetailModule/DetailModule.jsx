//航班表格上右键协调对话框
import React from 'react';
import { Drawer, Row, Col, Icon } from 'antd';
import {formatTimeString} from "utils/basic-verify";
import BasicDetail from './BasicDetail';
import AdditionalDetail from './AdditionalDetail';
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
                        <div
                            className="close-target"
                            onClick={ () => {
                                updateDetailModalDatasVisible("flight", false);
                            } }
                        >
                            <Icon type="close" title="关闭"/>
                        </div>
                    </div>
                )}
                placement="bottom"
                closable={ false }
                visible={ show }
                onClose = {() =>{
                    updateDetailModalDatasVisible(name, false);
                }}
            >
                <Col span={24} className="content flight-content">
                    <AdditionalDetail
                        flightDetailView = { FlightDetailView }
                    />
                </Col>
            </Drawer>
        )
    }

};

export default DetailModule;