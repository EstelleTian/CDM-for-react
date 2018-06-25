import React from 'react'
import { Layout } from 'antd'
import { Link } from 'react-router'
import SliderMenuContainer from '../../container/sliderMenuContainer'
const {  Content, Sider} = Layout;
import './home.less';

const Home = (props) => {
    return (
        <Layout className="sider_layout" style={{ minHeight: '100vh'}}>
            <Sider collapsed={false} >
                <div className="logo header_title">
                    ATOM用户管理
                </div>
                <SliderMenuContainer />
            </Sider>
            <Layout>
                <Content className="us_content">
                    {props.children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default Home