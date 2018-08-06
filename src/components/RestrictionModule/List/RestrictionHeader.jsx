//除冰限制信息列表---菜单操作功能

import React from 'react';
import { Col, Icon, Input, Select, Checkbox, Radio, Menu   } from 'antd';
import './RestrictionHeader.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Search = Input.Search;

class RestrictionHeader extends React.Component{
    constructor( props ){
        super(props);
        this.onChangeScope = this.onChangeScope.bind(this);
        this.onChangeOrder = this.onChangeOrder.bind(this);
    }

    // 除冰限制范围变更
    onChangeScope (e){
        const { updateRestrictionConditionScope } = this.props;
        let scope = e.target.value;
        updateRestrictionConditionScope(scope);
    }
    // 除冰限制列表排序规则变更
    onChangeOrder (e){
        const { updateRestrictionConditionOrderBy } = this.props;
        let value = e.target.value;
        updateRestrictionConditionOrderBy(value);
    }

    render(){
        const { scope, orderBy} = this.props;
        return (
            <Col span={24} className="header">
                <Col span={10} className="title" >
                    <span className="designation">除冰信息</span>
                </Col>
                <Col span={10} className="tools">
                </Col>
                <Col span={4} className="tools">
                    <Menu
                        mode="horizontal"
                        theme="dark"
                        selectable={false}
                    >
                        <SubMenu
                            key="flowcontrol-filter"
                            title={<i className="iconfont icon-filter" title="快速过滤"/>}
                        >

                            <MenuItemGroup title="范围">
                                <Menu.Item>
                                    <RadioGroup
                                        onChange={this.onChangeScope}
                                        value={ scope }
                                    >
                                        <Radio value={"ALL"}>今日全部</Radio>
                                        <Radio value={"EFFECTIVE"}>正在生效</Radio>

                                    </RadioGroup>
                                </Menu.Item>
                            </MenuItemGroup>

                            <MenuItemGroup title="排序">
                                <Menu.Item>
                                    <RadioGroup
                                        onChange={this.onChangeOrder}
                                        value={orderBy}
                                    >
                                        <Radio value={'TIME'}>时间</Radio>
                                        <Radio value={'LEVEL'}>程度</Radio>
                                    </RadioGroup>
                                </Menu.Item>
                            </MenuItemGroup>

                        </SubMenu>
                    </Menu>
                </Col>

            </Col>
        )
    }
};

export default RestrictionHeader;