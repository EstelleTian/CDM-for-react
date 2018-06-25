import React from 'react';
import { Layout } from 'antd'
import Head from "../layouts/Head";
import NavMenu from "../layouts/NavMenu";
import AirTable from '../views/AirTable'
import "./Home.less";

const { Content } = Layout;

const Home = ( props ) => (
    <Layout theme="dark" className="air-layout">
        <Head />
        <NavMenu />
        <Content>
            <AirTable />
        </Content>
    </Layout>
)

export default Home;

