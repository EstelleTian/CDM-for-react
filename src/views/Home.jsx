import React, { Fragment} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Layout, Col, Row, Drawer } from 'antd';
import Head from "../layouts/Head";
import FlightsSortModule from 'components/FlightsSortModule/FlightsSortModule';
import SidebarContainer from 'components/Sidebar/SidebarContainer';
import DetailModuleContainer from 'components/DetailModule/DetailModuleContainer';
import Loader from 'components/Loader/Loader';
import "./Home.less";

const { Content } = Layout;

class HomePage extends React.Component{
    constructor( props ){
        super(props);
    }

    render() {
        const { flowGenerateTime, flightGenerateTime, show } = this.props;
        return (
            <Fragment >
                <Layout className="air-layout">
                    <Head />
                    <Content>
                        <Row className="no-margin" gutter={16}>
                            <Col
                                className="card all-flights-card bc-1"
                                xs={24} sm={24} md={24} lg={24}
                                xl={ show ? 18 : 24}
                                xxl={ show ? 18 : 24}
                            >
                                <FlightsSortModule/>
                                <DetailModuleContainer
                                    name = "flight"
                                />
                            </Col>
                            {
                                show ? <SidebarContainer /> : ''
                            }

                        </Row>

                    </Content>

                </Layout>

                {
                    ( flightGenerateTime ) ? '' : <Loader />
                }


            </Fragment>

        )
    }
}

const mapStateToProps = ( state ) => {

    // 流控数据生成时间
    const {time:flowGenerateTime} = state.flowGenerateTime;
    // 航班数据生成时间
    const { time: flightGenerateTime  } = state.generateTime;

    // 侧边栏显示状态
    const { show } = state.sidebarConfig;
    return ({
        flowGenerateTime,
        flightGenerateTime,
        show,
    })
};

const mapDispatchTopProps = {
    // updateGenerateTime :  updateGenerateTime,
    // updateFlowGenerateTime : updateFlowGenerateTime,
};

const Home = connect(
    mapStateToProps,
    mapDispatchTopProps
)(HomePage);

export default withRouter( Home );


