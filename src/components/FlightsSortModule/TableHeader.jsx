//航班起飞排序---菜单操作功能
import React from 'react';
import $ from 'jquery';
import { Col, Menu, Badge } from 'antd';
import { TableColumns } from "../../utils/table-config";
import { convertData, getDisplayStyle, getDisplayStyleZh, getDisplayFontSize } from "../../utils/flight-grid-table-data-util";

import SubTable from '../SubTable/SubTable';
import './TableHeader.less';

class TableHeader extends React.Component{
    constructor( props ){
        super(props);
        this.onMenuTitleSelect = this.onMenuTitleSelect.bind(this);
        this.onCloseBtn = this.onCloseBtn.bind(this);
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

    //当点击关闭按钮时，type: 表格类型
    onCloseBtn( type ){
        this.setState({
            [type]: {
                show: false
            }
        });
        //去掉menu的选中状态
        $(".flight-menu li." + type).removeClass("ant-menu-item-selected");
    }

    render(){
        const { generateTime = {}, subTableDatas = {}} = this.props;
        const poolData = subTableDatas.pool;
        const alarmData = subTableDatas.alarm;
        const expiredData = subTableDatas.expired;
        const specialData = subTableDatas.special;
        const todoData = subTableDatas.todo;
        const { time = '' } = generateTime;
        const { expired, special, pool, alarm, todo } = this.state;

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
                    <Menu.Item key="expired" title="失效航班" className="expired">
                        <Badge count={ Object.keys( expiredData.datas || {} ).length } className="badge-icon">
                            <span>失效航班</span>
                        </Badge>
                    </Menu.Item>
                    <Menu.Item key="special" title="特殊航班" className="special">
                        <Badge count={ Object.keys( specialData.datas || {} ).length } className="badge-icon">
                            <span>特殊航班</span>
                        </Badge>
                    </Menu.Item>
                    <Menu.Item key="pool" title="等待池" className="pool">
                        <Badge count={ Object.keys( poolData.datas || {} ).length } className="badge-icon">
                            <span>等待池</span>
                        </Badge>
                    </Menu.Item>
                    <Menu.Item key="alarm" title="告警信息" className="alarm">
                        <Badge count={ Object.keys( alarmData.datas || {} ).length } className="badge-icon">
                            <span>告警信息</span>
                        </Badge>
                    </Menu.Item>
                    <Menu.Item key="todo" title="待办事项" className="todo">
                        <Badge count={ Object.keys( todoData.datas || {} ).length } className="badge-icon">
                            <span>待办事项</span>
                        </Badge>
                    </Menu.Item>
                </Menu>
                </div>
                {
                    ( expired.show ) ?
                        <SubTable
                            titleName = "失效航班"
                            key = "expired"
                            type = "expired"
                            tableDatas = { Object.values( expiredData.datas || {} ) }
                            tableColumnsObj = { TableColumns( "expired", expiredData.colDisplay, expiredData.colNames, expiredData.colTitle ) }
                            x = {expired.x}
                            y = {expired.y}
                            clickCloseBtn = { this.onCloseBtn }
                        /> : ""
                }
                {
                    ( pool.show ) ?
                        <SubTable
                            titleName = "等待池航班"
                            key = "pool"
                            type = "pool"
                            tableDatas = { Object.values( poolData.datas || {} ) }
                            tableColumnsObj = { TableColumns( "pool", poolData.colDisplay, poolData.colNames, poolData.colTitle ) }
                            x = {pool.x}
                            y = {pool.y}
                            clickCloseBtn = { this.onCloseBtn }
                        /> : ""
                }
                {
                    ( alarm.show ) ?
                        <SubTable
                            titleName = "告警航班"
                            key = "alarm"
                            type = "alarm"
                            tableDatas = { Object.values( alarmData.datas || {} ) }
                            tableColumnsObj = { TableColumns( "alarm", alarmData.colDisplay, alarmData.colNames, alarmData.colTitle ) }
                            x = {alarm.x}
                            y = {alarm.y}
                            clickCloseBtn = { this.onCloseBtn }
                        /> : ""
                }
                {
                    ( special.show ) ?
                        <SubTable
                            titleName = "特殊航班"
                            key = "special"
                            type = "special"
                            tableDatas = { Object.values( specialData.datas || {} ) }
                            tableColumnsObj = { TableColumns( "special", specialData.colDisplay, specialData.colNames, specialData.colTitle ) }
                            x = {special.x}
                            y = {special.y}
                            clickCloseBtn = { this.onCloseBtn }
                        /> : ""
                }
                {
                    ( todo.show ) ?
                        <SubTable
                            titleName = "待办事项"
                            key = "todo"
                            type = "todo"
                            tableDatas = { Object.values( todoData.datas || {} ) }
                            tableColumnsObj = { TableColumns( "todo", todoData.colDisplay, todoData.colNames, todoData.colTitle ) }
                            x = {todo.x}
                            y = {todo.y}
                            clickCloseBtn = { this.onCloseBtn }
                        /> : ""
                }

            </Col>
        )
    }
};

export default TableHeader;