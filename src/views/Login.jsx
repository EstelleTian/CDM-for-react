import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { updateUserInfo } from './LoginRedux'
import LoginForm from '../components/Login/Form'

const mapStateToProps = ( state ) => ({
    loginUserInfo : state.loginUserInfo
})

const mapDispatchToProps = () => ({
    updateUserInfo
})

const Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);

export default withRouter(Login);