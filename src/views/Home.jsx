import React, { Fragment} from 'react';
import { connect,  } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Layout, Card, Col, Row, Spin  } from 'antd'
import Head from "../layouts/Head";
import FlightsSortModule from '../components/FlightsSortModule/FlightsSortModule';
import FlowcontrolModule from '../components/FlowcontrolModule/FlowcontrolModule';
import Loader from '../components/Loader/Loader';
import "./Home.less";

const { Content } = Layout;

class HomePage extends React.Component{
    constructor( props ){
        super(props);
    }

    render() {
        const { flowGenerateTime, flightGenerateTime } = this.props;
        return (
            <Fragment >
                <Layout className="air-layout">
                    <Head />
                    <Content>
                        <Row className="no-margin" gutter={16}>
                            <FlightsSortModule/>
                            <FlowcontrolModule/>
                        </Row>

                    </Content>

                </Layout>

                {
                    (flowGenerateTime && flightGenerateTime ) ? null : <Loader />
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
    return ({
        flowGenerateTime,
        flightGenerateTime
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


