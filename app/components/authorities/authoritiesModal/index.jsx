import React from 'react'
import axios from 'axios';
import $ from 'jquery'
import {Modal, Button, Form, Input} from 'antd'
import {updateAuthoritiesUrl} from '../../../utils/requestUrls'
const FormItem = Form.Item;

//添加、修改权限表单
class ModalForm extends React.Component {
    constructor(props){
        super(props);
        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //提交页面
    handleSubmit(e) {
        e.preventDefault();
        const { form, authoritiesModal, updateAuths, closeAuthModal } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            //success
            if (!err) {
                let params = values;
                const oid = authoritiesModal.data.id || "";
                let ajaxType = "post";
                //不为空 为修改
                if( "" != oid){
                    params["id"] = oid;
                    ajaxType = "put";
                }
                const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
                axios.request({
                    url: updateAuthoritiesUrl,
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
                        if( json.hasOwnProperty("authority") && json.authority.id){
                            // 更新数据
                            updateAuths({...json.authority});
                            //关闭modal
                            closeAuthModal();
                        }else{
                            console.warn("Can't receive authority key.")
                        }
                    }else if( 200 != status && json.hasOwnProperty("error")  ){
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

                // $.ajax({
                //     url: updateAuthoritiesUrl,
                //     data: JSON.stringify(params),
                //     type: ajaxType,
                //     contentType: 'application/json; charset=utf-8',
                //     beforeSend: (request) => {
                //         request.setRequestHeader("Authorization", UUMAToken);
                //     },
                //     success: function(json){
                //         const status = json.status*1;
                //         //成功
                //         if( 200 == status ){
                //             if( json.hasOwnProperty("authority") && json.authority.id){
                //                 // 更新数据
                //                 updateAuths({...json.authority});
                //                 //关闭modal
                //                 closeAuthModal();
                //             }else{
                //                 console.warn("Can't receive authority key.")
                //             }
                //         }else if( 200 != status && json.hasOwnProperty("error")  ){
                //             const error = json.error.message ? json.error.message : "";
                //             Modal.error({
                //                 title: "失败",
                //                 content: error,
                //                 okText: "确定"
                //             })
                //         }else{
                //             console.warn("Request return unkown datas.")
                //         }
                //     },
                //     error: function(err){
                //         console.error(err);
                //     }
                // })

            }else{
                console.error(err);
            }
        });
    }

    //重置页面
    handleReset() {
        const { form } = this.props;
        form.resetFields();
    }

    render(){
        const { authoritiesModal, closeAuthModal } = this.props;
        const { getFieldDecorator } = this.props.form;
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
            code : getFieldDecorator('code', {
                initialValue: authoritiesModal.data.code || "",
                rules : [{
                    required: true,
                    min: 8,
                    max: 8,
                    len: 8,
                    validator : (rule, value, callback) => {
                        value = value+"";
                        if(value.trim() == ""){
                            callback("必填项")
                        }else if(value.length != 8){
                            callback("请输入8位权限码")
                        }else{
                            const reg = /^\d*$/;
                            let flag = reg.test(value);
                            //true正确
                            if(flag){
                                callback()
                            }else{
                                callback("请输入纯数字")
                            }
                        }
                    }
                }]
            }),
            name: getFieldDecorator('name', {
                initialValue: authoritiesModal.data.name || "",
                rules : [{
                    required: true,
                    max: 64,
                    validator : (rule, value, callback) => {
                        if(value.trim() == ""){
                            callback("必填项")
                        }else{
                            const reg = /^[a-zA-Z0-9_]*$/;
                            let flag = reg.test(value);
                            //true正确
                            if(flag){
                                callback()
                            }else{
                                callback("只允许数字、字母、下划线")
                            }
                        }
                    }
                }]
            }),
            description : getFieldDecorator('description', {
                initialValue: authoritiesModal.data.description || "",
                rules : [{
                    required: true,
                    max: 64,
                    validator : (rule, value, callback) => {
                        if(value.trim() == ""){
                            callback("必填项")
                        }else if(value.length > 64){
                            callback("最长为64位")
                        }else{
                            callback()
                        }
                    }
                }]
            })
        }
        return(
            <Form onSubmit={this.handleSubmit} >
                <FormItem
                    {...formItemLayout}
                    label="权限码"
                    hasFeedback={true}
                >
                    {rulesGenerate.code(<Input prefix={""} placeholder="请输入8位数字" className="form_input"/>)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="权限名"
                    hasFeedback={true}
                >
                    {rulesGenerate.name(<Input prefix={""} className="form_input"  placeholder="请输入数字、字母、下划线组合"/>)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="描述"
                    hasFeedback={true}
                >
                    {rulesGenerate.description(<Input prefix={""} className="form_input"  placeholder="最长64位"/>)}
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 12, offset: 12 }}
                    hasFeedback={true}
                    className="form_footer"
                >
                    <Button type="primary" htmlType="submit" className="login_button">
                        确定
                    </Button>
                    <Button onClick={this.handleReset}>
                        重置
                    </Button>
                    <Button onClick={closeAuthModal}>
                    取消
                </Button>
                </FormItem>
            </Form>
        )
    }
}

ModalForm = Form.create()(ModalForm);

//添加、修改权限模态框
class authoritiesModal extends React.Component{
    render(){
        const { authoritiesModal, closeAuthModal, updateAuths } = this.props;
        const title = authoritiesModal.isAdd ? "添加" : "修改";
        return (
            <div>
                <Modal
                    title={`${title}权限`}
                    maskClosable={false}
                    visible={authoritiesModal.visible}
                    onCancel={closeAuthModal}
                    footer={null}
                >
                    <ModalForm
                        authoritiesModal={authoritiesModal}
                        closeAuthModal={closeAuthModal}
                        updateAuths={updateAuths}
                    />
                </Modal>
            </div>
        )
    }
}

export default authoritiesModal;