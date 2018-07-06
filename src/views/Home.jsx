import React from 'react';
import { Layout, Card, Col, Row } from 'antd'
import Head from "../layouts/Head";
import NavMenuContainer from "../layouts/NavMenu";
import FlightsSortModule from '../components/FlightsSortModule/FlightsSortModule';
import "./Home.less";

const { Content } = Layout;

const Home = ( props ) => (
    <Layout className="air-layout">
        <Head />
        <NavMenuContainer/>
        <Content>
            <Row className="no-margin" gutter={16}>
                <FlightsSortModule/>
                <Col className="card"  xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
                    <Card title="流控信息">11111</Card>
                </Col>
            </Row>

        </Content>
    </Layout>
)

export default Home;

