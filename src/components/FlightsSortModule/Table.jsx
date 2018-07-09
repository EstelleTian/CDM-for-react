import React from 'react';
import { Table as AntTable, Col } from 'antd';
import $ from 'jquery';
import { requestGet } from '../../utils/request-actions';
import { getAllAirportsUrl, getUserPropertyUrl } from '../../utils/request-urls';
import { isValidVariable, isValidObject, calculateStringTimeDiff } from '../../utils/basic-verify';
import { TableColumns } from "../../utils/table-config";
import { convertData, convertDisplayStyle, getDisplayStyle, getDisplayStyleZh, getDisplayFontSize } from "../../utils/flight-grid-table-data-util";
import './Table.less';

class Table extends React.Component{
    constructor( props ){
        super(props);
        this.convertUserProperty = this.convertUserProperty.bind(this);
        this.convertBasicConfigInfo = this.convertBasicConfigInfo.bind(this);
        this.refreshAirportsList = this.refreshAirportsList.bind(this);
        this.getAirportsParams = this.getAirportsParams.bind(this);
        this.filterBaseDatas = this.filterBaseDatas.bind(this);
        this.tableOnChange = this.tableOnChange.bind(this);
        this.scrollToRow = this.scrollToRow.bind(this);
        this.convertData = convertData.bind(this);
        this.getDisplayStyle = getDisplayStyle.bind(this);
        this.getDisplayStyleZh = getDisplayStyleZh.bind(this);
        this.getDisplayFontSize = getDisplayFontSize.bind(this);
        this.airportTimerId = '';
    }

    //获取机场请求url 需要拼接的请求参数
    getAirportsParams(){
        let params = {
            userId: 42,
            start: '',
            end: '',
        };
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        year = '' + year;
        month = month < 10 ? '0' + month : '' + month;
        day = day < 10 ? '0' + day : '' + day;
        let fullTime = year + month + day;
        params['start'] = fullTime + '0000';
        // params['start'] = '201807030000';
        params['end'] = fullTime + '2359';
        // params['end'] = '201807052359';

        return params;
    };
    //过滤系统基本参数
    filterBaseDatas( flight ){
        let tableFlight = {};
        // if (flight.hasOwnProperty("flightFieldViewMap")) {
        //     // 当前flight对象值
        //     let cflight = flight.flightFieldViewMap || {};
        //     // 根据列名获取需要的参数值
        //     let colNames = thisProxy.convertColModel();
        //     for (let n = 0, len = colNames.length; n < len; n++) {
        //         let colName = colNames[n].name;
        //         // 若有该对象值则取值,否则自定义空，防止丢数据
        //         if (cflight.hasOwnProperty(colName)) {
        //             tableFlight[colName] = cflight[colName];
        //         } else {
        //             tableFlight[colName] = {};
        //         }
        //     }
        // }

        tableFlight.flightFieldViewMap = flight.flightFieldViewMap || {};
        tableFlight.flightCoordinationRecordsMap = flight.flightCoordinationRecordsMap || {};
        return tableFlight;
    };
    //更新航班数据
    refreshAirportsList( res ){
        // console.log("refreshAirportsList");
        const { updateTableDatas, updateGenerateInfo, updateGenerateTime, sorterData, updateTableConditionScrollId, autoScroll } = this.props;
        //表格数据
        // let dataArr = [];
        let dataMap = {};
        //数据生成时间
        const generateTime = res.generateTime;
        //生成信息
        const generateInfo = res.generateInfo;

        //获取放行管理的航班id集合
        const departureClearanceFlightsArr = res.departureClearanceFlights || [];
        //航班集合
        const flightViewMap = res.flightViewMap || {};

        let mintime_flight_id = '';
        let time_interval = -1;

        //遍历每个航班，并转化为表格数据
        for(let index in departureClearanceFlightsArr ){
            //获取航班id
            const id = departureClearanceFlightsArr[index];
            //获取航班对象
            const flight = flightViewMap[id] || {};
            // 转换数据格式为convert方法需要的格式
            const tableFlight = this.filterBaseDatas(flight);
            //转化后的数据
            const data = this.convertData( tableFlight, generateTime );
            //根据是否是自动滚动，如果是：计算滚动的航班id
            if( autoScroll ){
                // 取自定义排序首个字段与当前时间最接近的航班id
                //取排序字段，比较当前数据时间和字段绝对差值最小
                const tempTargetTime = data[sorterData];
                if (isValidVariable(tempTargetTime) && tempTargetTime.length == 12) {
                    // 计算计划时间和当前时间的绝对差值 返回毫秒值
                    var tempTime = Math.abs(calculateStringTimeDiff(tempTargetTime, generateTime));
                    //如果时间间隔 小于记录的 赋值替换
                    //tempTime  time_interval  取最小
                    if (time_interval == -1 || tempTime < time_interval) {
                        time_interval = tempTime;
                        mintime_flight_id = data['ID'];
                    }
                }
            }
            // dataArr.push(data);
            dataMap[id] = data;
        }
        //保存航班数据
        console.time("updateTableDatas----------");
        //更新表格航班数据
        updateTableDatas( dataMap );
        //更新自动滚动航班id值
        updateTableConditionScrollId( mintime_flight_id );
        console.timeEnd("updateTableDatas----------");
        //更新统计数据
        updateGenerateInfo(generateInfo);
        //
        var params = {
            time : generateTime,
        }
        updateGenerateTime(params)

        // this.airportTimerId = setTimeout(() => {
        //     //获取机场航班
        //     const params = this.getAirportsParams();
        //     requestGet( getAllAirportsUrl, params, this.refreshAirportsList );
        // },10*1000);

    }
    //转换系统基本参数信息
    convertBasicConfigInfo( res ){
        const status = res.status*1;
        //成功
        if( 200 == status){
            //跑道配置信息  "02L/20R,02L;02R/20L,02R"
            const physicsRunwayGap = res.physicsRunwayGap;
            //系统参数信息
            const systemConfigMap = res.systemConfigMap;
            //机场参数信息
            const airportConfigurationMap = res.airportConfigurationMap;
            //用户基本参数配置
            this.convertUserProperty( res.userPropertyList );
        }else{
            //TODO 错误提示
            console.error(res.error.message);
        }
    }
    //转化用户配置信息
    convertUserProperty( user_property ){
        const { updateTableDatasProperty, updateTableDatasColumns } = this.props;
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
            updateTableDatasProperty( configParams );
            //转换为表头列数据
            const { colDisplay, colNames, colTitle } = configParams;
            const { columns, width } = TableColumns( colDisplay, colNames, colTitle );
            //更新表头数据
            updateTableDatasColumns( columns, width );
            //获取机场航班
            const params = this.getAirportsParams();
            requestGet( getAllAirportsUrl, params, this.refreshAirportsList );
        }


    };
    //分页、排序、筛选变化时触发
    tableOnChange(pagination, filters, sorter){
        console.log(pagination, filters, sorter);
        //获取排序的列名
        const { columnKey } = sorter;

    };
    //滚动当指定行
    scrollToRow(){
        const { scroll, scrollId  } = this.props;
        //若开启自动滚动 且 滚动有值，再滚动到指定位置
        if( scroll && isValidVariable(scrollId) ){
            let trs = $('.ant-table-scroll tr[flightid="'+ scrollId +'"]');
            //获取目标航班所在行数 - 10 ，以归置到中心位置
            const rowid = trs.attr("rowid")*1 - 10;
            //获取当前行行高
            const heigth = trs.height()*1;
            let top = rowid * heigth;
            //滚动到指定位置
            $(".ant-table-scroll .ant-table-body").scrollTop(top);
        }
    }
    // componentWillMount(){
    //     console.time("componentMountt");
    // }
    componentDidMount(){
        // console.timeEnd("componentMountt");
        //获取用户配置
        const userId = 42;
        const keys =[
            'grid_col_style',
            'grid_col_names',
            'grid_col_title',
            'grid_col_font_size',
            'grid_cdm_col_edit',
            'grid_cdm_col_display',
            'grid_pool_col_edit',
            'grid_pool_col_display',
            'grid_special_col_edit',
            'grid_special_col_display',
            'grid_special_col_names',
            'grid_alarm_col_display',
            'grid_alarm_col_edit',
            'grid_alarm_col_names',
            'grid_expired_col_display',
            'grid_expired_col_edit',
            'grid_expired_col_names',
            'grid_todo_list_col_display',
            'grid_todo_list_col_edit',
            'grid_todo_list_col_names',
            'grid_flight_search_col_edit',
            'grid_flight_search_col_display',
            'grid_flight_search_col_names',
            'grid_statistic_col_display',
            'grid_statistic_col_edit',
            'grid_flow_impact_col_display',
            'grid_flow_impact_col_edit',
            'flight_dynamic_bar_chart',
            'flight_dynamic_pie_chart',
            'flight_delay_bar_chart',
            'slide_component',
            'invalidDataStyle',
            'operation_control_display'
        ];

        let url = getUserPropertyUrl + '?userId='+ userId +'&keys=' + keys;
        requestGet( url, {}, this.convertBasicConfigInfo );
    };

    componentWillUnmount(){
        clearTimeout(this.airportTimerId);
    }

    // componentWillUpdate(){
    //     console.log("componentWillUpdate");
    //     console.time("componentUpdate");
    // }

    componentDidUpdate(){
        // console.log("componentDidUpdate");
        // console.timeEnd("componentUpdate");
        //表格滚动到当前的行
        this.scrollToRow();
    }

    render(){
        console.log('table render~~');
        const { tableDatas, tableColumns, scrollX} = this.props;
        return(
            <Col span={24} className="main-table">
                <AntTable
                    columns={ tableColumns }
                    dataSource={ tableDatas }
                    rowKey="ID"
                    size="small"
                    scroll={{
                        x: scrollX,
                        y: '100%'
                    }}
                    bordered
                    pagination = { false }
                    onChange = { this.tableOnChange }
                    onRow = {(record, index) =>{
                        const id = record["ID"] || "";
                        return {
                            flightid: id,
                            rowid: index*1+1
                        }
                    }}
                />
            </Col>
        )
    }
}

export default Table;