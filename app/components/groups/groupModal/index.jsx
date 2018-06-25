import React from 'react'
import axios from 'axios';
import $ from 'jquery'
import {Modal, Button, Form, Input} from 'antd'
import {updateGroupstUrl} from '../../../utils/requestUrls'
const FormItem = Form.Item;

//添加、修改角色表单
class ModalForm extends React.Component {
    constructor(props){
        super(props);
        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //提交页面
    handleSubmit(e) {
        e.preventDefault();
        const { form, groupModal, updateGroups, closeGroupModal } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            //success
            if (!err) {
                let params = values;
                const oid = groupModal.data.id || "";
                let ajaxType = "post";
                //不为空 为修改
                if( "" != oid){
                   params["id"] = oid;
                    ajaxType = "put";
                }
                const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
                axios.request({
                    url: updateGroupstUrl,
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
                        if( json.hasOwnProperty("group") && json.group.id){
                            // 更新数据
                            updateGroups({...json.group});
                            form.resetFields();
                            //关闭modal
                            closeGroupModal();
                        }else{
                            console.warn("Can't receive group key.")
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
                //     url: updateGroupstUrl,
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
                //             if( json.hasOwnProperty("group") && json.group.id){
                //                 // 更新数据
                //                 updateGroups({...json.group});
                //                 form.resetFields();
                //                 //关闭modal
                //                 closeGroupModal();
                //             }else{
                //                 console.warn("Can't receive group key.")
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
        const { groupModal, closeGroupModal } = this.props;
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
        return(
            <Form
                onSubmit={this.handleSubmit}
            >
                <FormItem
                    {...formItemLayout}
                    label="组名"
                    hasFeedback={true}
                >
                    {getFieldDecorator('name', {
                        initialValue: groupModal.data.name || "",
                        rules : [{
                            required: true,
                            validator : (rule, value, callback) => {
                                if(value.trim() == ""){
                                    callback("必填项")
                                }else if(value.length > 64){
                                    callback("最长为64位")
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
                        }
                        ]
                    })(<Input prefix={""} className="form_input"  placeholder="请输入数字、字母、下划线组合"/>)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="描述"
                    hasFeedback={true}
                >
                    {getFieldDecorator('description', {
                        initialValue: groupModal.data.description || "",
                        rules: [{
                            required: true,
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
                    })(<Input prefix={""} className="form_input"  placeholder="最长64位"/>)}
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
                    <Button onClick={closeGroupModal}>
                        取消
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

ModalForm = Form.create()(ModalForm);

//添加、修改角色模态框
class groupModal extends React.Component{
    render(){
        const { groupModal, updateGroups, closeGroupModal } = this.props;
        const title = groupModal.isAdd ? "添加" : "修改";
        return (
            <div>
                <Modal
                    title={`${title}组`}
                    maskClosable={false}
                    visible={groupModal.visible}
                    onCancel={closeGroupModal}
                    footer={null}
                >
                    <ModalForm
                        groupModal={groupModal}
                        closeGroupModal={closeGroupModal}
                        updateGroups={updateGroups}
                    />
                </Modal>
            </div>
        )
    }
}

export default groupModal;