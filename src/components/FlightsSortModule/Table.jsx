import React from 'react';
import { Table as AntTable, Col } from 'antd';
import $ from 'jquery';
import shallowequal from 'shallowequal';
import { requestGet } from 'utils/request-actions';
import { getAllAirportsUrl, getUserPropertyUrl } from 'utils/request-urls';
import { isValidVariable, isValidObject, calculateStringTimeDiff } from 'utils/basic-verify';
import { TableColumns } from "utils/table-config";
import { convertData, convertDisplayStyle, getDisplayStyle, getDisplayStyleZh, getDisplayFontSize, convertAlarmData, convertExpiredData, converSpecialtData, convertTodoData } from "utils/flight-grid-table-data-util";
import './Table.less';

class Table extends React.Component{
    constructor( props ){
        super(props);
        this.convertUserProperty = this.convertUserProperty.bind(this);
        this.convertBasicConfigInfo = this.convertBasicConfigInfo.bind(this);
        this.refreshAirportsList = this.refreshAirportsList.bind(this);
        this.getAirportsParams = this.getAirportsParams.bind(this);
        this.tableOnChange = this.tableOnChange.bind(this);
        this.scrollToRow = this.scrollToRow.bind(this);
        this.resetFrozenTableStyle = this.resetFrozenTableStyle.bind(this);
        this.handleSubTableDatas = this.handleSubTableDatas.bind(this);
        this.onListenTableScroll = this.onListenTableScroll.bind(this);
        this.sortDataMap = this.sortDataMap.bind(this);
        this.convertData = convertData.bind(this);
        this.convertAlarmData = convertAlarmData.bind(this);
        this.convertExpiredData = convertExpiredData.bind(this);
        this.converSpecialtData = converSpecialtData.bind(this);
        this.convertTodoData = convertTodoData.bind(this);
        this.getDisplayStyle = getDisplayStyle.bind(this);
        this.getDisplayStyleZh = getDisplayStyleZh.bind(this);
        this.getDisplayFontSize = getDisplayFontSize.bind(this);
        this.TableColumns = TableColumns.bind(this);
        this.state = {
            airportTimerId : 0
        };
    }

    //获取机场请求url 需要拼接的请求参数
    getAirportsParams(){
        const { userId, history } = this.props;
        if( !isValidVariable(userId) ){
            //跳转回登录页面
            history.push('/');
        }
        // const userId = 42;
        let params = {
            userId,
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
        // params['start'] = fullTime + '1330';
        params['end'] = fullTime + '2359';
        // params['end'] = fullTime + '1500';

        return params;
    };
    //更新航班数据
    refreshAirportsList( res ){
        const { updateTableDatas, updateGenerateInfo, updateGenerateTime, orderBy, updateTableConditionScrollId, autoScroll, updateTableConditionRange, updateTableConditionScroll } = this.props;
        //TODO 如果协调窗口开启，不更新

        //表格数据
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
            //转化后的数据
            const flightFieldViewMap = flight.flightFieldViewMap || {};
            //获取航班对应的可操作权限
            const flightAuthMap = flight.flightAuthMap || {};
            const data = this.convertData( flightFieldViewMap, flightAuthMap, generateTime );
            //将航班原数据补充到航班对象中
            data.originalData = flight;

            //根据是否是自动滚动，如果是：计算滚动的航班id
            if( autoScroll ){
                // 取自定义排序首个字段与当前时间最接近的航班id
                //取排序字段，比较当前数据时间和字段绝对差值最小
                const tempTargetTime = data[orderBy];
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
        //更新数据生成时间
        updateGenerateTime({time : generateTime});
        //更新自动滚动航班id值
        updateTableConditionScrollId( mintime_flight_id );
        //表格数据进行排序，排序后再存储
        const sortedDataArr = this.sortDataMap( dataMap );
        //如果自动滚动开启，根据定位航班id获取在排序数据中index
        if( autoScroll ){
            let start;
            let end;
            for(let i = 0, len = sortedDataArr.length; i < len; i++){
                const tableData = sortedDataArr[i];
                if( isValidVariable(tableData["ID"]) && tableData["ID"] == mintime_flight_id ){
                    start = ( i - 25 ) < 0 ? 0 : ( i - 25 );
                    end = ( i + 25 ) > len ? len : ( i + 25 );
                    break;
                }
            };
            updateTableConditionRange( start, end );
            updateTableConditionScroll( false );
        };
        //更新表格航班数据
        console.time("updateTableDatas----------");
        updateTableDatas( dataMap );
        console.timeEnd("updateTableDatas----------");
        console.time("updateOtherTableDatas----------");
        //更新统计数据
        updateGenerateInfo(generateInfo);

        this.handleSubTableDatas(res, 'expired', this.convertExpiredData, generateTime);
        this.handleSubTableDatas(res, 'pool', this.convertData, generateTime);
        this.handleSubTableDatas(res, 'alarm', this.convertAlarmData, generateTime);
        this.handleSubTableDatas(res, 'special', this.converSpecialtData, generateTime);
        this.handleSubTableDatas(res, 'todo', this.convertTodoData, generateTime);
        console.timeEnd("updateOtherTableDatas----------");


        const airportTimerId = setTimeout(() => {
            //获取机场航班
            const params = this.getAirportsParams();
            requestGet( getAllAirportsUrl, params, this.refreshAirportsList );
        }, 30*1000);
        this.setState({
            airportTimerId
        });

    };
    //表格数据排序
    sortDataMap( dataMap ){
        //默认排序队列
        const sortArr = ["ATOT", "CTOT", "TOBT", "EOBT", "SOBT", "ID"];
        let tableDatas = Object.values( dataMap ); //转为数组
        //排序
        tableDatas = tableDatas.sort((d1, d2) => {
            for (let index in sortArr) {
                let sortColumnName = sortArr[index];
                let data1 = d1[sortColumnName] + "";
                let data2 = d2[sortColumnName] + "";
                if (isValidVariable(data1) && isValidVariable(data2)) {
                    let res = data1.localeCompare(data2);
                    if (0 != res) {
                        return res;
                    }
                } else if (isValidVariable(data1)) {
                    return -1;
                } else if (isValidVariable(data2)) {
                    return 1;
                } else {
                    continue;
                }
            }
        });
        return tableDatas;
    };
    /* 处理副表数据后保存到store中
     * data : 全部航班数据集合
     * tableName ： 表名称
     * generateTime : 数据生成时间
     */
    handleSubTableDatas( data, tableName, convertFunc, generateTime ){
        //航班集合
        const flightViewMap = data.flightViewMap || {};
        //各类航班id集合数组
        const flightsArr = data[tableName+"Flights"] || [];
        let flightsMap = {};
        for(let index in flightsArr ){
            //获取航班id
            const id = flightsArr[index];
            //获取一条航班对象
            let flight = flightViewMap[id] || {};
            //获取对应航班状态
            let flightStatus;
            //一条航班 失效 告警 等待 特殊 待办 状态集合
            const flightStatusFieldViewMap = flight.flightStatusFieldViewMap;
            if( isValidObject(flightStatusFieldViewMap) ){
                flightStatus = flightStatusFieldViewMap[tableName.toUpperCase() + "_STATUS"];
            }
            //转换为表格数据后的对象集合
            if( tableName == 'pool'){
                flight = flight.flightFieldViewMap || {};
            }
            const rowData = convertFunc(flight, generateTime, flightStatus);
            //如果是数组
            if( Array.isArray(rowData) ){
                if( rowData.length > 0 ){
                    for(let n = 0; n < rowData.length; n++){
                        let rowdatas = rowData[n];
                        flightsMap[id] = rowdatas;
                    }
                }
            }else{//是对象
                flightsMap[id] = rowData;
            }

        }
        //更新告警航班数据
        this.props.updateSubTableDatas( tableName, flightsMap );
    };
    //转换系统基本参数信息
    convertBasicConfigInfo( res ){
        const status = res.status*1;
        //成功
        if( 200 == status){
            const { physicsRunwayGap = "", systemConfigMap = {}, airportConfigurationMap = {}, userPropertyList = {} } = res;
            const { updateBasicConfigInfo } = this.props;
            //跑道配置信息  "02L/20R,02L;02R/20L,02R"
            updateBasicConfigInfo("physicsRunwayGap", physicsRunwayGap);
            //系统参数信息
            updateBasicConfigInfo("systemConfigMap", systemConfigMap);
            //机场参数信息
            updateBasicConfigInfo("airportConfigurationMap", airportConfigurationMap);
            //用户基本参数配置
            this.convertUserProperty( userPropertyList );
        }else{
            //TODO 错误提示
            const error = res.error || {};
            if( error.hasOwnProperty("message") ){
                console.error( error.message || "" );
            }else{
                console.error( "获取参数接口失败，错误未知." );
            }
        }
    }
    //转化用户配置信息
    convertUserProperty( user_property ){
        const { updateTableDatasProperty, updateTableDatasColumns, updateSubTableDatasProperty } = this.props;
        //验证是有效的数据
        if( user_property.length > 0){
            //匹配赋值
            let configParams = {};
            let subTableConfigParams = {
                expired: {},
                special: {},
                pool: {},
                alarm: {},
                todo: {}
            };
            for ( let i in user_property) {
                let userProperty = user_property[i];
                if( isValidObject(userProperty) ){
                    let value = JSON.parse(userProperty['value']);
                    let uKey = userProperty.key;

                    switch( uKey ){
                        case 'grid_col_style' : {
                            configParams['colStyle'] = value;
                            subTableConfigParams['pool']['colStyle'] = value;
                            subTableConfigParams['todo']['colStyle'] = value;
                            subTableConfigParams['special']['colStyle'] = value;
                            subTableConfigParams['alarm']['colStyle'] = value;
                            subTableConfigParams['expired']['colStyle'] = value;
                            //将该数据转化为convert需要数据
                            const obj = convertDisplayStyle(value);
                            configParams['displayStyle'] = obj.displayStyle;
                            configParams['displayStyleComment'] = obj.displayStyleComment;
                            break;
                        }
                        case 'grid_col_names' : {
                            configParams['colNames'] = value;
                            subTableConfigParams['pool']['colNames'] = value;
                            break;
                        }
                        case 'grid_col_title' : {
                            configParams['colTitle'] = value;
                            subTableConfigParams['pool']['colTitle'] = value;
                            subTableConfigParams['todo']['colTitle'] = value;
                            subTableConfigParams['special']['colTitle'] = value;
                            subTableConfigParams['alarm']['colTitle'] = value;
                            subTableConfigParams['expired']['colTitle'] = value;
                            break;
                        }
                        case 'grid_cdm_col_edit' : {
                            configParams['colEdit'] = value;
                            break;
                        }
                        case 'grid_cdm_col_display' : {
                            configParams['colDisplay'] = value;
                            break;
                        }
                        case 'grid_col_font_size' : {
                            configParams['colFontSize'] = value;
                            break;
                        }
                        case 'invalidDataStyle' : { //失效航班样式
                            let invalidStr = "";
                            for(let key in value){
                                invalidStr += key+":"+value[key]+';';
                            }
                            configParams['invalidDataStyle'] = invalidStr;
                            break;
                        }
                        case 'grid_pool_col_display' : {
                            subTableConfigParams['pool']['colDisplay'] = value;
                            break;
                        }
                        case 'grid_pool_col_edit' : {
                            subTableConfigParams['pool']['colEdit'] = value;
                            break;
                        }
                        case 'grid_todo_list_col_names' : {
                            subTableConfigParams['todo']['colNames'] = value;
                            break;
                        }
                        case 'grid_todo_list_col_edit' : {
                            subTableConfigParams['todo']['colEdit'] = value;
                            break;
                        }
                        case 'grid_todo_list_col_display' : {
                            subTableConfigParams['todo']['colDisplay'] = value;
                            break;
                        }
                        case 'grid_special_col_names' : {
                            subTableConfigParams['special']['colNames'] = value;
                            break;
                        }
                        case 'grid_special_col_edit' : {
                            subTableConfigParams['special']['colEdit'] = value;
                            break;
                        }
                        case 'grid_special_col_display' : {
                            subTableConfigParams['special']['colDisplay'] = value;
                            break;
                        }
                        case 'grid_alarm_col_names' : {
                            subTableConfigParams['alarm']['colNames'] = value;
                            break;
                        }
                        case 'grid_alarm_col_edit' : {
                            subTableConfigParams['alarm']['colEdit'] = value;
                            break;
                        }
                        case 'grid_alarm_col_display' : {
                            subTableConfigParams['alarm']['colDisplay'] = value;
                            break;
                        }
                        case 'grid_expired_col_names' : {
                            subTableConfigParams['expired']['colNames'] = value;
                            break;
                        }
                        case 'grid_expired_col_edit' : {
                            subTableConfigParams['expired']['colEdit'] = value;
                            break;
                        }
                        case 'grid_expired_col_display' : {
                            subTableConfigParams['expired']['colDisplay'] = value;
                            break;
                        }
                    }

                }
            }
            //存储到redux的 tableConfig 中
            updateTableDatasProperty( configParams );
            //存储到redux的 subTableDatas 中
            updateSubTableDatasProperty( subTableConfigParams );
            //转换为表头列数据
            const { colDisplay, colNames, colTitle } = configParams;
            const { columns, width } = this.TableColumns( "", colDisplay, colNames, colTitle );
            //更新表头数据
            updateTableDatasColumns( columns, width );
            //获取机场航班
            const params = this.getAirportsParams();
            requestGet( getAllAirportsUrl, params, this.refreshAirportsList );
        }


    };
    //分页、排序、筛选变化时触发
    tableOnChange(pagination, filters, sorter){
        // console.log(pagination, filters, sorter);
        //获取排序的列名
        const { columnKey } = sorter;

    };
    //滚动当指定行
    scrollToRow(){
        const { autoScroll, scrollId  } = this.props;
        //若开启自动滚动 且 滚动有值，再滚动到指定位置
        if( autoScroll && isValidVariable(scrollId) ){
            let trs = $('.ant-table-scroll tr[flightid="'+ scrollId +'"]');
            //获取目标航班所在行数 - 10 ，以归置到中心位置
            const rowid = trs.attr("rowid")*1 - 10;
            //获取当前行行高
            const heigth = trs.height()*1;
            let top = rowid * heigth;
            //滚动到指定位置
            $(".ant-table-scroll .ant-table-body").scrollTop(top);
        }else{
            //滚动到中间位置
            const $scrollDom = $(".ant-table-body");
            const clientHeight = $scrollDom.height();
            //滚动的高度
            $scrollDom.scrollTop(clientHeight/2);

        }
    };
    //
    resetDataRange(){
        const { tableDatas } = this.props;

    };
    //重置冻结表样式
    resetFrozenTableStyle(){
        const $fixedLeft = $(".ant-table-fixed-left");
        const $fixedRight = $(".ant-table-fixed-right");

        const handleOverflow = ( $dom ) => {
            if( $dom.length > 0 ){
                $dom.addClass('overflow');
                const $scroll = $(".ant-table-scroll");

                const antScroll = $scroll.height() || 0;
                const antBody = $(".ant-table-body", $scroll).height() || 0;
                const antHead = $(".ant-table-header", $scroll).height() || 0;
                if( antBody + antHead + 5 < antScroll ){
                    $dom.removeClass('overflow');
                }
            }
        }
        handleOverflow( $fixedLeft );
        handleOverflow( $fixedRight );
    }

    onListenTableScroll(){
        const $scrollDom = $(".ant-table-body");
        const { updateTableConditionRangeByKey, autoScroll } = this.props;
        let scrollTimer;
        $scrollDom.off("mousewheel").on("mousewheel", ( e ) => {
            if( !autoScroll ){
                //表格实际高度（有滚动条超出视图范围）
                const $tbodyDom = $(".ant-table-tbody", $scrollDom);
                const maxHeight = $tbodyDom.height();
                //表格容器实际高度
                const clientHeight = $scrollDom.height();
                //滚动的高度
                let scrollHeight = $scrollDom[0].scrollTop;
                // console.log(scrollHeight, clientHeight, maxHeight);
                const diff = 30;
                let t1 = scrollHeight;
                let t2 = 0;
                clearTimeout( scrollTimer );
                scrollTimer = setTimeout(function(){
                    t2 = $scrollDom[0].scrollTop;
                    scrollHeight = t2;
                    // console.log("进入timer");
                    if( t2 - t1 > diff || t1 - t2 > diff){
                        //maxHeight = clientHeight + scrollHeight 差距30，当小于30 或者 scrollHeight<30时候，加载上页或者下一页
                        // scrollHeight < diff时候 加载上一页
                        if( scrollHeight <= diff ){
                            //加载上一页
                            // console.log("加载上一页");
                            updateTableConditionRangeByKey( -1 );
                        }else if( clientHeight + scrollHeight + diff > maxHeight ){
                            //加载下一页
                            // console.log("加载下一页");
                            updateTableConditionRangeByKey( 1 );
                        }
                    }
                }, 300);
            }
        })
    }

    componentWillMount(){
        const { userId, history } = this.props;
        if( !isValidVariable(userId) ){
            //跳转回登录页面
            history.push('/');
        }
    }

    componentDidMount(){
        // console.timeEnd("componentMountt");
        //获取用户配置
        const { userId, history } = this.props;
        if( !isValidVariable(userId) ){
            //跳转回登录页面
            history.push('/');
        }
        // const userId = 42;
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
        //清除定时器
        const { airportTimerId = 0} = this.state;
        clearTimeout( airportTimerId );
    }

    componentDidUpdate(){
        //表格滚动到当前的行
        this.scrollToRow();
        //根据定位航班id获取数据范围
        this.resetDataRange();
        //处理冻结表格样式
        this.resetFrozenTableStyle();
        //监听滚动
        this.onListenTableScroll();
    }

    shouldComponentUpdate( nextProps, nextState ){
        if( nextProps.tableColumns.length < 0 ){
            return false;
        }
        //如果autoscroll不一样，更新
        if( this.props.autoScroll != nextProps.autoScroll ){
            return true;
        }
        const thisTableDatas = this.props.tableDatas || [];
        const nextTableDatas = nextProps.tableDatas || [];
        const isDiff = shallowequal(thisTableDatas, nextTableDatas);
        if( !isDiff ){  //只有tableDatas改变了才重新render，目前是浅拷贝方式
            return true;
        }else{
            return false;
        }
    }
    render(){
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
                    pagination = { false }
                    onChange = { this.tableOnChange }
                    onRow = {(record, index) =>{
                         const id = record["ID"] || "";
                         //用于自动滚动定位，对tr增加属性值 index为行号
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