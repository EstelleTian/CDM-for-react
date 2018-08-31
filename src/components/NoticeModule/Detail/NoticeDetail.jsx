//通告信息详情
import React from 'react';
import {Row, Col, Icon,} from 'antd';
import DraggableModule from "components/DraggableModule/DraggableModule";
import {getNoticeDetailUrl} from 'utils/request-urls';
import {formatTimeString, getDayTimeFromString} from "utils/basic-verify";
import {requestGet} from 'utils/request-actions';
import './NoticeDetail.less';

class NoticeDetail extends React.Component {
    constructor(props) {
        super(props);
        this.getNoticeDetail = this.getNoticeDetail.bind(this);
        this.handleNoticeDetailData = this.handleNoticeDetailData.bind(this);
        this.converDate = this.converDate.bind(this);
        this.state = {}
    }

    // 获取通告详情数据
    getNoticeDetail() {
        const { id, loginUserInfo } = this.props;
        const {userId} = loginUserInfo;
        // 参数
        let params = {
            id,
            userId
        };
        // 发送请求并指定回调方法
        requestGet(getNoticeDetailUrl,  params, this.handleNoticeDetailData);
    }

    // 处理通告详情数据
    handleNoticeDetailData(res) {
        const { id } = this.props;
        // 取响应结果中的通告数据
        if (res && res.status == 200) {
            const { result = {} } = res;
            const data = result[id];
            // 转换格式
            this.converDate(data);
        }
    }
    converDate (data) {
        let id = data.id;
        // 标题
        let title = data.title || '';
        // 内容
        let text = data.text || '';
        // 发布者
        let publishUser = data.publishUser || '';
        // 发布时间
        let lastModifyTime = formatTimeString(data.lastModifyTime) || '';

        this.setState({
            id,
            title,
            text,
            publishUser,
            lastModifyTime
        })
    }

    componentDidMount() {
        // 获取通告详情数据
        this.getNoticeDetail()
    }

    render() {
        const {titleName, clickCloseBtn, width = 420, dialogName, x = 300, y} = this.props;
        const {id, title, text, publishUser, lastModifyTime} = this.state;
        const Layout24 = {span: 24};

        return (
            <DraggableModule
                bounds=".root"
                x={x}
                y={y}
            >
                <div className="box center no-cursor" style={{width: width}}>
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
                        {/* 表单内容*/}
                        <Row className="content notice-detail">
                            <Col {...Layout24}>
                                <Row>
                                    <Col {...Layout24} >
                                        <h1 className="title">{ title }</h1>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="text">
                                        <p>{ text }</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="footer">
                                        <p>{ publishUser }</p>
                                        <p>{ lastModifyTime }</p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>
            </DraggableModule>
        )
    }
}
;

export default NoticeDetail ;