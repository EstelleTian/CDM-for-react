//流控信息---菜单操作功能

import React from 'react';
import { Row, Col, Icon } from 'antd';
import CreateLayer from "components/CreateLayer/CreateLayer";
import NoticeDetailContainer from "components/NoticeModule/Detail/NoticeDetailContainer";

import './NoticeItem.less';

class NoticeItem extends React.Component{
    constructor( props ){
        super(props);
        this.convertNoticeData = this.convertNoticeData.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.onCloseBtn = this.onCloseBtn.bind(this);
        this.state = {
            detail: {
                show: false,
            },

        }
    }

    //转换数据
    convertNoticeData(data,generateTime) {

        const  formatDateTime = (dateTime) => {
            if(dateTime && dateTime.length >=12 ){
                return dateTime.substring(6,8)+ '/' + dateTime.substring(8,12);
            }
        };

        const  formatDate = (dateTime) => {
            if(dateTime && dateTime.length >=12 ){
                return dateTime.substring(0,4)+ '-' + dateTime.substring(4,6) + '-' + dateTime.substring(6,8) ;
            }
        };

        let result = JSON.parse(JSON.stringify(data));
        result.lastModifyTime = formatDateTime(data.lastModifyTime);
        result.lastModifyDate = formatDate(data.lastModifyTime);
        return result;
    }

    // 打开详情
    openDetail(){
        this.setState({
            detail: {
                show: true
            }
        });
    }
    //当点击关闭按钮时，type: 类型
    onCloseBtn( type ){
        this.setState({
            [type]: {
                show: false
            }
        });
    }


    render(){
        const { data, generateTime, indexNumber } = this.props;
        const formatData =  this.convertNoticeData(data,generateTime);
        const { id, title, text, publishUser, lastModifyTime, lastModifyDate} = formatData;
        const {detail} = this.state;
        return (
            <Col span={24} className="notice-item">
                <Row className="title row">
                    <Col  span={8} className="title" title={title ? `${title}`: ''} >
                        <span>{title}</span>
                    </Col>

                    <Col  span={8} className="publish-user" title={publishUser ? `${publishUser}`: ''} >
                        <span>{publishUser}</span>
                    </Col>
                    <Col  span={6} className="last-modify-time" title={lastModifyDate ? `${lastModifyDate}`: ''} >
                        <i className="iconfont icon-time" title="修改时间" />
                        <span>{lastModifyTime}</span>
                    </Col>
                </Row>
                <Row className="row">
                    <Col  span={24} className="text" title={text ? `${text}`: ''} >
                        <span>{text}</span>
                    </Col>
                </Row>
                <Row className=" row ">
                    <Col className="operator" span={24}>
                        <i className="iconfont icon-detail" title="详情" onClick={this.openDetail} />
                        <i className="iconfont icon-edit" title="修改"/>
                        <i className="iconfont icon-stop" title="终止"/>
                    </Col>
                </Row>
                {
                    detail.show ?
                        <CreateLayer
                            className="flowcontol-layer"

                        >
                            <NoticeDetailContainer
                                titleName="通告信息详情"
                                type="detail"
                                id = {id}
                                x = { 550 }
                                y = { 200 }
                                clickCloseBtn={ this.onCloseBtn }
                            />
                        </CreateLayer> : ''
                }
            </Col>
        )
    }
};

export default NoticeItem;