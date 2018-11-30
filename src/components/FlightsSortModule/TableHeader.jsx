//航班起飞排序---菜单操作功能
import React from 'react';
import $ from 'jquery';
import { Col, Menu, Badge } from 'antd';
import { TableColumns } from "utils/table-config";
import { convertData, getDisplayStyle, getDisplayStyleZh, getDisplayFontSize } from "utils/flight-grid-table-data-util";
import  CreateLayer from 'components/CreateLayer/CreateLayer'
import SubTable from '../SubTable/SubTable';
import './TableHeader.less';

class TableHeader extends React.Component{
    constructor( props ){
        super(props);
        this.onMenuTitleSelect = this.onMenuTitleSelect.bind(this);
        this.onCloseBtn = this.onCloseBtn.bind(this);
        this.convertData = convertData.bind(this);
        this.getDisplayStyle = getDisplayStyle.bind(this);
        this.getDisplayStyleZh = getDisplayStyleZh.bind(this);
        this.getDisplayFontSize = getDisplayFontSize.bind(this);
        this.TableColumns = TableColumns.bind(this);
        this.state = {
            table:{
                expired: {
                    cn: "失效航班",
                    iconType: "icon-expired",
                    show: false,
                    x: 0,
                    y:0
                },
                special: {
                    cn: "特殊航班",
                    iconType: "icon-special",
                    show: false,
                    x: 0,
                    y:0
                },
                pool: {
                    cn: "等待池航班",
                    iconType: "icon-pool",
                    show: false,
                    x: 0,
                    y:0
                },
                alarm: {
                    cn: "告警航班",
                    iconType: "icon-alarm",
                    show: false,
                    x: 0,
                    y:0
                },
                todo: {
                    cn: "待办事项",
                    iconType: "icon-todo",
                    show: false,
                    x: 0,
                    y:0
                },
            },
            tableContainer:""
        }
    }
    //导航栏目选中
    onMenuTitleSelect(key, domEvent){
        let { clientX = 0, clientY = 0 }  = domEvent;
        let show = this.state.table[key].show;
        let newDate = Object.assign({},this.state.table)
        const dom = $(".flight-menu");
        const height = dom.height();
        const domLeft = dom[0].offsetLeft || 0;
        const domTop = dom[0].offsetTop || 0;
        this.state.table[key].show = !show;
        this.state.table[key].x = clientX - 150;
        this.state.table[key].y = height + 18;
        this.state.tableContainer = `${key}-table`
        this.forceUpdate()//防止differ算法循环不到

    }

    getPoolTableDatas(){

    }

    //当点击关闭按钮时，type: 表格类型
    onCloseBtn( type ){
        this.state.table[type].show = false;
        this.forceUpdate()
        //去掉menu的选中状态
        $(".flight-menu li." + type).removeClass("ant-menu-item-selected");
    }

    render(){
        const { subTableDatas = {},dialogName} = this.props;
        const subTableKeys = Object.keys(this.state.table);

        return (
            <div className="header">
                <div className="flight-menu">
                    {
                        subTableKeys.map(( name )=>{
                            const obj = this.state.table[name];
                            return (
                                <div key={name} className="item" onClick={(e)=>{ this.onMenuTitleSelect(name, e)} }>
                                    <Badge count={ Object.keys( subTableDatas[name].datas || {} ).length } className="badge-icon">
                                        <span title={ obj.cn }>
                                            <i className={`iconfont  ${ obj.iconType }`}></i>
                                        </span>
                                    </Badge>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    subTableKeys.map(( name )=>{
                        const obj = this.state.table[name];
                        if( obj.show ){
                            const dataMap = subTableDatas[name];
                            return (
                                <CreateLayer
                                    key={name}
                                >
                                    <SubTable
                                        titleName = { obj.cn }
                                        key = { name }
                                        type = { name }
                                        tableDatas = { Object.values( dataMap.datas || {} ) }
                                        tableColumnsObj = { this.TableColumns( name, dataMap.colDisplay, dataMap.colNames, dataMap.colTitle ) }
                                        x = { obj.x }
                                        y = { obj.y }
                                        clickCloseBtn = { this.onCloseBtn }
                                        dialogName = {dialogName}
                                    />
                                </CreateLayer>
                            )
                        }else{
                            return "";
                        }


                    })
                }
            </div>
        )
    }
};

export default TableHeader;