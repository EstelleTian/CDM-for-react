import React from 'react';
import { Menu, Checkbox, Radio } from 'antd';
import './NavMenu.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class NavMenu extends React.Component{
    handleClick = (e) => {
        console.log('click ', e);
        console.log('key ', e.key);
    }
    render(){
        return (
            <Menu
                onClick={this.handleClick}
                selectedKeys={['mail']}
                mode="horizontal"
            >
                <SubMenu title={<span>快速过滤</span>}>
                    <MenuItemGroup title="屏蔽">
                        <Menu.Item key="setting:1"><Checkbox>已起飞</Checkbox></Menu.Item>
                        <Menu.Item key="setting:2"><Checkbox>已落地</Checkbox></Menu.Item>
                    </MenuItemGroup>
                    <MenuItemGroup title="时间范围">
                        <Menu.Item key="setting:3"><Radio>30分钟</Radio></Menu.Item>
                        <Menu.Item key="setting:4"><Radio>60分钟</Radio></Menu.Item>
                    </MenuItemGroup>
                </SubMenu>
                <Menu.Item key="mail">
                    高级查询
                </Menu.Item>
            </Menu>
        )
    }
};

export default NavMenu;