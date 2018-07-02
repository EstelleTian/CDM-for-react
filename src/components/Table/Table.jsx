import React from 'react';
import { Table, Row, Icon, Menu, Checkbox, Radio } from 'antd';
import $ from 'jquery';
import { requestGet } from '../../utils/request-actions';
import { getAllAirportsUrl, getUserPropertyUrl } from '../../utils/request-urls';
import { isValidObject, isValidVariable } from '../../utils/basic-verify';
import { TableColumns, ConvertToTableData, getColEdit } from "../../utils/table-config";
import { convertData, convertDisplayStyle, getDisplayStyle, getDisplayStyleZh, getDisplayFontSize } from "../../utils/flight-grid-table-data-util";
import './Table.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class AirTable extends React.Component{
    constructor( props ){
        super(props);
        this.convertUserProperty = this.convertUserProperty.bind(this);
        this.refreshAirportsList = this.refreshAirportsList.bind(this);
        // this.resetTableHeight = this.resetTableHeight.bind(this);
        this.convertData = convertData.bind(this);
        this.getDisplayStyle = getDisplayStyle.bind(this);
        this.getDisplayStyleZh = getDisplayStyleZh.bind(this);
        this.getDisplayFontSize = getDisplayFontSize.bind(this);
        this.airportTimerId = '';
    }

    refreshAirportsList( res ){
        const { updateTableDatas } = this.props;
        //表格数据
        let dataArr = [];

        // const datas = res.result;
        const datas = res;

        //遍历每个航班，并转化为表格数据
        for(var id in datas ){
            const flight = datas[id];
            //转化后的数据
            const data = this.convertData( flight );
            dataArr.push(data);
        }
        //保存航班数据
        updateTableDatas( dataArr );

        this.airportTimerId = setTimeout(() => {
            //获取机场航班
            requestGet( getAllAirportsUrl, this.refreshAirportsList );
        },10*1000)

    }
    //转化用户配置信息
    convertUserProperty( user_property ){
        const { updateTableConfig } = this.props;
        //验证是有效的数据
        if( user_property.length > 0){
            //匹配赋值
            let configParams = {};
            for ( let i in user_property) {
                let userProperty = user_property[i];
                if( isValidObject(userProperty) ){
                    let value = JSON.parse(userProperty['value']);
                    let uKey = userProperty.key;
                    let styleStr = 'grid_col_style';
                    let namesStr = 'grid_col_names';
                    let titleStr = 'grid_col_title';
                    let fontSizeStr = 'grid_col_font_size';
                    let editStr = 'grid_cdm_col_edit';
                    let displayNameStr = 'grid_cdm_col_display';
                    let invalidDataStyleStr = 'invalidDataStyle';

                    switch( uKey ){
                        case styleStr : {
                            configParams['colStyle'] = value;
                            //将该数据转化为convert需要数据
                            const obj = convertDisplayStyle(value);
                            configParams['displayStyle'] = obj.displayStyle;
                            configParams['displayStyleComment'] = obj.displayStyleComment;
                            break;
                        }
                        case namesStr : {
                            configParams['colNames'] = value;
                            break;
                        }
                        case titleStr : {
                            configParams['colTitle'] = value;
                            break;
                        }
                        case editStr : {
                            configParams['colEdit'] = value;
                            break;
                        }
                        case displayNameStr : {
                            configParams['colDisplay'] = value;
                            break;
                        }
                        case fontSizeStr : {
                            configParams['colFontSize'] = value;
                            break;
                        }
                        case invalidDataStyleStr : { //失效航班样式
                            let invalidStr = "";
                            for(let key in value){
                                invalidStr += key+":"+value[key]+';';
                            }
                            configParams['invalidDataStyle'] = invalidStr;
                            break;
                        }
                    }

                }
            }

            //存储到redux的 tableConfig 中
            updateTableConfig( configParams );
            //获取机场航班
            requestGet( getAllAirportsUrl, this.refreshAirportsList );
        }


    };

    // componentWillMount(){
    //     console.time('rendertable');
    // }

    componentDidMount(){
        //获取用户配置
        requestGet( getUserPropertyUrl, this.convertUserProperty );


        // console.timeEnd('rendertable');
    };

    // componentWillUpdate(){
    //     console.log('will--updatetable');
    //     console.time('updatetable');
    // }
    componentDidUpdate(){
        // console.log('did---updatetable');
        // console.timeEnd('updatetable');
    }
    
    componentWillUnmount(){
        clearTimeout(this.airportTimerId);
    }

    // resetTableHeight(){
    //     const $antCardBody = $(".ant-card-body");
    //     const cardBodyHeight = $antCardBody.height();
    //     const operationHeight = $(".ant-card-body .operation").height();
    //     let maxHeight = cardBodyHeight - operationHeight - 43;
    //     $(".ant-table-body-inner").height(maxHeight+'px');
    //     $(".ant-table-body").height(maxHeight+'px');
    // }


    render(){
        // console.log("Table render~~~");
        const { tableDatas, tableConfig } = this.props;
        const { colDisplay, colNames } = tableConfig;
        const columns = TableColumns( colDisplay, colNames );
        const totalNum = tableDatas.length;
        const scrollX = columns.length * 100;
        //TODO 高度根据缩放自适应
        // this.resetTableHeight();

        return(
            <div className="air-table bc-1">
                <Row className="operation">
                    <div className="tools">
                        <Icon type="reload" title="刷新"/>
                        <Icon type="sync" title="重置"/>
                        <Menu
                            defaultSelectedKeys={['filter']}
                            selectedKeys={['filter']}
                            mode="horizontal"
                            theme="dark"
                        >
                            <SubMenu
                                key="filter"
                                title={<Icon type="filter" title="过滤"/>}
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
                    </div>
                    <div className="total">总计{totalNum}条航班</div>
                </Row>
                <Table
                    columns={columns}
                    dataSource={ tableDatas }
                    size="small"
                    scroll={{
                        x: scrollX,
                        y: '100%'
                    }}
                    bordered
                    pagination = {false}
                />
            </div>
        )
    }
}


export default AirTable;