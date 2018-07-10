import React from 'react';
import { connect } from 'react-redux';
import { Menu, Checkbox, Radio, Icon, Row, Col } from 'antd';
import $ from 'jquery';
import './NavMenu.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const options = [
    { label: '已起飞', value: 'dep' },
    { label: '已落地', value: 'arr' },
    { label: '已取消', value: 'cnl' },
    { label: '未发FPL报', value: 'nofpl' },
];

class NavMenu extends React.Component{
    constructor(props){
        super(props);
        this.onOpenChange = this.onOpenChange.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
        // this.onTitleClick = this.onTitleClick.bind(this);

    }
    onOpenChange(openKeys){
        //修改其遮罩width从100%改为auto，导致表格滚动遮挡
        // $(".ant-menu-submenu").parent().parent().width('auto');
    };
    onRadioChange(e){
        console.log('radio checked', e.target.value);
        this.props.updateScopeFilter( e.target.value );

    };
    onCheckboxChange( checkedValues ){
        console.log('checked = ', checkedValues);
        this.props.updateStatusFilter( checkedValues );
    };
    // onTitleClick({ key, domEvent }){
    //     console.log(key);
    //     switch (key){
    //         case 'reset' : {
    //             //清空过滤条件
    //             this.props.updateTableConditionQuicklyFilters("");
    //             break;
    //         }
    //         default:
    //             break;
    //     }
    //
    // }
    render(){
        const { filterMatches } = this.props;
        return (
            <Row>
                <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
                    <Menu
                        onOpenChange={this.onOpenChange}
                        mode="horizontal"
                        theme="dark"
                        className="menu-left"
                    >
                        <SubMenu
                            key="filter"
                            title={<Icon type="filter" title="快速过滤"/>}
                        >
                            <MenuItemGroup title="屏蔽">
                                <Menu.Item>
                                    <CheckboxGroup options={options} onChange={this.onCheckboxChange} />
                                </Menu.Item>
                            </MenuItemGroup>
                            <MenuItemGroup title="时间范围">
                                <Menu.Item>
                                    <RadioGroup
                                        onChange={this.onRadioChange}
                                        value={filterMatches.scopeFilter}
                                    >
                                        <Radio value={30}>30分钟</Radio>
                                        <Radio value={45}>45分钟</Radio>
                                        <Radio value={60}>60分钟</Radio>
                                        <Radio value={120}>120分钟</Radio>
                                        <Radio value={"all"}>全部</Radio>
                                    </RadioGroup>
                                </Menu.Item>
                            </MenuItemGroup>
                        </SubMenu>
                        {/*<SubMenu*/}
                        {/*key="reset"*/}
                        {/*title={<Icon type="sync" title="重置"/>}*/}
                        {/*onTitleClick={ this.onTitleClick }*/}
                        {/*></SubMenu>*/}
                        {/*<SubMenu*/}
                        {/*key="refresh"*/}
                        {/*title={<Icon type="reload" title="刷新"/>}*/}
                        {/*onTitleClick={ this.onTitleClick }*/}
                        {/*></SubMenu>*/}
                    </Menu>
                </Col>
                <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={18}>
                    <Menu
                    onOpenChange={this.onOpenChange}
                    mode="horizontal"
                    theme="dark"
                    className="menu-right"
                >
                    <SubMenu
                        title="参数配置"
                    >
                        <Menu.Item key="system-config">系统参数配置</Menu.Item>
                        <Menu.Item key="operation-config">运行参数配置</Menu.Item>
                        <Menu.Item key="runway-taxi-manage">跑道滑行配置</Menu.Item>
                        <Menu.Item key="taxi-deice-manage">除冰参数管理</Menu.Item>
                        <Menu.Item key="passtime-config-manage">过站时间管理</Menu.Item>
                        <SubMenu title="航段经验时间">
                            <Menu.Item key="trajectory-passtime-statistics-manage">静态航段时间查询</Menu.Item>
                            <Menu.Item key="trajectory-passtime-statistics-count">静态航段时间计算</Menu.Item>
                            <Menu.Item key="trajectory-passtime-statistics-query">动态航段时间查询</Menu.Item>
                            <Menu.Item key="city-pair-route-manage">城市对航路查询</Menu.Item>
                        </SubMenu>
                        <SubMenu title="显示参数配置">
                            <Menu.Item key="icao-iata-switch">ICAO/IATA</Menu.Item>
                            <Menu.Item key="grid-table-font-size">表格字体配置</Menu.Item>
                            <Menu.Item key="grid-table-column">表格列序配置</Menu.Item>
                            <Menu.Item key="grid-table-style">表格样式配置</Menu.Item>
                            <Menu.Item key="highchart-style">统计样式配置</Menu.Item>
                        </SubMenu>
                    </SubMenu>
                    <SubMenu
                        title="航班计划"
                    >
                        <Menu.Item key="cdm-flight-collaborate">协调记录</Menu.Item>
                        <Menu.Item key="cdm-fme-today-manage">计划管理</Menu.Item>
                        <Menu.Item key="slot-exchange">时隙交换</Menu.Item>
                        <Menu.Item key="teles-details">查询航班报文</Menu.Item>
                    </SubMenu>
                    <SubMenu key="all-alternate-management" title="备降场管理" />
                    <SubMenu
                        key="notice-info"
                        title="通告信息"
                    >
                        <Menu.Item key="notice-info-publish">发布通告信息</Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="runway-config"
                        title="跑道配置"
                    >
                        <Menu.Item key="runway-config-edit">默认跑道配置</Menu.Item>
                        <Menu.Item key="runway-config-dynamic-publish">动态跑道配置</Menu.Item>
                        <Menu.Item key="regular-runway-config">默认跑道配置</Menu.Item>
                        <Menu.Item key="runway-template-manage">跑道模板管理</Menu.Item>
                        <Menu.Item key="snow-deicing">雪情配置</Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="flowcontrol-info"
                        title="流控信息"
                    >
                        <Menu.Item key="ap-publish">发布机场受限</Menu.Item>
                        <Menu.Item key="ap-gs-dep-publish">发布低能见度受限</Menu.Item>
                        <Menu.Item key="point-publish">发布航路受限</Menu.Item>
                        <Menu.Item key="composite-publish">发布复合航路受限</Menu.Item>
                        <Menu.Item key="ldr-publish">发布大面积延误恢复</Menu.Item>
                        <Menu.Item key="translation-publish">发布大面积延误</Menu.Item>
                        <Menu.Item key="template-manage">流控信息模板管理</Menu.Item>
                        <Menu.Item key="impact-flights-export">流控信息导出</Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="restriction-info"
                        title="限制信息"
                    >
                        <Menu.Item key="restriction-deice-publish">发布除冰限制</Menu.Item>
                    </SubMenu>
                        <SubMenu key="navigator-expired" title="失效航班" />
                        <SubMenu key="navigator-special" title="特殊航班" />
                        <SubMenu key="navigator-pool" title="等待池" />
                        <SubMenu key="navigator-alarm" title="告警信息" />
                        <SubMenu key="navigator-flight-search" title="航班查询" />
                        <SubMenu key="navigator-todo" title="待办事项" />
                </Menu>
                </Col>
            </Row>

        )
    }
};

export default NavMenu;