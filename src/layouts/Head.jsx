import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Layout, Row, Col } from 'antd'
import { userLogout } from '../views/LoginRedux'
import NavMenuContainer from "./NavMenuContainer";
import TableHeaderContainer from '../components/FlightsSortModule/TableHeaderContainer';
import './Head.less'

const { Header } = Layout;

class Head extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const { systemConfig } = this.props;
        const {systemElem,systemName} = systemConfig;
        return (
            <Header className="air-header">
                <Row className="no-margin" gutter={8}>
                    <div className="system-title">{systemElem}{systemName}</div>
                    <div className='navbar'>
                        <TableHeaderContainer/>
                        <NavMenuContainer/>
                    </div>
                </Row>

            </Header>
        )
    }

}

const mapStateToProps = ( state ) => ({
    systemConfig : state.systemConfig
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