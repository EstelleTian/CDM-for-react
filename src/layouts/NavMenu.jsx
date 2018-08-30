import React from 'react';
import { connect } from 'react-redux';
import { Menu, Checkbox, Radio, Icon, message} from 'antd';
import { request } from 'utils/request-actions';
import { logoutUrl } from 'utils/request-urls';
import CreateLayer from "components/CreateLayer/CreateLayer";
import FlowcontrolDialogContainer from "components/FlowcontrolModule/Dialog/APFlowcontrolDialog/FlowcontrolDialogContainer";
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
        this.onRadioChange = this.onRadioChange.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
        this.onMenuTitleSelect = this.onMenuTitleSelect.bind(this);
        this.onCloseBtn = this.onCloseBtn.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleUpdateSidebar = this.handleUpdateSidebar.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            apPublish: {
                show: false,
            },
            apGSDepPublish : {
                show: false,
            }
        }

    }
    // 处理登出
    handleLogout(){
        const {  loginUserInfo } = this.props;
        const {  userId } = loginUserInfo;
        const params = {
            "userId":userId,
        };
        request(logoutUrl,'POST',params,this.logout);
    }
    // 用户登出
    logout(res){
        const {  userLogout, history } = this.props;
        const { status = 0 } = res;
        const warning = () => {
            message.warning('登出失败,请稍后重试');
        };
        if(200 == status*1){ // 成功
            // 用户登出
            userLogout();
            // 跳转到主页面
            history.push('/');
        }else { // 失败
            warning();
        }
    }

    //过滤--单选--时间范围
    onRadioChange(e){
        // console.log('radio checked', e.target.value);
        this.props.updateScopeFilter( e.target.value );

    };
    //过滤--多选--航班状态
    onCheckboxChange( checkedValues ){
        // console.log('checked = ', checkedValues);
        this.props.updateStatusFilter( checkedValues );
    };
    //导航栏目选中
    onMenuTitleSelect({item, key, domEvent, keyPath }){
        let obj = this.state[key];
        if(obj){
            let show = this.state[key].show;
            this.setState({
                [key]: {
                    show: !show,
                }
            });
        }
        if('toggle-siderbar' == key // 侧边栏切换显示按钮
            || 'flowcontrol-info' == key // 流控
            || 'restriction-info' == key // 限制信息
            || 'notice-info' == key // 通告信息
        ){
            this.handleUpdateSidebar(key);
        }

    }

    // 处理更新侧边栏
    handleUpdateSidebar(selectKey){
        const { updateSidebarKey, updateSidebarStatus, sidebarConfig } = this.props;
        const {show, key} = sidebarConfig;
        // 侧边栏切换显示按钮
        if(selectKey == 'toggle-siderbar'){
            updateSidebarStatus(!show);
        }else {
            // 若侧边栏当前未显示，则切换侧边栏为显示状态
            if(!show){
                updateSidebarStatus(true);
            }
            // 若选中的菜单栏key值与侧边栏当前显示的模块key值不同,则切换显示模块
            if(selectKey != key ){
                updateSidebarKey(selectKey);
            }
        }




    }

    //当点击关闭按钮时，type: 类型
    onCloseBtn( type ){
        this.setState({
            [type]: {
                show: false
            }
        });
    }
    //获取过滤条件判断是否计数，用于判断是否显示过滤提示红点
    getFilterCount() {
        const { filterMatches = {} } = this.props;
        const { scopeFilter = "all", statusFilter = [] } = filterMatches;
        let count = statusFilter.length;
        if (scopeFilter != 'all') {
            count++;
        }
        return count;
    }

    render(){
        const { filterMatches, loginUserInfo, sidebarConfig, } = this.props;
        const count = this.getFilterCount();
        const { show } = sidebarConfig;
        const { airports } = loginUserInfo;
        const { apPublish, apGSDepPublish } = this.state;
        return (
            <div className="opt-menu-canvas">
                <Menu
                    mode="horizontal"
                    theme="dark"
                    className="menu-right"
                >
                    <SubMenu key="toggle-siderbar"
                             title={
                                 <span title={ show ? '关闭侧边栏' : '开启侧边栏'}>
                                    <Icon
                                        className="trigger"
                                        type={ show ? 'menu-unfold' : 'menu-fold'}
                                    />
                                </span>
                             }
                             onTitleClick={ this.onMenuTitleSelect } />
                    <SubMenu key="navigator-flight-search"
                             title={
                                 <span title="航班查询">
                                    <i className="iconfont icon-search2"></i>
                                </span>
                             }
                             onTitleClick={ this.onMenuTitleSelect } />
                    <SubMenu
                        key="flowcontrol-info"
                        title={
                            <span title="流控信息">
                                <i className="iconfont icon-flowcontrol4"></i>
                            </span>
                        }
                        onTitleClick={ this.onMenuTitleSelect }
                    >
                        <Menu.Item
                            key="apPublish"
                            onClick= {this.onMenuTitleSelect}
                        >
                            <label>发布机场受限</label>
                        </Menu.Item>
                        <Menu.Item
                            key="apGSDepPublish"
                            onClick= {this.onMenuTitleSelect}
                        >
                            <label>发布低能见度受限</label>
                        </Menu.Item>
                        <Menu.Item key="point-publish"><label>发布航路受限</label></Menu.Item>
                        <Menu.Item key="composite-publish"><label>发布复合航路受限</label></Menu.Item>
                        <Menu.Item key="ldr-publish"><label>发布大面积延误恢复</label></Menu.Item>
                        <Menu.Item key="translation-publish"><label>发布大面积延误</label></Menu.Item>
                        <Menu.Item key="template-manage"><label>流控信息模板管理</label></Menu.Item>
                        <Menu.Item key="impact-flights-export"><label>流控信息导出</label></Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="runway-config"
                        title={
                            <span title="跑道配置">
                                <i className="iconfont icon-runway"></i>
                            </span>
                        }
                        onTitleClick={ this.onMenuTitleSelect }
                    >
                        <Menu.Item key="runway-config-edit"><label>默认跑道配置</label></Menu.Item>
                        <Menu.Item key="runway-config-dynamic-publish"><label>动态跑道配置</label></Menu.Item>
                        <Menu.Item key="regular-runway-config"><label>默认跑道配置</label></Menu.Item>
                        <Menu.Item key="runway-template-manage"><label>跑道模板管理</label></Menu.Item>
                        <Menu.Item key="snow-deicing"><label>雪情配置</label></Menu.Item>
                    </SubMenu>
                    <SubMenu
                        title={
                            <span title="参数配置">
                                    <i className="iconfont icon-config2"></i>
                                </span>
                        }
                    >
                        <Menu.Item key="system-config"><label>系统参数配置</label></Menu.Item>
                        <Menu.Item key="operation-config"><label>运行参数配置</label></Menu.Item>
                        <Menu.Item key="runway-taxi-manage"><label>跑道滑行配置</label></Menu.Item>
                        <Menu.Item key="taxi-deice-manage"><label>除冰参数管理</label></Menu.Item>
                        <Menu.Item key="passtime-config-manage"><label>过站时间管理</label></Menu.Item>
                        <SubMenu title="航段经验时间">
                            <Menu.Item key="trajectory-passtime-statistics-manage"><label>静态航段时间查询</label></Menu.Item>
                            <Menu.Item key="trajectory-passtime-statistics-count"><label>静态航段时间计算</label></Menu.Item>
                            <Menu.Item key="trajectory-passtime-statistics-query"><label>动态航段时间查询</label></Menu.Item>
                            <Menu.Item key="city-pair-route-manage"><label>城市对航路查询</label></Menu.Item>
                        </SubMenu>
                        <SubMenu title="显示参数配置">
                            <Menu.Item key="icao-iata-switch"><label>ICAO/IATA</label></Menu.Item>
                            <Menu.Item key="grid-table-font-size"><label>表格字体配置</label></Menu.Item>
                            <Menu.Item key="grid-table-column"><label>表格列序配置</label></Menu.Item>
                            <Menu.Item key="grid-table-style"><label>表格样式配置</label></Menu.Item>
                            <Menu.Item key="highchart-style"><label>统计样式配置</label></Menu.Item>
                        </SubMenu>
                    </SubMenu>
                    <SubMenu
                        title={
                            <span title="航班计划">
                                <i className="iconfont icon-wodejihua"></i>
                            </span>
                        }
                    >
                        <Menu.Item key="cdm-flight-collaborate"><label>协调记录</label></Menu.Item>
                        <Menu.Item key="cdm-fme-today-manage"><label>计划管理</label></Menu.Item>
                        <Menu.Item key="slot-exchange"><label>时隙交换</label></Menu.Item>
                        <Menu.Item key="teles-details"><label>查询航班报文</label></Menu.Item>
                    </SubMenu>
                    <SubMenu key="all-alternate-management"
                             title={
                                 <span title="备降场管理">
                                    <i className="iconfont icon-beijiangchang"></i>
                                </span>
                             }
                    />
                    <SubMenu
                        key="notice-info"
                        title={
                            <span title="通告信息">
                                <i className="iconfont icon-tonggao"></i>
                            </span>
                        }
                        onTitleClick={ this.onMenuTitleSelect }
                    >
                        <Menu.Item key="notice-info-publish"><label>发布通告信息</label></Menu.Item>
                    </SubMenu>

                    <SubMenu
                        key="restriction-info"
                        title={
                            <span title="限制信息">
                                <i className="iconfont icon-guanli"></i>
                            </span>
                        }
                        onTitleClick={ this.onMenuTitleSelect }
                    >
                        <Menu.Item key="restriction-deice-publish">发布除冰限制</Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="setting"
                        title={
                            <span>
                                <Icon type="user" /> {loginUserInfo.username || "未登录" }
                            </span>
                        }
                    >
                        <Menu.Item key="help">
                            <label><Icon type="book" />帮助手册</label>
                        </Menu.Item>
                        <Menu.Item key="history">
                            <label><Icon type="api" />历史查询</label>
                        </Menu.Item>
                        <Menu.Item key="resetPwd">
                            <label><Icon type="key" />修改密码</label>
                        </Menu.Item>
                        <Menu.Item key="logout" onClick={this.handleLogout} >
                            <label ><Icon type="logout" />登出</label>
                        </Menu.Item>

                    </SubMenu>

                </Menu>
                {
                    (apPublish.show) ?
                        <CreateLayer
                            className="flowcontol-layer"
                        >
                            <FlowcontrolDialogContainer
                                titleName="发布机场受限"
                                type="apPublish"
                                clickCloseBtn={ this.onCloseBtn }
                                x = { 300 }
                                y = { 60 }
                            />
                        </CreateLayer>

                        : ''
                }
                {/*{*/}
                    {/*(apGSDepPublish.show) ?*/}
                        {/*<DraggableDialog*/}
                            {/*titleName="发布低能见度受限"*/}
                            {/*type="apGSDepPublish"*/}
                            {/*width={ 1200 }*/}
                            {/*clickCloseBtn={ this.onCloseBtn }*/}
                        {/*>*/}
                            {/*测试2*/}
                            {/*<p>dddddd</p>*/}
                        {/*</DraggableDialog> : ''*/}
                {/*}*/}
            </div>

        )
    }
};

export default NavMenu;