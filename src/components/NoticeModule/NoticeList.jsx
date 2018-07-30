//通告信息---菜单操作功能

import React from 'react';
import { Row, Col } from 'antd';
import { getNoticeUrl } from 'utils/request-urls';
import {  requestGet } from 'utils/request-actions';
import NoticeItem from "./NoticeItem";

class NoticeList extends React.Component{
    constructor( props ){
        super(props);
        this.getNoticeDatas = this.getNoticeDatas.bind(this);
        this.handleUpdateNoticeData = this.handleUpdateNoticeData.bind(this);
        this.state = {
            noticeTimerId : 0
        };
    }


    getNoticeDatas(){
        // 用户id
        const { userId } = this.props;
        // 获取参数
        let params = {
            'userId' : userId
        };
        requestGet(getNoticeUrl,params,this.handleUpdateNoticeData)
    }

    handleUpdateNoticeData(res) {
        const {updateNoticeDatas, updateNoticeGenerateTime} = this.props;
        // 通告信息数据生成时间
        const {generateTime = ''} = res;
        // 更新流控数据生成时间
        updateNoticeGenerateTime(generateTime);
        // 取流控数据
        const {result = {}} = res;
        // 更新流控数据
        updateNoticeDatas(result);
        // 定时30秒后再次获取流控数据并更新
        const noticeTimerId = setTimeout(() => {
            // 获取通告信息数据
            this.getNoticeDatas();
        }, 30*1000);
        this.setState({
            noticeTimerId
        });
    }


    // 立即调用
    componentDidMount(){
        // 获取流控数据
        this.getNoticeDatas()
    }

    componentWillUnmount(){
        //清除定时器
        const { noticeTimerId = 0} = this.state;
        clearTimeout( noticeTimerId );
    }

    render(){
        const { noticeViewMap, noticeGenerateTime } = this.props;
        return (
            <Col span={24} className="notice-list">
                <Row className="notice-item-wrapper">
                    {
                        noticeViewMap.map((item,index) =>{
                            return (
                                <NoticeItem
                                    key={item.id}
                                    data = {item}
                                    indexNumber = { (index +1) }
                                    generateTime = { noticeGenerateTime }
                                />
                            )
                        })
                    }

                </Row>

            </Col>
        )
    }
};

export default NoticeList;