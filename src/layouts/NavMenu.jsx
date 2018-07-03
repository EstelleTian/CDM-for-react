import React from 'react';
import { connect } from 'react-redux';
import { updateScopeFilter, updateStatusFilter } from '../views/HomeRedux'
import { Menu, Checkbox, Radio, Icon } from 'antd';
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

    }
    onOpenChange = (openKeys) => {
        //修改其遮罩width从100%改为auto，导致表格滚动遮挡
        $(".ant-menu-submenu").parent().parent().width('auto');
    };
    onRadioChange = (e) => {
        console.log('radio checked', e.target.value);
        this.props.updateScopeFilter( e.target.value );

    };
    onCheckboxChange = ( checkedValues ) => {
        console.log('checked = ', checkedValues);
        this.props.updateStatusFilter( checkedValues );
    };
    render(){
        const { filterMatches } = this.props;
        return (
            <Menu
                onOpenChange={this.onOpenChange}
                mode="horizontal"
                theme="dark"
                multiple={ true }
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
                <SubMenu
                    key="reset"
                    title={<Icon type="sync" title="重置"/>}
                ></SubMenu>
                <SubMenu
                    key="refresh"
                    title={<Icon type="reload" title="刷新"/>}
                ></SubMenu>
            </Menu>

        )
    }
};

const mapStateToProps = ( state ) => ({
    filterMatches : state.filterMatches
})

const mapDispatchToProps = () => ({
    updateScopeFilter,
    updateStatusFilter
})
//导航栏容器
const NavMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NavMenu);


export default NavMenuContainer;