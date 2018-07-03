import React from 'react';
import {Form, Icon, Input, Button, Alert,Row, Col} from 'antd'
import { Base64 } from 'js-base64';
import axios from 'axios'
import './Form.less'
import { loginUrl } from '../../utils/request-urls';

const FormItem = Form.Item;

class Loginform extends React.Component{
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
        _form.validateFieldsAndScroll((err, values) => {
            //success
            if (!err) {
                const updateUserInfo = this.props.updateUserInfo;
                const username = values.username.trim();
                // 对密码 base64编码 处理
                // const password =  Base64.encode(values.password.trim());
                const password =  values.password.trim();
                // 发送请求
                axios({
                    method:"POST",
                    url:loginUrl,
                    data:{
                        username:username,
                        password:password
                    },
                    // 格式化处理数据
                    transformRequest: [function (data) {
                        let ret = ''
                        for (let it in data) {
                            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        return ret
                    }],
                }).then( response => {
                    const json = response.data;
                    if( 200 == json.status*1 ){

                        // let user = json.user
                        let userid = json.user.id;
                        let params = {
                            username,
                            password,
                            loginStatus: true,
                            userid,
                        }
                        updateUserInfo(params);
                        // 跳转到主页面
                        history.push('/home');
                    }else if( 500 == json.status*1 && json.hasOwnProperty("error")  ){
                        const error = json.error.message ? json.error.message : "";
                        let param = {
                            errmsg: error
                        }
                        updateUserInfo(param);
                        // _form.resetFields();
                        console.log(this.props.loginUserInfo)
                    }else if( 400 == json.status*1 && json.hasOwnProperty("error") ){
                        const error = json.error.message ? json.error.message : "";
                        let param = {
                            errmsg: error
                        }
                        updateUserInfo(param);
                        // _form.resetFields();
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
        const { loginUserInfo } = this.props;
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
            <div className="login bc-image-11">
                <Row type="flex" justify="center" align="middle">
                    <Col xs={{ span: 16}}  md={{ span: 12}} lg={{ span: 10}}  xl={{ span: 8}} xxl={{ span: 6}} >

                        <div className="content">
                            <div className="head"></div>
                            <Form className="login_form" onSubmit={this.handleSubmit}>
                                <FormItem>
                                    <h2 className="title">CDM机场协同放行</h2>
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
                                    <a className="login-form-by-ip" href="javascript:;" onClick={this.handleLoginByIP.bind(this)}>通过IP登录</a>
                                    <Button type="primary" htmlType="submit" size={'large'} className="login_button">
                                        登录
                                    </Button>

                                </FormItem>
                                <FormItem className={((!loginUserInfo.loginStatus && loginUserInfo.errmsg != "") ? 'has-err' : '')}>
                                    {
                                        (!loginUserInfo.loginStatus && loginUserInfo.errmsg != "")  ?  <Alert
                                            message={ loginUserInfo.errmsg }
                                            type="error"
                                        /> : ""
                                    }

                                </FormItem>
                            </Form>

                        </div>
                        <p className="copyright">Copyright ADCC 民航数据通信有限责任公司</p>
                    </Col>
                </Row>

            </div>
        )
    }

    handleLoginByIP(){
        const updateUserInfo = this.props.updateUserInfo;
        // 发送请求
        axios({
            method:"POST",
            url:loginUrl,
            // 设置用户名和密码均为空
            data:{
                username:'',
                password:''
            },
            // 格式化处理数据
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
        }).then( response => {
            const json = response.data;
            // 200 成功
            if( 200 == json.status*1 ){
                // 用户信息
                let user = json.user
                let userID = json.id
                let params = {
                    username,
                    password,
                    optsAuths,
                    loginStatus: true,
                    user,
                    userID
                }
                // 更新用户信息
                updateUserInfo(params);
                // 路由跳转
                history.push('/home');

            }else if( 500 == json.status*1 && json.hasOwnProperty("error")  ){ //    500 失败
                // 错误信息
                const error = json.error.message ? json.error.message : "";
                let param = {
                    errmsg: error
                }
                updateUserInfo(param);
            }else if( 400 == json.status*1 && json.hasOwnProperty("error") ){ //    400 失败
                // 错误信息
                const error = json.error.message ? json.error.message : "";
                let param = {
                    errmsg: error
                }
                updateUserInfo(param);
            }
        }).catch(err => {
            console.info(err);
        })
    }
}

export default Form.create()(Loginform);
