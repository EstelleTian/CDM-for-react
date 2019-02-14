import React from 'react';
import {Row, Col, Icon, Form, Radio, Input, Checkbox, Button, Modal} from 'antd';

const confirm = Modal.confirm;
import DraggableModule from "components/DraggableModule/DraggableModule";
import qs from 'qs'
import './Publish.less'

import {
    getUserBySystemUrl,
    publishNoticeUrl,
    updateNoticeUrl,
    getNoticeDetailUrl
} from "utils/request-urls"
import {requestGet, request} from "utils/request-actions"
import {isValidVariable, isValidObject} from "utils/basic-verify";

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const {TextArea} = Input;

class NoticePublish extends React.Component {
    constructor(props) {
        super(props)
        this.getReceiversBySystem = this.getReceiversBySystem.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCheckAllChange = this.onCheckAllChange.bind(this);
        this.getNoticeDetail = this.getNoticeDetail.bind(this);
        this.convertDetailData = this.convertDetailData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.successfulCallback = this.successfulCallback.bind(this);
        this.failedCallback = this.failedCallback.bind(this);
        this.state = {
            cdmRecevierList: [],
            cdmOriginalUser: [],
            indeterminate: false,
            checkAll: false,
            isLoading:false
        }
    }

    componentDidMount() {
        this.getReceiversBySystem()
    }

    //获取接收用户
    getReceiversBySystem() {
        let that = this;
        const {userId} = this.props.loginUserInfo;
        const {system} = this.props.systemConfig;
        const {type} = this.props;
        const param = {
            system: system,
            userId: userId
        }
        requestGet(getUserBySystemUrl, param, function (data) {
            if (isValidObject(data) && isValidObject(data.result)) {
                const {users} = data.result;
                //用户中文名称
                const cdmUserlist = [];
                // 用户列表源数据
                const cdmOriginalUser = [];
                for (let x in users) {
                    if (users[x].system == 'CDM') {
                        cdmUserlist.push(`${users[x].description}（${users[x].username}）`)
                        cdmOriginalUser.push(users[x])
                    }
                }

                that.setState({
                    cdmRecevierList: cdmUserlist,
                    cdmOriginalUser: cdmOriginalUser
                })
                if (type == 'noticeUpdate') {
                    that.getNoticeDetail()
                }
            }
        })

    }

    //获取通告详情信息
    getNoticeDetail() {
        const {id, loginUserInfo} = this.props;
        const {userId} = loginUserInfo;
        // 参数
        let params = {
            id,
            userId
        };
        // 发送请求并指定回调方法
        requestGet(getNoticeDetailUrl, params, this.convertDetailData);
    }

    // 通告详情数据转换
    convertDetailData = (data) => {
        if (isValidObject(data) && isValidObject(data.result)) {
            const {information, unReadUsers, readUsers} = data.result;
            const { cdmRecevierList } = this.state;
            const form = this.props.form;
            //接受用户列表
            let RecevierList = [...unReadUsers, ...readUsers];
            let selectedList = [];
            //接受用户中文
            RecevierList.map((user) => {
                selectedList.push(`${user.description}（${user.username}）`)
            })
            // 表单内容
            form.setFieldsValue({
                ['name']: information.title,
                ['typeGroup']: information.type,
                ['selected']: selectedList,
                ['contentText']: information.text,
            })
            //多选按钮
            this.setState({
                indeterminate: false,
                checkAll: cdmRecevierList.length === RecevierList.length,
            })
        }
    }
    // 多选事件
    onChange = (checkedList) => {
        const {cdmRecevierList} = this.state;
        this.setState({
            indeterminate: false,
            checkAll: checkedList.length === cdmRecevierList.length,
        });
    }
    // 全选事件
    onCheckAllChange = (e) => {
        const form = this.props.form;
        const {cdmRecevierList} = this.state;
        if (e.target.checked) {
            form.setFieldsValue({
                ['selected']: cdmRecevierList,
            })
        } else {
            form.setFieldsValue({
                ['selected']: []
            })
        }
        this.setState({
            checkAll: e.target.checked,
        });
    }

    //提交成功回调
    successfulCallback(type) {
        const {clickCloseBtn, dialogName} = this.props
        const that = this;
        confirm({
            title: '提示',
            content: `${type == 'publish' ? "发布" : "修改"}通告信息成功`,
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                clickCloseBtn(dialogName);
                // 加载状态
                that.setState({
                    isLoading:false
                })
            },
            onCancel() {
                clickCloseBtn(dialogName);
                // 加载状态
                that.setState({
                    isLoading:false
                })
            },
        });
    }
    // 提交失败回调
    failedCallback(type) {
        confirm({
            title: '提示',
            content: `${type == 'publish' ? "发布" : "修改"}通告信息失败`,
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                // 加载状态
                that.setState({
                    isLoading:false
                })
            },
            onCancel() {
                // 加载状态
                that.setState({
                    isLoading:false
                })
            },
        });
    }

    //提交表单
    handleSubmit = (e) => {
        e.preventDefault();
        const that = this;
        // 全部校验表单组件
        const form = that.props.form;
        form.validateFields({
            force: true,
        }, (err, values) => {
            //校验通过
            if (!err) {
                // 加载状态
                this.setState({
                    isLoading:true
                })
                const {cdmOriginalUser} = that.state;
                const {userId} = this.props.loginUserInfo;
                const {type, updateNoticeDatas, deleteNoticeDatas, id} = this.props;
                const {selected, contentText, name, typeGroup} = values;
                //用户列表转换
                let userIdList = [];
                cdmOriginalUser.map((user) => {
                    const userZh = `${user.description}（${user.username}）`
                    for (let i = 0; i < selected.length; i++) {
                        if (selected[i] === userZh) {
                            userIdList.push(user.id)
                        }
                    }

                })
                //请求头
                const headers = 'application/x-www-form-urlencoded;charset=UTF-8';
                if (type == 'NoticePublish') {
                    //发布参数
                    const publishParam = {
                        'userId': userId,
                        'type': typeGroup,
                        'title': name,
                        'text': contentText,
                        'receiverIds[]': userIdList.toString()
                    }
                    const publishParamReq = qs.stringify(publishParam);
                    request(publishNoticeUrl, 'POST', publishParamReq, function (res) {
                        //更新全局数据
                        if (isValidObject(res.result)&&res.status == 200) {
                            const noticeObjs = res.result;
                            updateNoticeDatas(noticeObjs)
                            that.successfulCallback('publisd');
                        }else{
                            that.failedCallback('publisd')
                            // 加载状态
                            this.setState({
                                isLoading:false
                            })
                        }
                    }, function () {
                        that.failedCallback('publisd')
                        // 加载状态
                        that.setState({
                            isLoading:false
                        })
                    }, headers)
                } else if (type == 'noticeUpdate') {
                    const updateParam = {
                        'userId': userId,
                        'id': id,
                        'type': typeGroup,
                        'title': name,
                        'text': contentText,
                        'receiverIds[]': userIdList.toString()
                    }
                    const updateParamReq = qs.stringify(updateParam)
                    request(updateNoticeUrl, 'POST', updateParamReq, function (res) {
                        //更新全局数据
                        if (isValidObject(res.result) && isValidObject(res.result.newInformation)&&res.status ==200) {
                            const noticeObj = res.result.newInformation;
                            const oldNoticeId = res.oldNoticeId
                            let noticeObjs = {};
                            noticeObjs[noticeObj.id] = noticeObj;
                            //删除旧的数据
                            deleteNoticeDatas(oldNoticeId)
                            //更新新数据
                            updateNoticeDatas(noticeObjs)
                            that.successfulCallback('update')
                        }else{
                            that.failedCallback('publisd')
                            // 加载状态
                            that.setState({
                                isLoading:false
                            })
                        }

                    }, function () {
                        that.failedCallback('update')
                        // 加载状态
                        this.setState({
                            isLoading:false
                        })
                    }, headers)
                }

            }
        });
    }

    render() {
        const {titleName, clickCloseBtn, width = 820, dialogName, x = 300, y} = this.props;
        const {cdmRecevierList, indeterminate, checkAll,isLoading} = this.state;
        const {getFieldDecorator} = this.props.form;
        // 校验规则
        const rulesGenerate = {
            // 流控名称
            name: getFieldDecorator("name", {
                initialValue: '',
                rules: [
                    {
                        required: true,
                        message: "通告名称为空或通告长度过长",
                        max: 100
                    }
                ]
            }),
            typeGroup: getFieldDecorator("typeGroup", {
                initialValue: "",
                rules: [
                    {
                        required: true,
                        message: "请选择通告类型"
                    }
                ]
            }),
            selected: getFieldDecorator("selected", {
                initialValue: [],
                rules: [
                    {
                        required: true,
                        message: "请至少选择一个接收用户"
                    }
                ]
            }),
            contentText: getFieldDecorator("contentText", {
                initialValue: '',
                rules: [
                    {
                        required: true,
                        message: "请输入少于2000字的通告内容",
                        max: 2000
                    }
                ]
            })
        }
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
                            <span>{titleName}</span>
                            <div
                                className="close-target"
                                onClick={() => {
                                    clickCloseBtn(dialogName);
                                }}
                            >
                                <Icon type="close" title="关闭"/>
                            </div>
                        </Row>
                        {/* 表单内容*/}
                        <Form onSubmit={this.handleSubmit}>
                            <Row className="content notice-detail">
                                <Row className="title">
                                    <Col span={3}>
                                        <div className="row-title">
                                            <i className="iconfont icon-star-sm"></i>
                                            基本信息
                                        </div>
                                    </Col>
                                    <Col span={10}>
                                        <FormItem>
                                            {
                                                rulesGenerate.name(
                                                    <Input
                                                        placeholder="请输入通告名称"
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row className="notice-type">
                                    <Col span={3}>
                                        <div className="row-title">
                                            <i className="iconfont icon-star-sm"></i>
                                            通告类型
                                        </div>
                                    </Col>
                                    <Col span={10}>
                                        <FormItem>
                                            {
                                                rulesGenerate.typeGroup(
                                                    <RadioGroup
                                                    >
                                                        <Radio value='0'>普通通告</Radio>
                                                        <Radio value='1'>重要通告</Radio>
                                                    </RadioGroup>
                                                )
                                            }
                                        </FormItem>
                                    </Col>

                                </Row>
                                <Row className='receiveUsers'>
                                    <Col span={3}>
                                        <div className="row-title">
                                            <i className="iconfont icon-star-sm"></i>
                                            接收用户
                                        </div>
                                    </Col>
                                    <Col span={21}>
                                        <FormItem>
                                            <span>批量操作：</span>
                                            <Checkbox
                                                indeterminate={indeterminate}
                                                onChange={this.onCheckAllChange}
                                                checked={checkAll}
                                            >全选</Checkbox>
                                        </FormItem>
                                        <FormItem>
                                            <span>CDM用户：</span>
                                            {
                                                rulesGenerate.selected(
                                                    <CheckboxGroup
                                                        options={cdmRecevierList}
                                                        onChange={this.onChange}
                                                    />
                                                )
                                            }

                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row className='publishContent'>
                                    <Col span={3}>
                                        <div className="row-title">
                                            通告内容
                                        </div>
                                    </Col>
                                    <Col span={21}>
                                        {
                                            rulesGenerate.contentText(
                                                <TextArea
                                                    rows={15}
                                                    placeholder="请输入通告内容"
                                                />
                                            )
                                        }
                                    </Col>
                                </Row>
                            </Row>
                            {/* 底部*/}
                            <Row className="footer">
                                <Col span={24}>
                                    <Button className='c-btn c-btn-default'
                                            onClick={() => {
                                                clickCloseBtn(dialogName);
                                            }}
                                    >
                                        关闭
                                    </Button>
                                    <Button className='c-btn c-btn-blue'
                                            type="primary"
                                            htmlType="submit"
                                            loading={isLoading}
                                    >
                                        提交
                                    </Button>
                                </Col>
                            </Row>

                        </Form>
                    </div>
                </div>
            </DraggableModule>
        );
    }
}

const NoticePublishPage = Form.create()(NoticePublish)
export default NoticePublishPage