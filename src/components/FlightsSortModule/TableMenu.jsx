//航班起飞排序---菜单操作功能

import React from 'react';
import { Row, Col, Input, Checkbox } from 'antd';
import './TableMenu.less';

const Search = Input.Search;

class TableMenu extends React.Component{
    constructor( props ){
        super(props);
        this.onQuicklySearch = this.onQuicklySearch.bind(this);
        this.onAutoScrollChange = this.onAutoScrollChange.bind(this);
    }

    //输入框快速过滤
    onQuicklySearch( value ){
        console.log(value);
        //存储到
    }

    //自动滚动--变化事件
    onAutoScrollChange(e) {
        console.log(`checked = ${e.target.checked}`);
        const checked = e.target.checked;
        const { updateTableAutoScroll } = this.props;
        updateTableAutoScroll( checked );
    }

    render(){
        const { isAutoScroll, totalInfo  } = this.props;
        const { generateTime = '' } = totalInfo;
        const { generateInfo = {} } = totalInfo;
        const { ALL_NUM ='',
            ARR_NUM='',
            CHART_CNL_NUM='',
            CHART_DLA_NUM='',
            CHART_FPL_NUM='',
            CNL_NUM='',
            CPL_NUM='',
            DEP_NUM='',
            FPL_NUM='',
            SCH_NUM='' } = generateInfo;

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
                    <label>数据生成时间{generateTime}</label>
                    <label>未起飞XXX架次</label>
                    <label>已起飞{DEP_NUM}架次</label>
                    <label>已落地{ARR_NUM}架次</label>
                    <label>总计{ALL_NUM}架次</label>
                </Col>
            </Col>
        )
    }
};

export default TableMenu;