import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { updateUserInfo, updateSystemConfig,  updateFlowcontrolParams } from './LoginRedux'
import LoginForm from '../components/Login/Form'

const mapStateToProps = ( state ) => ({
    loginUserInfo : state.loginUserInfo, // 登录用户信息
    systemConfig : state.systemConfig, // 系统参数配置
    flowcontrolParams : state.flowcontrolParams, // 获取流控数据请求中所需参数
})

const mapDispatchToProps = {
    updateUserInfo,
    updateSystemConfig,
    updateFlowcontrolParams
}

const Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);

export default withRouter(Login);