import React from 'react';
import {Form, Icon, Input, Button, Alert,Row, Col} from 'antd'
import { Base64 } from 'js-base64';
import axios from 'axios'
import './Form.less'
import { loginUrl, getSystemConfigUrl } from '../../utils/request-urls';
import { requestGet, request } from '../../utils/request-actions';
const FormItem = Form.Item;

class Loginform extends React.Component{

    constructor( props ){
        super(props);
        this.updateUserInfoData = this.updateUserInfoData.bind(this);
        this.updateSystemConfigData = this.updateSystemConfigData.bind(this);
        this.handleLoginByIP = this.handleLoginByIP.bind(this);
        this.getSystemConfig = this.getSystemConfig.bind(this);
        this.setDocumentLTitle = this.setDocumentLTitle.bind(this);
    }
    // 点击登录按钮登录
    handleSubmit = (e) => {
        e.preventDefault();
        const _form = this.props.form;

        _form.validateFieldsAndScroll((err, values) => {
            //success
            if (!err) {
                const username = values.username.trim();
                // 对密码 base64编码 处理
                // const password =  Base64.encode(values.password.trim());
                const password =  values.password.trim();
                const params = {
                    username:username,
                    password:password
                }
                request(loginUrl,'POST',params,this.updateUserInfoData)

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

    // 通过IP登录
    handleLoginByIP(){
        const params = {
            username :'',
            password : ''
        };
        request(loginUrl,'POST',params,this.updateUserInfoData)
    }
    // 更新用户信息
    updateUserInfoData(res){
        const updateUserInfo = this.props.updateUserInfo;
        const history = this.props.history;
        // 200 成功
        if( 200 == res.status*1 ){
            // 用户信息
            let {username,id:userId} = res.user;
            let params = {
                username,
                loginStatus: true,
                userId
            }
            debugger
            // 更新用户信息
            updateUserInfo(params);
            // 跳转到主页面
            history.push('/home');
        }else if( 500 == res.status*1 && res.hasOwnProperty("error")  ){ //    500 失败
            // 错误信息
            const error = res.error.message ? res.error.message : "";
            let param = {
                errmsg: error
            };
            updateUserInfo(param);
        }else if( 400 == res.status*1 && res.hasOwnProperty("error") ){ //    400 失败
            // 错误信息
            const error = res.error.message ? res.error.message : "";
            let param = {
                errmsg: error
            };
            updateUserInfo(param);
        }
    }
    //获取系统参数
    getSystemConfig(){
        // 发送请求并指定回调方法
        requestGet(getSystemConfigUrl,{},this.updateSystemConfigData)
    }

    // 更新系统参数
    updateSystemConfigData (res){
        const { updateSystemConfig } = this.props;
        if( 200 == res.status*1 ){
            const  {system,systemAirport,systemElem,systemName} = res;
            let params = {
                system,
                systemAirport,
                systemElem,
                systemName,
            };
            // 更新系统参数配置信息
            updateSystemConfig(params);
            // 设置 html title
            this.setDocumentLTitle();
        }
    }
    // 设置 html 标题
    setDocumentLTitle (){
        const { systemConfig = {} }  = this.props;
        const { systemElem ='', systemName =''} = systemConfig;
        const title = `${systemElem}${systemName}`;
        if(title && title!==''){
            document.title = title;
        }
    }
    // 立即调用
    componentDidMount(){
        this.getSystemConfig();
    }

    render(){
        const { loginUserInfo, systemConfig } = this.props;
        const {systemElem,systemName} = systemConfig;
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
                    <Col xs={{ span: 16}}  md={{ span: 12}} lg={{ span: 13}}  xl={{ span: 9}} xxl={{ span: 7}} >

                        <div className="content">
                            <div className="head"></div>
                            <Form className="login_form" onSubmit={this.handleSubmit}>
                                <FormItem>
                                    <h2 className="title">{systemElem}{systemName}</h2>
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
                                    <a className="login-form-by-ip" href="javascript:;" onClick={this.handleLoginByIP}>通过IP登录</a>
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

}

export default Form.create()(Loginform);
