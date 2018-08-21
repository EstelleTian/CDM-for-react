//航班起飞排序---菜单操作功能

import React from 'react';
import { Row, Col, Input, Checkbox } from 'antd';
import './TableMenu.less';
import {isValidVariable} from "utils/basic-verify";

const Search = Input.Search;

class TableMenu extends React.Component{
    constructor( props ){
        super(props);
        this.state = {
            autoScroll: props.autoScroll
        }
        this.onQuicklySearch = this.onQuicklySearch.bind(this);
        this.onAutoScrollChange = this.onAutoScrollChange.bind(this);
    }

    //输入框快速过滤
    onQuicklySearch( value ){
        // console.log(value);
        let val = value.trim();
        //存储
        const { updateTableConditionQuicklyFilters  } = this.props;
        updateTableConditionQuicklyFilters( val );
    }

    //自动滚动--变化事件
    onAutoScrollChange(e) {
        const checked = e.target.checked;
        this.setState({
            autoScroll: checked
        })
        const { updateTableConditionScroll } = this.props;
        updateTableConditionScroll( checked );
    }

    componentWillUpdate(){
        const curAutoScroll = this.props.autoScroll;
        const autoScroll = this.state.autoScroll;
        if( curAutoScroll != autoScroll ){
            this.setState({
                autoScroll: curAutoScroll
            })
        }
    };

    render(){
        const { generateInfo } = this.props;
        const { autoScroll } = this.state;
        const { ALL_NUM ='-', ARR_NUM='-', DEP_NUM='-', GROUND_NUM = '-', CNL_NUM = '-' } = generateInfo;
        return (
            <Col span={24} className="operation">
                <Col span={11} className="tools">
                    <Search
                        placeholder = "快速查询"
                        className = "quickly-search"
                        onSearch = { this.onQuicklySearch }
                        style = {{ width: 200 }}
                    />
                    <Checkbox
                        className = "auto-scroll-check"
                        checked = { autoScroll }
                        onChange={ this.onAutoScrollChange}
                    >航班自动定位（关闭后上下滚动滚轮加载更多）</Checkbox>
                </Col>
                <Col span={13} className="total">
                    <span>
                        <label> { GROUND_NUM }</label>
                        <span>未起飞</span>
                    </span>
                    <span>
                        <label> { DEP_NUM }</label>
                        <span>已起飞</span>
                    </span>
                    <span>
                        <label> { ARR_NUM }</label>
                        <span>已落地</span>
                    </span>
                    <span>
                        <label> { CNL_NUM }</label>
                        <span>已取消</span>
                    </span>

                    <span>
                        <label> { ALL_NUM }</label>
                        <span>总计</span>
                    </span>
                </Col>
            </Col>
        )
    }
};

export default TableMenu;