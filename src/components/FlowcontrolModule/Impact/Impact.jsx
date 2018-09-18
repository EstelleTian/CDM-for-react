import React from 'react';
import { Row, Col, Icon, Table as AntTable, message } from 'antd';
import DraggableModule from "components/DraggableModule/DraggableModule";
import {isValidObject, isValidVariable} from "utils/basic-verify";
import { resetFrozenTableStyle, sortDataMap } from "utils/table-common-funcs";
import { requestGet } from "utils/request-actions";
import { retrieveFlowcontrolImpactFlightsUrl, getUserPropertyUrl } from "utils/request-urls";
import { TableColumns } from "utils/table-config";
import { convertData, convertDisplayStyle, getDisplayStyle, getDisplayStyleZh, getDisplayFontSize } from "utils/flight-grid-table-data-util";
import OperationDialogContainer from 'components/OperationDialog/OperationDialogContainer';
import './Impact.less';
import {OperationReason} from "utils/flightcoordination";

class Impact extends React.Component{
    constructor( props ){
        super(props);
        this.convertData = convertData.bind(this);
        this.getDisplayStyle = getDisplayStyle.bind(this);
        this.getDisplayStyleZh = getDisplayStyleZh.bind(this);
        this.getDisplayFontSize = getDisplayFontSize.bind(this);
        this.TableColumns = TableColumns.bind(this);
        this.convertFlowcontrolImpactFlightsInfo = this.convertFlowcontrolImpactFlightsInfo.bind(this);
        this.convertBasicConfigInfo = this.convertBasicConfigInfo.bind(this);
        this.convertUserProperty = this.convertUserProperty.bind(this);
        this.convertToTableDatas = this.convertToTableDatas.bind(this);
        this.requestCallback = this.requestCallback.bind(this);

        this.state = {
            flowTimerId: 0,
            physicsRunwayGap: "", //跑道配置信息  "02L/20R,02L;02R/20L,02R"
            systemConfigMap: {}, //系统参数信息
            airportConfigurationMap: {}, //机场参数信息
            tableColumns: [],
            tableDatasMap: {}, //表格数据
            scrollX: 0
        };
    }
    //转换系统基本参数信息
    convertBasicConfigInfo( res ){
        const status = res.status*1;
        //成功
        if( 200 == status){
            const { physicsRunwayGap = "", systemConfigMap = {}, airportConfigurationMap = {}, userPropertyList = {} } = res;
            this.setState({
                "physicsRunwayGap": physicsRunwayGap, //跑道配置信息  "02L/20R,02L;02R/20L,02R"
                "systemConfigMap": systemConfigMap, //系统参数信息
                "airportConfigurationMap": airportConfigurationMap, //机场参数信息
            });
            //用户基本参数配置
            this.convertUserProperty( userPropertyList );
        }else{
            //错误提示
            const error = res.error || {};
            if( error.hasOwnProperty("message") ){
                console.error( error.message || "" );
            }else{
                console.error( "获取参数接口失败，错误未知." );
            }
        }
    };
    //转化用户配置信息
    convertUserProperty( user_property ){
        const { userId, id } = this.props;
        //验证是有效的数据
        if( user_property.length > 0){
            //匹配赋值
            let configParams = {};
            for ( let i in user_property) {
                let userProperty = user_property[i];
                if( isValidObject(userProperty) ){
                    let value = JSON.parse(userProperty['value']);
                    let uKey = userProperty.key;
                    switch( uKey ){
                        case 'grid_col_style' : {
                            configParams['colStyle'] = value;
                            //将该数据转化为convert需要数据
                            const obj = convertDisplayStyle(value);
                            configParams['displayStyle'] = obj.displayStyle;
                            configParams['displayStyleComment'] = obj.displayStyleComment;
                            break;
                        }
                        case 'grid_col_names' : {
                            configParams['colNames'] = value;
                            break;
                        }
                        case 'grid_col_title' : {
                            configParams['colTitle'] = value;
                            break;
                        }
                        case 'grid_flow_impact_col_edit' : {
                            configParams['colEdit'] = value;
                            break;
                        }
                        case 'grid_flow_impact_col_display' : {
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
                    }

                }
            }

            //转换为表头列数据
            const { colDisplay, colNames, colTitle } = configParams;
            this.property = configParams;
            const { columns, width } = this.TableColumns( "", colDisplay, colNames, colTitle );
            //更新表头数据
            this.setState({
                tableColumns: columns,
                scrollX: width
            });
            //获取流控影响航班
            const params = {
                userId: userId,
                id: id*1
            };
            requestGet( retrieveFlowcontrolImpactFlightsUrl, params, this.convertFlowcontrolImpactFlightsInfo );
        }


    };
    //流控影响航班数据获取
    convertFlowcontrolImpactFlightsInfo(res){
        const { userId, id } = this.props;
        //获取航班值
        const { flightsView = {}, generateTime  } = res;
        //航班id集合
        const flightsIdArr = Object.keys(flightsView);
        //表格数据
        let dataMap = {};
        if( flightsIdArr.length > 0 ){
            //遍历每个航班，并转化为表格数据
            for(let index in flightsIdArr ){
                const id = flightsIdArr[index];
                //获取航班对象
                const flight = flightsView[id] || {};
                //获取航班数据和权限数据
                const { flightFieldViewMap, flightAuthMap } = flight;
                const data = this.convertData( flightFieldViewMap, flightAuthMap, generateTime );
                //将航班原数据补充到航班对象中
                data.originalData = flight;
                dataMap[id] = data;
            }
        }
        this.setState({
            tableDatasMap: dataMap
        });
        const flowTimerId = setTimeout(() => {
            //获取机场航班
            const params = {
                userId: userId,
                id: id*1
            };
            requestGet( retrieveFlowcontrolImpactFlightsUrl, params, this.convertFlowcontrolImpactFlightsInfo );
        }, 30*1000);
        this.setState({
            flowTimerId
        });

    };
    //将表格数据转换为数组格式
    convertToTableDatas( tableDatasMap ){
        //表格数据进行排序，排序后再存储
        const sortedDataArr = sortDataMap( tableDatasMap );
        let newSortedDataArr = [];
        //增加行号值
        for(let i in sortedDataArr ){
            let data = sortedDataArr[i];
            data["rownum"] = i*1 +1;
            newSortedDataArr.push(data);
        }
        return newSortedDataArr;
    }
    //表单提交后--单条数据更新方法
    requestCallback( res, mes ){
        const { flightView, generateTime, error } = res;
        if( isValidVariable(flightView) ){
            const { flightFieldViewMap = {}, flightAuthMap = {} } = flightView;
            const { ID = {} } =flightFieldViewMap;
            const id = ID.value;
            //数据转化
            const data = this.convertData( flightFieldViewMap, flightAuthMap, generateTime );
            //将航班原数据补充到航班对象中
            data.originalData = flightView;
            //更新数据
            let { tableDatasMap } = this.state;
            //若有该航班，更新;没有添加
            tableDatasMap[id] = data;
            this.setState({
                tableDatasMap: tableDatasMap
            });
            //提示成功
            message.success( mes + "成功", 5 );

        }else{
            //提示失败
            const msg = error.message || "";
            const res = OperationReason[msg] || msg;
            const showMes = mes + "失败," + res;
            message.error( showMes, 5 );
        }
    };

    componentDidMount(){
        //请求
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
            'grid_flow_impact_col_display',
            'grid_flow_impact_col_edit',
            'invalidDataStyle',
            'operation_control_display'
        ];
        const url = getUserPropertyUrl + '?userId='+ userId +'&keys=' + keys;
        requestGet( url, {}, this.convertBasicConfigInfo );
    };

    componentDidUpdate(){
        //处理冻结表格样式
        resetFrozenTableStyle();
    }

    componentWillUnmount(){
        //清除定时器
        const { flowTimerId = 0} = this.state;
        clearTimeout( flowTimerId );
    }

    render(){
        const { formatData, clickCloseBtn, width = 1500, x, y, dialogName} = this.props;
        const { name, effectiveTime, publishUserZh, flowStatus, flowStatusClassName, startTime, endTime, generateTime, lastModifyTime, updateTime } = formatData;
        const { tableColumns, scrollX, tableDatasMap } = this.state;
        const tableDatas = this.convertToTableDatas(tableDatasMap);
        return (
            <DraggableModule
                bounds = ".root"
                x = {x}
                y = {y}
            >
                <div className="box center no-cursor" style={{ width: width }}>
                    <div className="dialog">
                        {/* 头部*/}
                        <Row className="title drag-target cursor">
                            <span>{name} 影响航班</span>
                            <div
                                className="close-target"
                                onClick={ () => {
                                    clickCloseBtn("impact");
                                } }
                            >
                                <Icon type="close" title="关闭"/>
                            </div>
                        </Row>
                        <div className="content">
                            <Row className="short-info">
                                <Col span={24} className="main-title">
                                    <span className="name">{ name }</span>
                                    <span className="effectiveTime">( { effectiveTime } )</span>
                                    <span className={`status ${flowStatusClassName}`}>{ flowStatus }</span>
                                </Col>
                                <Col span={18} offset={3} className="main-date">
                                    <Col span={4}>创建时间</Col>
                                    <Col span={4}>开始时间</Col>
                                    <Col span={4}>结束时间</Col>
                                    <Col span={4}>终止时间</Col>
                                    <Col span={4}>更新时间</Col>
                                    <Col span={4}>发布用户</Col>
                                </Col>
                                <Col span={18} offset={3} className="main-date">
                                    <Col span={4}>{generateTime || "——"}</Col>
                                    <Col span={4}>{startTime || "——"}</Col>
                                    <Col span={4}>{endTime || "——"}</Col>
                                    <Col span={4}>{lastModifyTime || "——"}</Col>
                                    <Col span={4}>{updateTime || "——"}</Col>
                                    <Col span={4}>{publishUserZh || "——"}</Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} className="main-table flowcontrol-table"  tablename="impact">
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
                            </Row>
                            {
                                dialogName == "impact" ?
                                    <OperationDialogContainer
                                        requestCallback = { this.requestCallback }
                                    />
                                    : ""
                            }

                        </div>
                    </div>
                </div>
            </DraggableModule>
        )
    }
};

export default Impact;