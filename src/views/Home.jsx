import React, { Fragment} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Layout, Col, Row } from 'antd';
import Head from "../layouts/Head";
import FlightsSortModule from 'components/FlightsSortModule/FlightsSortModule';
import SidebarContainer from 'components/Sidebar/SidebarContainer';
import DetailModuleContainer from 'components/DetailModule/DetailModuleContainer';
import Loader from 'components/Loader/Loader';
import QueueAnim from 'rc-queue-anim';
import "./Home.less";

const { Content } = Layout;

class HomePage extends React.Component{
    constructor( props ){
        super(props);
    }

    render() {
        const { flowGenerateTime, flightGenerateTime, sideBarShow, detailShow } = this.props;
        return (
            <Fragment >
                <Layout className="air-layout">
                    <Head />
                    <Content>
                        <Row className="no-margin" gutter={16}>
                            <Col
                                className="card all-flights-card bc-1"
                                span={ sideBarShow ? 18 : 24}
                            >
                                <FlightsSortModule/>

                            </Col>
                                { sideBarShow ?
                                    <SidebarContainer
                                        key = "siderBar"
                                    />
                                    : ""}
                        </Row>
                        <QueueAnim className="detail-anim"
                                   type = "bottom"
                        >
                            { detailShow ?
                                <DetailModuleContainer
                                    key = "detail"
                                    name = "flight"
                                />
                             : ""}
                        </QueueAnim>
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
        sideBarShow: show,
        detailShow: state.detailModalDatas.flight.show
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


