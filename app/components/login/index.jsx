import React from 'react'
import {Form, Icon, Input, Button, Alert} from 'antd'
import { withRouter } from 'react-router-dom'
import { loginUrl } from '../../utils/requestUrls'
import axios from 'axios'
import $ from 'jquery'
import "./login.less"

const FormItem = Form.Item

class LoginForm extends React.Component{
    //从用户角色中查找出拥有的操作权限
    convertOptAuth = (authArr) => {
        let resStr = ""
        if( authArr.length > 0 ){
            //取权限
            authArr.map( authObj => {
                //取每个权限代码，添加到权限字符串中
                let code = authObj.code || ''
                code += ''
                if( code != ''){
                    if( resStr.indexOf(code) == -1){
                        resStr += code + ','
                    }
                }
            })
        }
        resStr = resStr.substring( 0 , resStr.length -1)
        //排序
        let resArr = resStr.split(',').sort()
        return resArr.join()
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const _form = this.props.form;
        const history = this.props.history;
        const { filterList, updateMultiFilter } = this.props;
        _form.validateFieldsAndScroll((err, values) => {
            //success
            if (!err) {
                const userLogin = this.props.userLogin;
                const username = values.username.trim();
                const password = values.password.trim();
                axios.get(loginUrl,{
                    params: {
                        username: username,
                        password: password
                    },
                    withCredentials: true
                }).then( response => {
                    const json = response.data;
                    if( 200 == json.status*1 && json.hasOwnProperty("token")){
                        sessionStorage.setItem("UUMAToken", json.token)
                        //账户拥有的权限
                        let optsAuths = this.convertOptAuth( (json.authorityList || []))
                        let user = json.user
                        let params = {
                            username,
                            password,
                            optsAuths,
                            loginStatus: true,
                            user
                        }
                        userLogin(params);
                        //清除在线用户的自定义查询数据和多条件查询数据，以便于下次再登录后保留记录
                        filterList("all");
                        updateMultiFilter({});

                        history.push('/home');
                    }else if( 500 == json.status*1 && json.hasOwnProperty("error")  ){
                        const error = json.error.message ? json.error.message : "";
                        let param = {
                            errmsg: error
                        }
                        userLogin(param);
                        _form.resetFields();
                    }
                }).catch(err => {
                    console.error(err);
                })
            }else{
                console.error(err);
            }
        });
    }

    notEmpty = (rule, value, callback) => {
        if(value == undefined || null == value || value.trim() == ""){
            const name = rule.field;
            switch(name){
                case "username" : callback("用户名不能为空！");
                case "password" : callback("密码不能为空！");
            }
        }else{
            callback();
        }
    }

    render(){
        const { login } = this.props;
        const { getFieldDecorator } = this.props.form;
        const rulesGenerate = {
            username: getFieldDecorator("username", {
                rules: [
                    // {required: true, message: "用户名不能为空！"},
                    {validator : this.notEmpty}
                ]
            }),
            password: getFieldDecorator("password", {
                rules: [{validator : this.notEmpty}]
            }),
        };
        return (
            <div className="login">
                <div className="content">
                    <Form className="login_form" onSubmit={this.handleSubmit}>
                        <FormItem>
                            <h3 className="title">ATMM用户管理</h3>
                        </FormItem>
                        <FormItem>
                            {
                                (!login.loginStatus && login.errmsg != "")  ?  <Alert
                                    message={ login.errmsg }
                                    type="error"
                                /> : ""
                            }

                        </FormItem>
                        <FormItem>
                            {
                                rulesGenerate.username(
                                    <Input prefix={<Icon type="user" />} className="form_input"  placeholder="用户名"/>
                                )
                            }
                        </FormItem>
                        <FormItem>
                            {
                                rulesGenerate.password(
                                    <Input prefix={<Icon type="lock" />} type="password" className="form_input" placeholder="密码"/>
                                )
                            }
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login_button">
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

const Login = Form.create()(LoginForm);

export default withRouter(Login)

