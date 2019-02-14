//流控信息---菜单操作功能

import React from 'react';
import { Row, Col, Icon,Modal } from 'antd';
import CreateLayer from "components/CreateLayer/CreateLayer";
import NoticeDetailContainer from "components/NoticeModule/Detail/NoticeDetailContainer";
import NoticePublisContainer from "components/NoticeModule/Publish/NoticePublisContainer";
import { terminateNoticeUrl } from 'utils/request-urls';
import qs from 'qs'
import {  request } from 'utils/request-actions';
const confirm = Modal.confirm;
import './NoticeItem.less';
import {isValidObject} from "utils/basic-verify";

class NoticeItem extends React.Component{
    constructor( props ){
        super(props);
        this.convertNoticeData = this.convertNoticeData.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.openUpdate = this.openUpdate.bind(this);
        this.onCloseBtn = this.onCloseBtn.bind(this);
        this.terminalNotice = this.terminalNotice.bind(this);
        this.state = {
            detail: {
                show: false,
            },
            noticeUpdate:{
                show:false,
            }

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
        result.lastModifyTime = formatDateTime(data.generateTime);
        result.lastModifyDate = formatDate(data.generateTime);
        return result;
    }

    terminalNotice() {
        const{updateNoticeDatas,userId,data} = this.props;
        let param = {
            'userId':userId,
            'id':data.id
        };
        
        const headers = 'application/x-www-form-urlencoded;charset=UTF-8';
        confirm({
            title: '提示',
            content: '是否终止当前所选通告?',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                request(terminateNoticeUrl,"POST",qs.stringify(param),function (data) {
                    if(isValidObject(data)&&isValidObject(data.result)){
                        // 更新新的数据
                        updateNoticeDatas(data.result)
                    }
                },function () {

                },headers)
            },
            onCancel() {

            },
        });
    }

    // 打开详情
    openDetail(){
        this.setState({
            detail: {
                show: true
            }
        });
    }
    //打开修改
    openUpdate(){
        this.setState({
            noticeUpdate: {
                show:true
            }
        })
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
        const { data, generateTime, indexNumber,userId } = this.props;
        const formatData =  this.convertNoticeData(data,generateTime);
        const { id, title, text, publishUserZh, lastModifyTime, lastModifyDate,type,publishUser} = formatData;
        const {detail,noticeUpdate} = this.state;
        return (
            <Col span={24} className="notice-item">
                <Row className="title row">
                    <Col  span={8} className="title" title={title ? `${title}`: ''} >
                        <span>{title}</span>
                    </Col>

                    <Col  span={8} className="publish-user" title={publishUserZh ? `${publishUserZh}`: ''} >
                        <span>{publishUserZh}</span>
                    </Col>
                    <Col  span={6} className="last-modify-time" title={lastModifyDate ? `${lastModifyDate}`: ''} >
                        <i className="iconfont icon-time" title="修改时间" />
                        <span>{lastModifyTime}</span>
                    </Col>
                </Row>
                <Row className="row">
                    <Col  span={10} className="text" title={type =='0' ? '普通通告': '重要通告'} >
                        <span>{type =='0' ? '普通通告': '重要通告'}</span>
                    </Col>
                    <Col  span={14} className="text" title={text ? `${text}`: ''} >
                        <span>{text}</span>
                    </Col>
                </Row>
                <Row className=" row ">
                    <Col className="operator" span={24}>
                        <i className="iconfont icon-detail" title="详情" onClick={this.openDetail} />
                        {
                            userId == publishUser ?<i className="iconfont icon-edit" title="修改" onClick={this.openUpdate}/>:''
                        }
                        {
                            userId == publishUser ?<i className="iconfont icon-stop" title="终止" onClick={this.terminalNotice}/>:''
                        }
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
                {
                    noticeUpdate.show ?
                        <CreateLayer
                            className="flowcontol-layer"

                        >
                            <NoticePublisContainer
                                titleName="修改通告信息"
                                type="noticeUpdate"
                                id = {id}
                                dialogName="noticeUpdate"
                                clickCloseBtn={ this.onCloseBtn }
                                x={ 300 }
                                y={ 60 }/>
                        </CreateLayer> : ''
                }
            </Col>
        )
    }
};

export default NoticeItem;