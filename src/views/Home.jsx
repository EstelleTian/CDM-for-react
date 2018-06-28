import React from 'react';
import { Layout, Card, Col, Row } from 'antd'
import Head from "../layouts/Head";
import NavMenu from "../layouts/NavMenu";
import AirTable from '../views/AirTable'
import "./Home.less";

const { Content } = Layout;

const Home = ( props ) => (
    <Layout className="air-layout">
        <Head />
        <NavMenu/>
        <Content>
            <Row className="no-margin" gutter={16}>
                <Col className="card" xs={24} sm={24} md={24} lg={24} xl={18} xxl={18}>
                    <Card title="航班起飞排序"
                          className="all-flights"
                    >
                        <AirTable />
                    </Card>
                </Col>
                <Col className="card"  xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
                    <Card title="流控信息">11111</Card>
                </Col>
            </Row>

        </Content>
    </Layout>
)

export default Home;

