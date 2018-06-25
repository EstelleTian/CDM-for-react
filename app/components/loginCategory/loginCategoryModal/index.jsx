import React from 'react'
import axios from 'axios'
import $ from 'jquery'
import {Modal, Button, Form, Input, Tabs, Row } from 'antd'
import { updateLoginCategoryUrl } from '../../../utils/requestUrls'
import LoginVersionListContainer from '../../../container/loginVersionListContainer'
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

//添加、修改控制类型表单
class ModalForm extends React.Component {
    constructor(props){
        super(props)
        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    //提交页面
    handleSubmit(e) {
        e.preventDefault();
        const { form, loginCategoryModal, updateLoginCategory, closeLoginCategoryModal} = this.props;
        form.validateFieldsAndScroll((err, values) => {
            //success
            if (!err) {
                //将原数据和修改数据合并
                let orgData = loginCategoryModal.data;
                let newData = {
                    ...orgData,
                    ...values
                };
                let ajaxType = "put";
                const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
                axios.request({
                    url: updateLoginCategoryUrl,
                    method: ajaxType,
                    data: JSON.stringify(newData),
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
                        if( json.hasOwnProperty("loginCategory") && json.loginCategory.id){
                            // 更新数据
                            updateLoginCategory({...json.loginCategory});
                            form.resetFields();
                            //关闭modal
                            closeLoginCategoryModal();
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

    //
    closeModal() {
        const { closeLoginCategoryModal } = this.props;
        this.handleReset();
        closeLoginCategoryModal()

    }
    render(){
        const {  loginCategoryModal, closeLoginCategoryModal } = this.props;
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
            categoryCode : getFieldDecorator('categoryCode', {
                initialValue: loginCategoryModal.data.categoryCode || "",
                rules : [{
                    required: true,
                    validator : (rule, value, callback) => {
                        if(value.trim() == ""){
                            callback("必填项")
                        }else{
                            const reg = /^[a-zA-Z0-9_]*$/;
                            let flag = reg.test(value);
                            //true正确
                            if(flag){
                                callback()
                            }else if(value.length > 64){
                                callback("最长为64位")
                            }else{
                                callback("只允许数字、字母、下划线")
                            }
                        }
                    }
                }
                ]
            }),
            categoryDescription : getFieldDecorator('categoryDescription', {
                initialValue: loginCategoryModal.data.categoryDescription || "",
                rules : [{
                    required: true,
                    validator : (rule, value, callback) => {
                        if(value.trim() == ""){
                            callback("必填项")
                        }else{
                            const reg = /^[\u4e00-\u9fa5]*$/;
                            let flag = reg.test(value);
                            //true正确
                            if(flag){
                                callback()
                            }else if(value.length > 64){
                                callback("最长为64位")
                            }else{
                                callback("只允许输入中文")
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
                    label="类型码"
                    hasFeedback={true}
                >
                    {rulesGenerate.categoryCode(<Input className="form_input"  placeholder="请输入数字组合版本号，中间用.分隔"/>)}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="类型描述"
                    hasFeedback={true}
                >
                    {rulesGenerate.categoryDescription(<Input className="form_input"  placeholder="请输入中文"/>)}
                </FormItem>


                <FormItem
                    wrapperCol={{ span: 7, offset: 17 }}
                    hasFeedback={true}
                    className="form_footer"
                >
                    <Button type="primary" htmlType="submit" className="login_button">
                        确定
                    </Button>
                    <Button onClick={this.handleReset}>
                        重置
                    </Button>
                    <Button onClick={this.closeModal}>
                        取消
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

ModalForm = Form.create()(ModalForm);

//添加、修改控制类型模态框
class loginCategoryModal extends React.Component{
    render(){
        const { loginCategoryModal, closeLoginCategoryModal } = this.props;
        let title = '';
        const optType = loginCategoryModal.optType;
        let width = 850;
        switch(optType){
            case 'update' : {
                title = '修改登录控制类型';
                break;
            }
            case 'showVersion' : {
                title = '查看登录控制版本';
                width = '50%';
                break;
            }
            default:
                title = '';
                width = 850;
        }
        return (
            <div>
                <Modal
                    title={title}
                    maskClosable={false}
                    visible={loginCategoryModal.visible}
                    onCancel={closeLoginCategoryModal}
                    width={width}
                    footer={null}
                >
                    {
                        optType == 'update' ? <ModalForm  {...this.props} /> :''
                    }
                    {
                        optType == 'showVersion' ? <LoginVersionListContainer  {...this.props} /> :''
                    }
                </Modal>
            </div>
        )
    }
}

export default loginCategoryModal;