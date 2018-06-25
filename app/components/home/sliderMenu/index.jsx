import React from 'react'
import { Link } from 'react-router'
import { Menu, Icon} from 'antd'
import Logout from '../../logout'

const SliderMenu = ({sliderMenu, selectedMenuKeys}) => {
    const sessionMenu = sessionStorage.getItem("menuKey");
    if(sessionMenu){
        sliderMenu = [sessionMenu];
    }
    return(
        <Menu theme="dark" selectedKeys={sliderMenu} mode="inline"
              onClick={(item, key, keyPath)=>{
                  const skey = item.key;
                  sessionStorage.setItem("menuKey", skey);
                  selectedMenuKeys(skey)
             }}
        >
            <Menu.Item key="1">
                <Link to="/home/online-users"><Icon type="user" />用户在线列表</Link>
            </Menu.Item >
            <Menu.Item key="2">
                <Link to="/home/users"><Icon type="team" />用户列表</Link>
            </Menu.Item >
            <Menu.Item key="3">
                <Link to="/home/roles"><Icon type="solution" />角色列表</Link>
            </Menu.Item >
            <Menu.Item key="4">
                <Link to="/home/authorities"><Icon type="key" />权限列表</Link>
            </Menu.Item >
            <Menu.Item key="5">
                <Link to="/home/groups"><Icon type="fork" />组列表</Link>
            </Menu.Item >
            <Menu.Item key="6">
                <Logout />
            </Menu.Item >
        </Menu>

    )
}

export default SliderMenu