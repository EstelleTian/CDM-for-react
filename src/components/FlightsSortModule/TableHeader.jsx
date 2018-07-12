//航班起飞排序---菜单操作功能
import React from 'react';
import { Col, Menu } from 'antd';
import { TableColumns } from "../../utils/table-config";
import { convertData, getDisplayStyle, getDisplayStyleZh, getDisplayFontSize } from "../../utils/flight-grid-table-data-util";

import SubTable from '../SubTable/SubTable';
import './TableHeader.less';

class TableHeader extends React.Component{
    constructor( props ){
        super(props);
        this.onMenuTitleSelect = this.onMenuTitleSelect.bind(this);
        this.convertData = convertData.bind(this);
        this.getDisplayStyle = getDisplayStyle.bind(this);
        this.getDisplayStyleZh = getDisplayStyleZh.bind(this);
        this.getDisplayFontSize = getDisplayFontSize.bind(this);
        this.state = {
            expired: {
                show: false,
                x: 0,
                y:0
            },
            special: {
                show: false,
                x: 0,
                y:0
            },
            pool: {
                show: false,
                x: 0,
                y:0
            },
            alarm: {
                show: false,
                x: 0,
                y:0
            },
            todo: {
                show: false,
                x: 0,
                y:0
            },
        }
    }
    //导航栏目选中
    onMenuTitleSelect({ key, domEvent }){
        let { clientX = 0, clientY = 0 }  = domEvent;
        let show = this.state[key].show;
        this.setState({
            [key]: {
                show: !show,
                x: clientX - 90,
                y: 0
            }
        });

    }

    getPoolTableDatas(){

    }

    render(){
        const { generateTime = {}, subTableDatas = {}} = this.props;
        const poolData = subTableDatas.pool;
        const { time = '' } = generateTime;
        const { expired, special, pool, alarm, todo } = this.state;

        const scrollX = 620;

        return (
            <Col span={24} className="header">
                <div className="title">
                    <span>航班起飞排序</span>
                    {
                        ( time ) ? <span>{time}</span> : ''
                    }
                </div>
                <div className="flight-menu">
                <Menu
                    mode="horizontal"
                    theme="dark"
                    multiple={ true }
                    onClick={ this.onMenuTitleSelect }
                >
                    <Menu.Item key="expired" title="失效航班">失效航班</Menu.Item>
                    <Menu.Item key="special" title="特殊航班">特殊航班</Menu.Item>
                    <Menu.Item key="pool" title="等待池">等待池</Menu.Item>
                    <Menu.Item key="alarm" title="告警信息">告警信息</Menu.Item>
                    <Menu.Item key="todo" title="待办事项">待办事项</Menu.Item>
                </Menu>
                </div>
                {/*{*/}
                    {/*( expired.show ) ?*/}
                        {/*<SubTable*/}
                           {/*titleName = "失效航班"*/}
                           {/*key = "expired"*/}
                           {/*tableDatas = { [] }*/}
                           {/*tableColumns = { [] }*/}
                           {/*scrollX = { scrollX }*/}
                           {/*x = {expired.x}*/}
                           {/*y = {expired.y}*/}
                        {/*/> : ""*/}
                {/*}*/}
                {
                    ( pool.show ) ?
                        <SubTable
                            titleName = "等待池航班"
                            key = "pool"
                            tableDatas = { Object.values( poolData.datas ) }
                            tableColumnsObj = { TableColumns( poolData.colPoolDisplay, poolData.colNames, poolData.colTitle ) }
                            scrollX = { scrollX }
                            x = {pool.x}
                            y = {pool.y}
                        /> : ""
                }

            </Col>
        )
    }
};

export default TableHeader;