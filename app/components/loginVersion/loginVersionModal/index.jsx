import React from 'react'
import axios from 'axios'
import $ from 'jquery'
import {Modal, Button, Form, Input, Tabs, Row } from 'antd'
import { updateLoginVersionUrl } from '../../../utils/requestUrls'
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

//添加、修改控制类型表单
class ModalForm extends React.Component {
    constructor(props){
        super(props)
        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //提交页面
    handleSubmit(e) {
        e.preventDefault();
        const { form, loginVersionModal, updateLoginVersion, closeLoginVersionModal} = this.props;
        form.validateFieldsAndScroll((err, values) => {
            //success
            if (!err) {
                const loginVersionData = loginVersionModal.loginData;

                let params = {
                    loginTypeId: loginVersionData.id,
                    updateTime: loginVersionData.updateTime,
                    createTime: loginVersionData.createTime,
                    publishUser: loginVersionData.publishUser,
                    publishUserZH: loginVersionData.publishUserZH,
                    ...values
                };

                //根据id验证是添加（无id）还是修改（有id）
                const oid = loginVersionModal.data.id || "";
                let ajaxType = "POST";
                //不为空 为修改
                if( "" != oid){
                    //拼接id到params中
                    params["id"] = oid;
                    ajaxType = "put";
                }
                const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
                axios.request({
                    url: updateLoginVersionUrl,
                    method: ajaxType,
                    data: JSON.stringify(params),
                    headers: {
                        Authorization: UUMAToken,
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    withCredentials: true
                }).then( response => {
                    const json = response.data;
                    const status = json.status*1;
                    //成功
                    if( 200 == status ){
                        if( json.hasOwnProperty("loginVersion") && json.loginVersion.id){
                            // 更新数据
                            updateLoginVersion(json.loginVersion);
                            form.resetFields();
                            //关闭modal
                            closeLoginVersionModal();
                        }else{
                            console.warn("Can't receive group key.")
                        }
                    }else if( (200 != status) && json.hasOwnProperty("error")  ){
                        const error = json.error.message ? json.error.message : "";
                        Modal.error({
                            title: "失败",
                            content: error,
                            okText: "确定"
                        })
                    }else{
                        console.warn("Request return unkown datas.")
                    }
                }).catch(err => {
                    console.error(err);
                })


            }else{
                console.error(err);
            }
        });
    }

    //重置页面
    handleReset() {
        const { form } = this.props;
        //重置表单
        form.resetFields();

    }
    render(){
        const {  loginVersionModal, closeLoginVersionModal } = this.props;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const rulesGenerate = {
            clientVersion : getFieldDecorator('clientVersion', {
                initialValue: loginVersionModal.data.clientVersion || "",
                rules : [{
                    required: true,
                    validator : (rule, value, callback) => {
                        if(value.trim() == ""){
                            callback("必填项")
                        }else{
                            const reg = /^[0-9]+\.[0-9]+\.[0-9]+$/;
                            let flag = reg.test(value);
                            //true正确
                            if(flag){
                                callback()
                            }else if(value.length > 64){
                                callback("最长为64位")
                            }else{
                                callback("只允许数字和小数点,格式如:1.2.3")
                            }
                        }
                    }
                }
                ]
            })
        }
        return(
            <Form onSubmit={this.handleSubmit} >
                <FormItem
                    {...formItemLayout}
                    label="客户端版本号"
                    hasFeedback={true}
                >
                    {rulesGenerate.clientVersion(<Input className="form_input"  placeholder="请输入数字和小数点,如:1.2.3"/>)}
                </FormItem>


                <FormItem
                    wrapperCol={{ span: 10, offset: 14 }}
                    hasFeedback={true}
                    className="form_footer"
                >
                    <Button type="primary" htmlType="submit" className="login_button">
                        确定
                    </Button>
                    <Button onClick={this.handleReset}>
                        重置
                    </Button>
                    <Button onClick={closeLoginVersionModal}>
                        取消
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

ModalForm = Form.create()(ModalForm);

//添加、修改版本模态框
class loginVersionModal extends React.Component{
    render(){
        const { loginVersionModal, closeLoginVersionModal } = this.props;
        const title = loginVersionModal.isAdd ? "添加" : "修改";
        return (
            <div>
                <Modal
                    title={`${title}登录控制版本`}
                    maskClosable={false}
                    visible={loginVersionModal.visible}
                    onCancel={closeLoginVersionModal}
                    width="600"
                    footer={null}
                >
                    <ModalForm
                        {...this.props}
                    />
                </Modal>
            </div>
        )
    }
}

export default loginVersionModal;