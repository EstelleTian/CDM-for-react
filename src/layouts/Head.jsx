import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Layout, Row, Col, Menu, Icon, Avatar  } from 'antd'
import { userLogout } from '../views/LoginRedux'
import './Head.less'
// import Row from "antd/lib/grid/row.d";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;
class Head extends React.Component{
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    // 登出
    handleLogout(){
        const {  userLogout, history } = this.props;

        // 用户登出
        userLogout();
        // 跳转到主页面
        history.push('/');
    }
    render(){
        const { systemConfig } = this.props;
        const {systemElem,systemName} = systemConfig;
        const {username} = this.props.loginUserInfo;
        return (
            <Header className="air-header">
                <Row className="no-margin" gutter={16}>
                    <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span:12}}  xl={{ span: 8}} xxl={{ span: 6}}>
                        <div className="system-title">{systemElem}{systemName}</div>
                    </Col>
                    <Col xs={{ span: 4}}  md={{ span: 4}} lg={{ span:12}}  xl={{ span: 16}} xxl={{ span: 18}}>
                        <div className='navbar'>

                            <Menu
                                // onOpenSetting={this.onOpenSetting}
                                mode="horizontal"
                                theme="dark"
                                multiple={ true }
                                className= 'navbar-menu'
                            >
                                <SubMenu
                                    key="setting"
                                    title={<Icon type="setting" />}
                                >
                                    <Menu.Item key="1">
                                        <Icon type="book" />
                                        <span  >帮助手册</span>
                                    </Menu.Item>

                                    <Menu.Item key="2">
                                        <Icon type="api" />
                                        <span   >历史查询</span>
                                    </Menu.Item>

                                    <Menu.Item key="3">
                                        <Icon type="key" />
                                        <span >修改密码</span>
                                    </Menu.Item>

                                    <Menu.Item key="logout" onClick={this.handleLogout} >
                                        <Icon type="logout" />
                                        <span  >登出</span>
                                    </Menu.Item>

                                </SubMenu>
                            </Menu>
                            <div className="usef-info">
                                <Icon type="user" />
                                <label>{username}</label>
                            </div>

                        </div>

                    </Col>
                </Row>

            </Header>
        )
    }

}

const mapStateToProps = ( state ) => ({
    systemConfig : state.systemConfig,
    loginUserInfo : state.loginUserInfo,
})

const mapDispatchToProps = {
    userLogout,
}
//导航栏容器
const HeadContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Head);


export default withRouter(HeadContainer) ;