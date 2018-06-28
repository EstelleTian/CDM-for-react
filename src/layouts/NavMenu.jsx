import React from 'react';
import { Menu, Checkbox, Radio } from 'antd';
import $ from 'jquery';
import './NavMenu.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class NavMenu extends React.Component{
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this);

    }
    onClick = (e) => {
        console.log('click ', e);
        console.log('key ', e.key);
    }
    onOpenChange = (openKeys) => {
        console.log(openKeys);
        //修改其遮罩width从100%改为auto，导致表格滚动遮挡
        $(".ant-menu-submenu").parent().parent().width('auto');
    }
    render(){
        return (
            <Menu
                onClick={this.onClick}
                onOpenChange={this.onOpenChange}
                defaultSelectedKeys={['filter']}
                selectedKeys={['filter']}
                mode="horizontal"
                theme="dark"
            >
                <SubMenu
                    key="reset"
                    title={<span>重置</span>}
                ></SubMenu>
                <SubMenu
                    key="refresh"
                    title={<span>刷新</span>}
                ></SubMenu>
                <SubMenu
                    key="filter"
                    title={<span>快速过滤</span>}
                >
                    <MenuItemGroup title="屏蔽">
                        <Menu.Item key="setting:1"><Checkbox>已起飞</Checkbox></Menu.Item>
                        <Menu.Item key="setting:2"><Checkbox>已落地</Checkbox></Menu.Item>
                    </MenuItemGroup>
                    <MenuItemGroup title="时间范围">
                        <Menu.Item key="setting:3"><Radio>30分钟</Radio></Menu.Item>
                        <Menu.Item key="setting:4"><Radio>60分钟</Radio></Menu.Item>
                    </MenuItemGroup>
                </SubMenu>
            </Menu>

        )
    }
};

export default NavMenu;