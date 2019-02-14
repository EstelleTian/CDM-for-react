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
        this.state = {
            id:'',
            title:'',
            text:'',
            readUsers:[],
            unReadUsers:[],
            publishUser:'',
            publishUserId:'',
            noticeType:'',
            lastModifyTime:''
        }
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
            // 转换格式
            this.converDate(result);
        }
    }
    converDate (data) {
        const {information,readUsers = [],unReadUsers = []} = data
        let id = information.id;
        // 标题
        let title = information.title || '';
        // 内容
        let text = information.text || '';
        // 发布者
        let publishUser = information.publishUserZh || '';
        //发布者id
        let publishUserId = information.publishUser || '';
        //通告类型
        let noticeType = information.type;
        // 发布时间
        let lastModifyTime = formatTimeString(information.generateTime) || '';
        this.setState({
            id,
            title,
            text,
            readUsers,
            unReadUsers,
            publishUser,
            publishUserId,
            noticeType,
            lastModifyTime
        })
    }

    componentDidMount() {
        // 获取通告详情数据
        this.getNoticeDetail()
    }

    render() {
        const {loginUserInfo,titleName, clickCloseBtn, width = 820, dialogName, x = 300, y} = this.props;
        const {id, title, text,readUsers,unReadUsers, publishUser,publishUserId,noticeType, lastModifyTime} = this.state;
        const Layout24 = {span: 24};
        const { userId } = loginUserInfo;
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
                                    <Col {...Layout24} className="type">
                                        <label className='user-label'>通告类型：</label>
                                        <span>{ noticeType == '1'?'重要通告':'普通通告' }</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="text">
                                        <p className='user-label'>通告内容：</p>
                                        <p className='notice-content'>{ text }</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="userList">
                                        {
                                            userId == publishUserId?<label className='user-label'>已读用户：</label>:''
                                        }
                                        {

                                            userId == publishUserId?readUsers.map((value,index)=>{
                                                return(
                                                    <span key={value.id}>{`${value.description}（${value.username}）`}</span>
                                                )
                                            }):''
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="userList">
                                        {
                                            userId == publishUserId?<label className='user-label'>未读用户：</label>:''
                                        }

                                        {
                                            userId == publishUserId?unReadUsers.map((value,index)=>{
                                                return(
                                                    <span key={value.id}>{`${value.description}（${value.username}）`}</span>
                                                )
                                            }):''
                                        }
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