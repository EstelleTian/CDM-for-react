//流控信息---菜单操作功能

import React from 'react';
import { Col, Icon, Input, Select, Checkbox, Radio, Menu   } from 'antd';
import { isValidVariable } from '../../utils/basic-verify';


import './FlowcontrolHeader.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Search = Input.Search;

const options = [
    { label: '屏蔽长期', value: 'shield' },
];

class FlowcontrolHeader extends React.Component{
    constructor( props ){
        super(props);
        this.onChangePlaceType = this.onChangePlaceType.bind(this);
        this.onChangeShieldLong = this.onChangeShieldLong.bind(this);
        this.onChangeScope = this.onChangeScope.bind(this);
        this.onChangeOrder = this.onChangeOrder.bind(this);
    }

    // 流控类型变更
    onChangePlaceType (e){
        const { updateFlowcontrolConditionPlaceType } = this.props;
        updateFlowcontrolConditionPlaceType( e.target.value );
    }
    // 是否屏蔽长期流控变更
    onChangeShieldLong (e){
        const { updateFlowcontrolConditionShieldLong } = this.props;
        let flag = e.target.checked;
        updateFlowcontrolConditionShieldLong(flag);
    }

    // 流控范围变更
    onChangeScope (e){
        const { updateFlowcontrolConditionScope } = this.props;
        let scope = e.target.value;
        updateFlowcontrolConditionScope(scope);
    }
    // 流控排序规则变更
    onChangeOrder (e){
        const { updateFlowcontrolConditionOrderBy } = this.props;
        let value = e.target.value;
        updateFlowcontrolConditionOrderBy(value);
    }

    render(){
        const { placeType, shieldLong, scope, orderBy} = this.props;

        return (
            <Col span={24} className="header">
                <Col span={10} className="title" >
                    <span className="designation">流控信息</span>
                    {/*<span className="designation">{placeType}</span>*/}
                    {/*<span className="designation">{shieldLong.toString()}</span>*/}
                    {/*<span className="designation">{scope}</span>*/}
                    {/*<span className="designation">{orderBy}</span>*/}
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
                            title={<Icon type="filter" title="快速过滤"/>}
                        >
                            <MenuItemGroup title="屏蔽">
                                <Menu.Item>
                                    <Checkbox
                                        checked={ shieldLong }
                                        onChange={this.onChangeShieldLong}
                                    >屏蔽长期
                                    </Checkbox>
                                </Menu.Item>
                            </MenuItemGroup>

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

                            <MenuItemGroup title="类型">
                                <Menu.Item>
                                    <RadioGroup
                                        onChange={this.onChangePlaceType}
                                        value={placeType}
                                    >
                                        <Radio value={'ALL'}>全部流控</Radio>
                                        <Radio value={'AP'}>机场流控</Radio>
                                        <Radio value={'POINT'}>航路流控</Radio>
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

export default FlowcontrolHeader;