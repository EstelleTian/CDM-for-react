//航班起飞排序---菜单操作功能

import React from 'react';
import { Row, Col, Input, Checkbox } from 'antd';
import './TableMenu.less';
import {isValidVariable} from "../../utils/basic-verify";

const Search = Input.Search;

class TableMenu extends React.Component{
    constructor( props ){
        super(props);
        this.onQuicklySearch = this.onQuicklySearch.bind(this);
        this.onAutoScrollChange = this.onAutoScrollChange.bind(this);
    }

    //输入框快速过滤
    onQuicklySearch( value ){
        // console.log(value);
        let val = value.trim();
        if(isValidVariable( val )){
            //存储
            const { updateTableConditionQuicklyFilters  } = this.props;
            updateTableConditionQuicklyFilters( val );
        }
    }

    //自动滚动--变化事件
    onAutoScrollChange(e) {
        const checked = e.target.checked;
        const { updateTableConditionScroll } = this.props;
        updateTableConditionScroll( checked );
    }

    render(){
        const { isAutoScroll, generateInfo } = this.props;

        const { ALL_NUM ='',
            ARR_NUM='',
            DEP_NUM='',
            GROUND_NUM = ''
            } = generateInfo;
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
                        checked = { isAutoScroll }
                        onChange={ this.onAutoScrollChange}
                    >自动滚动</Checkbox>
                </Col>
                <Col span={12} className="total">

                    <span>未起飞 <label> { GROUND_NUM }</label>架次</span>
                    <span>已起飞 <label> { DEP_NUM }</label>架次</span>
                    <span>已落地 <label> { ARR_NUM }</label>架次</span>
                    <span>总计 <label> { ALL_NUM }</label>架次</span>
                </Col>
            </Col>
        )
    }
};

export default TableMenu;