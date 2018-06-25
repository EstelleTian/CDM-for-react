import React from 'react'
import { Layout, Menu, Icon } from 'antd'
import {  Route, Switch, Redirect, NavLink } from 'react-router-dom'
import axios from 'axios'
import Bundle from '../../bundle'
import { getUserInfoUrl } from '../../utils/requestUrls'

import Logout from '../logout'
const { Content, Sider} = Layout;
import './home.less';

const OnlineUserListContainer = () => (
    <Bundle load={() => import('../../container/onlineUserListContainer')}>
        {(OnlineUserListContainer) => <OnlineUserListContainer />}
    </Bundle>
)
const UserListContainer = () => (
    <Bundle load={() => import('../../container/userListContainer')}>
        {(UserListContainer) => <UserListContainer />}
    </Bundle>
)
const RoleListContainer = () => (
    <Bundle load={() => import('../../container/roleListContainer')}>
        {(RoleListContainer) => <RoleListContainer />}
    </Bundle>
)
const AuthoritiesListContainer = () => (
    <Bundle load={() => import('../../container/authoritiesListContainer')}>
        {(AuthoritiesListContainer) => <AuthoritiesListContainer />}
    </Bundle>
)
const GroupListContainer = () => (
    <Bundle load={() => import('../../container/groupListContainer')}>
        {(GroupListContainer) => <GroupListContainer />}
    </Bundle>
)
const LoginCategoryListContainer = () => (
    <Bundle load={() => import('../../container/loginCategoryListContainer')}>
        {(LoginCategoryListContainer) => <LoginCategoryListContainer />}
    </Bundle>
)


class Home extends React.Component{
    constructor(props){
        super(props);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.timerId = "";
        this.mountTimerId = "";
    }
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

    //获取用户权限，用以显示界面功能
    getUserInfo = () => {
        //取用户token
        const UUMAToken = sessionStorage.getItem("UUMAToken") || ""
        if(UUMAToken == ""){
            return;
        }
        const that = this;
        const { login, updateUserAuths } = this.props;
        axios.get(getUserInfoUrl,{
            headers: {
                Authorization: UUMAToken
            },
            params: {
                token: UUMAToken
            },
            withCredentials: true
        }).then( response => {
            const json = response.data
            const status = json.status*1
            if( status == 200 && json.hasOwnProperty("authorityList")){
                //当前权限
                const optsAuthStr = that.convertOptAuth( (json.authorityList || []))
                //存储在login的权限
                const orgOptsAuths = login.optsAuths || ''
                let  user = json.user;
                if( orgOptsAuths != optsAuthStr ){
                    let params = {
                        username: json.user.username,
                        password: json.user.password,
                        optsAuths: optsAuthStr,
                        loginStatus: true,
                        user : user
                    }
                    updateUserAuths(params)
                    const locationHash = location.hash
                    that.handleUrl(locationHash, optsAuthStr)
                }

            }else{
                console.error("received userInfo data is invalida.")
                console.error(json)
            }
            //定时刷新用户列表
            clearTimeout(that.timerId);
             let curTimerId = setTimeout(function(){
                 clearTimeout(that.timerId);
                that.getUserInfo()
            }, 1000 * 30);
            that.timerId = curTimerId;
        }).catch(err => {
            console.error(err);
            //定时刷新用户列表
            clearTimeout(that.timerId);
            that.timerId = setTimeout(function(){
                that.getUserInfo()
            }, 1000 * 30);
        })
    }

    componentDidMount(){
        clearTimeout(this.mountTimerId);
        let that = this;
        let a = setTimeout(function(){
            clearTimeout(that.timerId);
            //定时请求用户信息
            that.getUserInfo()
        }, 0);
        this.mountTimerId = a;

    }
    componentWillUnmount(){
        clearTimeout(this.mountTimerId);
        clearTimeout(this.timerId);
    }

    //当前路径是否有权限
    hasLocalAuth(locationHash, optsAuthStr){
        let flag = false;
        //获取全新
        const optsAuths = optsAuthStr || ''
        if( optsAuths == ''){
            return flag
        }

        if( locationHash.indexOf('onlineUser') > -1 && optsAuths.indexOf('31010111') > -1){
            flag = true;
        }
        if( locationHash.indexOf('users') > -1 && optsAuths.indexOf('31010211') > -1){
            flag = true;
        }
        if( locationHash.indexOf('roles') > -1 && optsAuths.indexOf('31010311') > -1){
            flag = true;
        }
        if( locationHash.indexOf('authorities') > -1 && optsAuths.indexOf('31010411') > -1){
            flag = true;
        }
        if( locationHash.indexOf('groups') > -1 && optsAuths.indexOf('31010511') > -1){
            flag = true;
        }
        if( locationHash.indexOf('loginCategory') > -1 && optsAuths.indexOf('31010711') > -1){
            flag = true;
        }
        return flag

    }

    handleUrl(locationHash, optsAuthStr){
        //当前路径是否有权限
        const flag = this.hasLocalAuth(locationHash, optsAuthStr)
        //如果没有权限，取列表第一个
        if( !flag ){
            let path = ''
            const optsAuths = optsAuthStr || ''
            if( optsAuths.indexOf('31010111') != -1 ){
                path = 'onlineUser'
            }else if( optsAuths.indexOf('31010211') != -1 ){
                path = 'users'
            }else if( optsAuths.indexOf('31010311') != -1 ){
                path = 'roles'
            }else if( optsAuths.indexOf('31010411') != -1 ){
                path = 'authorities'
            }else if( optsAuths.indexOf('31010511') != -1 ){
                path = 'groups'
            }else if( optsAuths.indexOf('31010711') != -1 ){
                path = 'loginCategory'
            }else if( optsAuths.indexOf('31010711') != -1 ){
                path = 'loginVersion'
            }
            //如果当前地址和path不同，跳转到path
            if(path == ''){
                //路由跳转
                this.props.history.push('/')
            }else if(locationHash.indexOf(path) == -1){
                //路由跳转
                this.props.history.push('/home/' + path)
            }
        }
    }

    render(){
        const { login, userLogin} = this.props
        const optsAuths = login.optsAuths || ''
        return (
            <Layout className="sider_layout" style={{ minHeight: '100vh'}}>
                <Sider collapsed={false} >
                    <div className="logo header_title">
                        ATMM用户管理
                    </div>
                    <Menu theme="dark" selectedKeys={[location.hash]} mode="inline" >
                        {
                            (optsAuths.indexOf('31010111') == -1) ? ''
                                : <Menu.Item key="#/home/onlineUsers">
                                    <NavLink to="/home/onlineUsers"><Icon type="user" />用户在线列表</NavLink>
                                </Menu.Item >
                        }
                        {
                            (optsAuths.indexOf('31010211') == -1) ? ''
                                : <Menu.Item key="#/home/users">
                                    <NavLink to="/home/users"><Icon type="team" />用户列表</NavLink>
                                </Menu.Item >
                        }
                        {
                            (optsAuths.indexOf('31010311') == -1) ? ''
                                : <Menu.Item key="#/home/roles">
                                    <NavLink to="/home/roles"><Icon type="solution" />角色列表</NavLink>
                                </Menu.Item >
                        }
                        {
                            (optsAuths.indexOf('31010411') == -1) ? ''
                                : <Menu.Item key="#/home/authorities">
                                    <NavLink to="/home/authorities"><Icon type="key" />权限列表</NavLink>
                                </Menu.Item >
                        }
                        {
                            (optsAuths.indexOf('31010511') == -1) ? ''
                                : <Menu.Item key="#/home/groups">
                                    <NavLink to="/home/groups"><Icon type="fork" />组列表</NavLink>
                                </Menu.Item >
                        }
                        {
                            (optsAuths.indexOf('31010711') == -1) ? ''
                                : <Menu.Item key="#/home/loginCategory">
                                <NavLink to="/home/loginCategory"><Icon type="setting" />登录控制</NavLink>
                            </Menu.Item >
                        }
                        {
                            (optsAuths.indexOf('31010601') == -1) ? ''
                                : <Menu.Item>
                                    <Logout
                                        userLogin = {userLogin}
                                        history={this.props.history}
                                    />
                                </Menu.Item >
                        }
                    </Menu>
                    <div className="header_login">
                        欢迎您：
                        <span className="name">{ login.username || '' }</span>
                    </div>
                </Sider>

                <Layout>
                    <Content className="us_content">
                        <Switch>
                            <Route path="/home/onlineUsers" component={OnlineUserListContainer} />
                            <Route path="/home/users" component={UserListContainer} />
                            <Route path="/home/roles" component={RoleListContainer} />
                            <Route path="/home/authorities" component={AuthoritiesListContainer} />
                            <Route path="/home/groups" component={GroupListContainer} />
                            <Route path="/home/loginCategory" component={LoginCategoryListContainer} />

                            <Redirect to="/home/onlineUsers"/>
                        </Switch>

                    </Content>
                </Layout>
            </Layout>
        )
    }

}

export default Home