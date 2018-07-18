import React from 'react';
import { Layout, Card, Col, Row } from 'antd'
import Head from "../layouts/Head";
import NavMenuContainer from "../layouts/NavMenuContainer";
import FlightsSortModule from '../components/FlightsSortModule/FlightsSortModule';
import FlowcontrolModule from '../components/FlowcontrolModule/FlowcontrolModule';
import "./Home.less";

const { Content } = Layout;

const Home = ( props ) => (
    <Layout className="air-layout">
        <Head />
        <NavMenuContainer/>
        <Content>
            <Row className="no-margin" gutter={16}>
                <FlightsSortModule/>
                <FlowcontrolModule/>
            </Row>

        </Content>

    </Layout>
)

export default Home;

