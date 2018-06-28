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
                <Col className="card" span={18}>
                    <Card title="航班起飞排序" bordered={true}>
                        <AirTable />
                    </Card>
                </Col>
                <Col className="card" span={6}>
                    <Card title="流控信息" bordered={true}>11111</Card>
                </Col>
            </Row>

        </Content>
    </Layout>
)

export default Home;

