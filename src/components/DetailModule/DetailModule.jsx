//航班表格上右键协调对话框
import React from 'react';
import { Row, Col, Icon } from 'antd';
import $ from 'jquery';
import {formatTimeString} from "utils/basic-verify";
import AdditionalDetail from './AdditionalDetail';
import './DetailModule.less';

class DetailModule extends React.Component{
    constructor( props ){
        super( props );
    }

    render(){
        const { detailModalDatas, updateDetailModalDatasVisible, unfoldAllDetailModules, name } = this.props;
        const unfoldAll = detailModalDatas[name].unfoldAll || false;
        const orgData = detailModalDatas[name].orgData || {};
        const { FlightDetailView = {}, generateTime } = orgData;
        const { flightBasicMap = {} } = FlightDetailView;
        const FLIGHTID = flightBasicMap.FLIGHTID || {};

        return (
            <Row className="flight-detail-container">
                <Col span={24} className="title">
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
                    <div
                        className="close-target fold-icon"
                        onClick={ (e) => {
                            const dom = $(".flight-detail-container>.content");
                            if( dom.hasClass("full") ){
                                dom.removeClass("full");
                                unfoldAllDetailModules("flight", false);
                            }else{
                                dom.addClass("full");
                                unfoldAllDetailModules("flight", true);
                            }
                        } }
                        title = "展示/关闭完整详情"
                    >
                        <i className="iconfont icon-unfold"/>
                    </div>
                </Col>
                <Col span={24} className="content">
                    <AdditionalDetail
                        flightDetailView = { FlightDetailView }
                        unfoldAll = { unfoldAll }
                    />
                </Col>
            </Row>
    )
    }

};

export default DetailModule;