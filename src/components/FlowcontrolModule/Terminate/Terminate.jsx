//终止流控页面
import React from 'react';
import {Row, Col, Icon, Button, Card, Form, Input, Radio, Modal, Spin} from 'antd';
import DraggableModule from "components/DraggableModule/DraggableModule";
import {terminateFlowcontrolUrl} from 'utils/request-urls';
import {request, requestGet} from 'utils/request-actions';
import {isValidVariable, isValidObject} from "utils/basic-verify";
import {AuthorizationUtil} from "utils/authorization-util";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;


class Terminate extends React.Component {
    constructor(props) {
        super(props);

        this.validateWinTimeValue = this.validateWinTimeValue.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.confirmSubmit = this.confirmSubmit.bind(this);
        this.handleConvertFormData = this.handleConvertFormData.bind(this);
        this.handleSubmitCallback = this.handleSubmitCallback.bind(this)
    }

    //时间窗数值--校验规则
    validateWinTimeValue = (rule, value, callback) => {
        // 获取选中的变更策略值
        const strategy = this.props.form.getFieldValue("strategy");
        // 若选中的变更策略不为'PART',则校验通过
        if (strategy !== 'PART') {
            callback();
        } else if (!isValidVariable(value)) {
            callback('请输入整数');
        }
        const regexp = /^[0-9]\d*$/;
        const valid = regexp.test(value);
        if (!valid) {
            callback('请输入正整数')
        } else {
            callback();
        }
    };


    // 处理表单提交
    handleSubmit(e) {
        e.preventDefault();
        // 全部校验表单组件
        const _form = this.props.form;
        _form.validateFieldsAndScroll({
            force: true,
        }, (err, values) => {
            //校验通过
            if (!err) {
                // // 确认提交
                this.confirmSubmit()
            }
        });
    }

    // 确认提交
    confirmSubmit() {
        const handleConvertFormData = this.handleConvertFormData;
        Modal.confirm({
            // iconType : 'exclamation-circle',
            title: '提示',
            content: `确定终止本条流控`,
            cancelText: '取消',
            okText: `确认终止`,
            onOk(){
                handleConvertFormData(true)
            },
        });
    }

    /**
     * 转换表单字段数据并提交
     * optional : 是否可选变更策略
     *
     * */
    handleConvertFormData(optional) {
        const {loginUserInfo, id} = this.props;
        // 参数
        let params = {};
        if (optional) {
            // 获取全部组件的值
            const data = this.props.form.getFieldsValue();

            // 拷贝组件数据
            let flow = JSON.parse(JSON.stringify(data));
            // 参数拼接
            params = {
                // 流控id
                id: id,
                // 用户id
                userId: loginUserInfo.userId,
                // 用户名
                userName: loginUserInfo.username,
                // 用户中文名
                userNameZh: loginUserInfo.description,
                // 压缩时间
                winTime: flow.winTime || '',
                // 压缩策略
                strategy: flow.strategy || ''
            };
        } else {
            params = {
                // 流控id
                id: id,
                // 用户id
                userId: loginUserInfo.userId,
                // 用户名
                userName: loginUserInfo.username,
                // 用户中文名
                userNameZh: loginUserInfo.description,
                // 压缩时间
                winTime: '',
                // 压缩策略
                strategy: 'ALL'
            };
        }

        // 开启加载
        this.setState({
            loading: true
        });
        // 提交数据
        request(terminateFlowcontrolUrl, 'POST', JSON.stringify(params), this.handleSubmitCallback);
    }

    // 表单提交回调函数
    handleSubmitCallback(res) {
        const {status, flowcontrol} = res;
        // 组件关闭方法和名称
        const {clickCloseBtn, dialogName} = this.props;
        // 关闭加载
        this.setState({
            loading: false
        });
        if (status == 200) {
            Modal.success({
                title: `流控终止成功`,
                content: `流控终止成功`,
                okText: '确认',
                onOk(){
                    clickCloseBtn(dialogName);
                },
            });
        } else if (status != 200 && res.error) {
            Modal.error({
                title: `流控$终止失败`,
                content: res.error.message,
                okText: '确认',
                onOk(){
                    clickCloseBtn(dialogName);
                },
            });
        }
    }

    // 组件挂载完成回调
    componentDidMount(){
        const {loginUserInfo, clickCloseBtn, dialogName} = this.props;
        // 用户权限
        const {allAuthority} = loginUserInfo;
        if(!AuthorizationUtil.hasAuthorized(allAuthority, 437111) ){
            const handleConvertFormData = this.handleConvertFormData;
            Modal.confirm({
                // iconType : 'exclamation-circle',
                title: '提示',
                content: `确定终止本条流控`,
                cancelText: '取消',
                okText: `确认终止`,
                onOk(){
                    handleConvertFormData(false)
                },
                onCancel() {
                    clickCloseBtn(dialogName);
                }
            });
        }
    }

    render() {

        const ContentLayout = {
            xs: 24,
            md: 24,
            lg: 20,
            xl: 21,
            xxl: 22,
            className: 'row-title'
        };
        const Layout24 = {span: 24};
        const Layout12 = {span: 12};
        const Layout6 = {span: 6};
        const Layout4 = {span: 4};
        const {getFieldDecorator} = this.props.form;
        const strategy = this.props.form.getFieldValue("strategy");

        // 校验规则
        const rulesGenerate = {
            // 预锁航班时隙变更策略
            strategy: getFieldDecorator("strategy", {
                initialValue: "ALL",
                rules: [
                    // {
                    //     validator : this.validateFlowcontrolAssignSlot
                    // }
                ]
            }),
            // 时间窗
            winTime: getFieldDecorator("winTime", {
                rules: [
                    {
                        validator: this.validateWinTimeValue
                    } // 正整数
                ]
            }),
        };
        const {titleName, clickCloseBtn, dialogName, loginUserInfo, width = 800, x, y} = this.props;
        // 用户权限
        const {allAuthority} = loginUserInfo;

        return (
            <div>
                {
                    AuthorizationUtil.hasAuthorized(allAuthority, 437111) ?
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
                                            onClick={ (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                clickCloseBtn(dialogName);
                                            } }
                                        >
                                            <Icon type="close" title="关闭"/>
                                        </div>
                                    </Row>
                                    {/* 表单内容*/}
                                    <Form className="ap-flowcontrol-form" layout="vertical"
                                          onSubmit={this.handleSubmit}>
                                        <Row className="content ap-flowcontrol-dialog">
                                            <Col {...Layout24}>
                                                <Col {...Layout24} >
                                                    <div className="row-title">
                                                        预锁航班时隙变更策略
                                                    </div>
                                                </Col>
                                                <Col {...ContentLayout} >
                                                    <Row>

                                                        <Col {...Layout12}>
                                                            <div className="label">
                                                                <FormItem>
                                                                    {
                                                                        rulesGenerate.strategy(
                                                                            <RadioGroup
                                                                            >
                                                                                <Radio value='ALL'>自动压缩</Radio>
                                                                                <Radio value='PART'>公司申请变更</Radio>
                                                                                <Radio value='NONE'>不自动压缩</Radio>
                                                                            </RadioGroup>
                                                                        )
                                                                    }
                                                                </FormItem>
                                                            </div>
                                                        </Col>
                                                        <Col {...Layout4} >
                                                            <div className="label">
                                                                {strategy == 'PART' ? '时间窗' : ''}
                                                            </div>
                                                        </Col>
                                                        <Col {...Layout6}>
                                                            {strategy == 'PART' ?
                                                                <FormItem>
                                                                    {
                                                                        rulesGenerate.winTime(
                                                                            <Input placeholder="时间窗"
                                                                                   className="limit-value"/>
                                                                        )
                                                                    }
                                                                    <span className="unit label">分钟</span>
                                                                </FormItem>
                                                                : ''}
                                                        </Col>
                                                    </Row>

                                                </Col>
                                            </Col>
                                        </Row>


                                        <Row className="footer">
                                            <Col className="" {...Layout24} >
                                                <Button className='c-btn c-btn-default'
                                                        onClick={ () => {
                                                            clickCloseBtn(dialogName);
                                                        } }
                                                >
                                                    关闭
                                                </Button>
                                                <Button className='c-btn c-btn-blue'
                                                        type="primary"
                                                        htmlType="submit"
                                                >
                                                    提交
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </div>
                        </DraggableModule> : ''
                }
            </div>

        )
    }
}
;

export default Form.create()(Terminate) ;