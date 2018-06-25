import React from 'react'
import axios from 'axios';
import {Modal, Button, Form, Input, Tabs, Row, Col } from 'antd'
import RoleModalCbContainer from '../../../container/roleModalCbContainer'
import { updateRolesUrl } from '../../../utils/requestUrls'
import './roleModal.less'
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

//添加、修改角色表单
class ModalForm extends React.Component {
    constructor(props){
        super(props)
        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.groupAuth = this.groupAuth.bind(this);
        this.groupSecAuth = this.groupSecAuth.bind(this);
    }

    //提交页面
    handleSubmit(e) {
        e.preventDefault();
        const { form, roleModal, updateRoles, closeRoleModal, authCbChooseStr } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            //success
            if (!err) {
                let params = values;
                //拼接权限值到params中
                let authCbChooseArr = authCbChooseStr.split(",");
                params["authorities"] = [];
                authCbChooseArr.forEach( id => {
                    if(id.trim() != ""){
                        params["authorities"].push({id: id})
                    }
                })
                //根据id验证是添加（无id）还是修改（有id）
                const oid = roleModal.data.id || "";
                let ajaxType = "post";
                //不为空 为修改
                if( "" != oid){
                    params["id"] = oid;
                    ajaxType = "put";
                }
                const UUMAToken = sessionStorage.getItem("UUMAToken") || "";

                axios.request({
                    url: updateRolesUrl,
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
                        if( json.hasOwnProperty("role") && json.role.id){
                            // 更新数据
                            updateRoles({...json.role});
                            form.resetFields();
                            //关闭modal
                            closeRoleModal();
                        }else{
                            console.warn("Can't receive group key.")
                        }
                    }else if(200 != status && json.hasOwnProperty("error")  ){
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
                //     url: updateRolesUrl,
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
                //             if( json.hasOwnProperty("role") && json.role.id){
                //                 // 更新数据
                //                 updateRoles({...json.role});
                //                 form.resetFields();
                //                 //关闭modal
                //                 closeRoleModal();
                //             }else{
                //                 console.warn("Can't receive group key.")
                //             }
                //         }else if(200 != status && json.hasOwnProperty("error")  ){
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
        const { form, resetChooseData } = this.props;
        //重置多选按钮
        resetChooseData();
        form.resetFields();
    }
    //权限分组，前四位归类
    groupAuth( list ){
        let res = {};
        //第一遍遍历，分大组
        for(let item in list){
            const auth = list[item];
            //取code码
            const code = auth.code+"";
            if(code.length == 6){
                if( !res.hasOwnProperty("1101") ){
                    res["1101"] = {
                        description: "前端功能列表",
                        datas: []
                    };
                }
                res["1101"].datas.push(auth);
            }else if(code.length == 8){
                //权限前四位
                let gCode = (code).substring(0, 4);
                let bCode = (code).substring(4, 8);

                if( !res.hasOwnProperty(gCode) ){
                    res[gCode] = {
                        description: "",
                        datas: []
                    };
                }
                if(bCode == "0000"){
                    res[gCode].description = auth.description;
                }else{
                    res[gCode].datas.push(auth);
                }
            }
        }

        //第二遍遍历，分小组
        let newRes = {};
        for(let key in res){
            const datas = res[key].datas;
            //根据5、6位分组
            const datasObj = this.groupSecAuth(datas);
            newRes[key] = {
                description: res[key].description,
                datas: datasObj
            }
        }
        return newRes;
    }

    groupSecAuth( datasArr ){
        let res = {};
        //第一遍遍历，分大组
        for(let item in datasArr){
            const auth = datasArr[item];
            //取code码
            const code = auth.code+"";
            if(code.length == 6){
                if( !res.hasOwnProperty("1101") ){
                    res["1101"] = {
                        description: "",
                        datas: []
                    };
                }
                res["1101"].datas.push(auth);
            }else if(code.length == 8){
                //权限前六位
                let gCode = (code).substring(0, 6);
                //后两位
                let bCode = (code).substring(6, 8);

                if( !res.hasOwnProperty(gCode) ){
                    res[gCode] = {
                        description: "",
                        datas: []
                    };
                }
                if(bCode == "00"){
                    res[gCode].description = auth.description;
                }else{
                    res[gCode].datas.push(auth);
                }
            }
        }
        return res;
    }

    render(){

        const { roleModal, authoritiesList, closeRoleModal } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },

            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
        };
        const rulesGenerate = {
            name : getFieldDecorator('name', {
                initialValue: roleModal.data.name || "",
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
                }]
            }),
            description : getFieldDecorator('description', {
                initialValue: roleModal.data.description || "",
                rules : [{
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
            })
        };
        const authData = this.groupAuth(authoritiesList.data);
        const authKeys = Object.keys(authData).sort();
        return(
            <Form onSubmit={this.handleSubmit} >
                <FormItem
                    {...formItemLayout}
                    label="角色名"
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
                    wrapperCol={{ span: 24}}
                    hasFeedback={true}
                    className="checkbox_content"
                >
                    <div className="card-container">
                        <div className="card-title">配置权限</div>
                        <Tabs type="card">
                            {
                                authKeys.map(code => (
                                    <TabPane tab={authData[code].description || "其他"} key={code}>
                                            {

                                                Object.keys(authData[code].datas).map( sCode => (
                                                    <Row key={sCode}>
                                                        {
                                                            authData[code].datas[sCode].description == "" ?
                                                                "" :
                                                                <Col span={24} className="card-group-title"> {authData[code].datas[sCode].description} </Col>
                                                        }
                                                        <Col span={24}>
                                                            { authData[code].datas[sCode].datas.sort((a,b)=>{
                                                                return (a*1) - (b*1)
                                                            }).map( auth => (
                                                                <RoleModalCbContainer
                                                                key = {auth.id}
                                                                id = {auth.id}
                                                                obj = {auth}
                                                                span = "8"
                                                                />
                                                                ))
                                                            }
                                                        </Col>
                                                    </Row>
                                                ))


                                            }

                                    </TabPane>
                                ))
                            }
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
                    <Button onClick={closeRoleModal}>
                        取消
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

ModalForm = Form.create()(ModalForm);

//添加、修改角色模态框
class roleModal extends React.Component{
    render(){
        const { roleModal, closeRoleModal} = this.props;
        const title = roleModal.isAdd ? "添加" : "修改";
        return (
            <div>
                <Modal
                    title={`${title}角色`}
                    maskClosable={false}
                    visible={roleModal.visible}
                    onCancel={closeRoleModal}
                    width="1200"
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

export default roleModal;