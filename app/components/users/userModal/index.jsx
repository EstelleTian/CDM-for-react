import React from 'react'
import axios from 'axios'
import $ from 'jquery'
import {Modal, Button, Form, Input, Tabs, Row } from 'antd'
import UserModalForRoleCbContainer from '../../../container/userModalForRoleCbContainer'
import UserModalForGroupCbContainer from '../../../container/userModalForGroupCbContainer'
import { updateUsesrUrl } from '../../../utils/requestUrls'
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

//添加、修改用户表单
class ModalForm extends React.Component {
    constructor(props){
        super(props)
        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //提交页面
    handleSubmit(e) {
        e.preventDefault();
        const { form, userModal, updateUsers, closeUserModal, roleCbChooseStr, groupCbChooseStr } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            //success
            if (!err) {
                let params = values;
                //拼接权限值到params中
                let roleCbChooseArr = roleCbChooseStr.split(",");
                params["roles"] = [];
                roleCbChooseArr.forEach( id => {
                    if(id.trim() != ""){
                        params["roles"].push({id: id})
                    }
                })
                //拼接权限值到params中
                let groupCbChooseArr = groupCbChooseStr.split(",");
                params["groups"] = [];
                groupCbChooseArr.forEach( id => {
                    if(id.trim() != ""){
                        params["groups"].push({id: id})
                    }
                })
                const oid = userModal.data.id || "";
                let ajaxType = "post";
                //不为空 为修改
                if( "" != oid){
                    params["id"] = oid;
                    ajaxType = "put";
                }
                const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
                axios.request({
                    url: updateUsesrUrl,
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
                        if( json.hasOwnProperty("user") && json.user.id){
                            // 更新数据
                            updateUsers({...json.user});
                            form.resetFields();
                            //关闭modal
                            closeUserModal();
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

                // $.ajax({
                //     url: updateUsesrUrl,
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
                //             if( json.hasOwnProperty("user") && json.user.id){
                //                 // 更新数据
                //                 updateUsers({...json.user});
                //                 form.resetFields();
                //                 //关闭modal
                //                 closeUserModal();
                //             }else{
                //                 console.warn("Can't receive group key.")
                //             }
                //         }else if( (200 != status) && json.hasOwnProperty("error")  ){
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
        const { form, resetRoleChooseData, resetGroupChooseData } = this.props;
        //重置多选按钮
        resetRoleChooseData();
        resetGroupChooseData();
        //重置表单
        form.resetFields();

    }
    render(){
        const {  userModal, roleList, groupList, closeUserModal } = this.props;
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
            username : getFieldDecorator('username', {
                initialValue: userModal.data.username || "",
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
            descriptionCN : getFieldDecorator('descriptionCN', {
                initialValue: userModal.data.descriptionCN || "",
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
            }),
            descriptionEN : getFieldDecorator('descriptionEN', {
                initialValue: userModal.data.descriptionEN || "",
                rules : [{
                    required: true,
                    validator : (rule, value, callback) => {
                        if(value.trim() == ""){
                            callback("必填项")
                        }else{
                            const reg = /^[a-zA-Z]*$/;
                            let flag = reg.test(value);
                            //true正确
                            if(flag){
                                callback()
                            }else if(value.length > 64){
                                callback("最长为64位")
                            }else{
                                callback("只允许输入英文")
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
                    label="用户名"
                    hasFeedback={true}
                >
                    {rulesGenerate.username(<Input className="form_input"  placeholder="请输入数字、字母、下划线组合"/>)}
                </FormItem>
                {
                    userModal.data.id ? "" : (
                        <FormItem
                            {...formItemLayout}
                            label="密码"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('password', {
                                rules : [{
                                    required: true,
                                    validator : (rule, value, callback) => {
                                        value = value + "";
                                        if(value.trim() == ""){
                                            callback("必填项")
                                        }else{
                                            const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
                                            let flag = reg.test(value);
                                            //true正确
                                            if(flag){
                                                callback()
                                            }else{
                                                callback("请输入8位以上密码(必须包含大小写字母和数字)")
                                            }
                                        }

                                    }
                                }
                                ]
                            })(<Input type="password" className="form_input"  placeholder="请输入8位以上密码(必须包含大小写字母和数字)"/>)}
                        </FormItem>
                    )
                }

                <FormItem
                    {...formItemLayout}
                    label="中文描述"
                    hasFeedback={true}
                >
                    {rulesGenerate.descriptionCN(<Input className="form_input"  placeholder="请输入中文"/>)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="英文描述"
                    hasFeedback={true}
                >
                    {rulesGenerate.descriptionEN(<Input className="form_input"  placeholder="请输入英文"/>)}
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 24}}
                    hasFeedback={true}
                    className="checkbox_content"
                >
                    <div className="card-container">
                        <Tabs type="card">
                            <TabPane tab="角色配置" key="1">
                                <Row>
                                    {
                                        roleList.data.map( role => (
                                            <UserModalForRoleCbContainer
                                                key = {role.id}
                                                id = {role.id}
                                                obj = {role}
                                            />
                                        ))
                                    }
                                </Row>
                            </TabPane>
                            <TabPane tab="组配置" key="2">
                                <Row>
                                    {
                                        groupList.data.map( group => (
                                            <UserModalForGroupCbContainer
                                                key = {group.id}
                                                id = {group.id}
                                                obj = {group}
                                            />
                                        ))
                                    }
                                </Row>
                            </TabPane>
                        </Tabs>
                    </div>
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
                    <Button onClick={closeUserModal}>
                        取消
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

ModalForm = Form.create()(ModalForm);

//添加、修改用户模态框
class userModal extends React.Component{
    render(){
        const { userModal, closeUserModal } = this.props;
        const title = userModal.isAdd ? "添加" : "修改";
        return (
            <div>
                <Modal
                    title={`${title}用户`}
                    maskClosable={false}
                    visible={userModal.visible}
                    onCancel={closeUserModal}
                    width="850"
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

export default userModal;