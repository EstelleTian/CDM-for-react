//航班查询
import React from 'react';
import { Row, Table, Icon, Form, Input, Button, Select } from 'antd';
import DraggableModule from '../DraggableModule/DraggableModule';
import { getFlightDetailUrl } from 'utils/request-urls';
import {  requestGet } from 'utils/request-actions';
import { convertData, getDisplayStyle, getDisplayStyleZh, getDisplayFontSize, convertSearchData } from "utils/flight-grid-table-data-util";
import './FlightSearchModule.less';
import OperationDialogContainer from "components/OperationDialog/OperationDialogContainer";
const FormItem = Form.Item;
const Option = Select.Option;
class FlightSearchModule extends React.Component{
    constructor( props ){
        super(props);
        this.state = {
            flightId:'',
            selectDate:'today',
            flightDatas:{}
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleConvertFormData = this.handleConvertFormData.bind(this);
        this.updatesearchTable = this.updatesearchTable.bind(this);
        this.converData = this.converData.bind(this);
        this.convertData = convertData.bind(this);
        this.getDisplayStyle = getDisplayStyle.bind(this);
        this.getDisplayStyleZh = getDisplayStyleZh.bind(this);
        this.getDisplayFontSize = getDisplayFontSize.bind(this);
        this.convertSearchData = convertSearchData.bind(this);
    }
    notEmpty = (rule, value, callback) => {
        if(value == undefined || null == value || value.trim() == ""){
            const name = rule.field;
            switch(name){
                case "flightId" : callback("航班号不能为空！");
            }
        }else{
            callback();
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.handleConvertFormData(values);
            }
        });
    }
    handleConvertFormData(values){
        const { loginUserInfo, property } = this.props;
        let flightId = values.flightId.replace(/(^\s*)|(\s*$)/g, "").toUpperCase()
        let params = {
            userId : loginUserInfo.userId,
            flightId: flightId,
            date:values.selectDate
        }
        // 发送请求
        requestGet(getFlightDetailUrl, params, this.updatesearchTable );
    }
    updatesearchTable(res){
            let { flights = [],generateTime} = res;
            //返回结果验证
            if(flights.length > 0){
                let searchDataMap = this.converData(flights,generateTime)
                this.setState({
                    flightDatas : searchDataMap
                })
            }else{
                //error信息
                let{ error } = res;
                let flightId = this.props.form.getFieldValue("flightId");
                if(error){
                    this.props.form.setFields({
                        flightId: {
                            value: flightId,
                            errors: [new Error( error.message )],
                        },
                    });
                    this.setState({
                        flightDatas : []
                    })
                }
            }
    }

    converData(data,generateTime){
        let searchDataMap = {};
        const { property } = this.props;
        for(let i in data){
            searchDataMap[data[i]['flightRetrieveView']['flightFieldMap']['ID']['value']] = this.convertSearchData(data[i]['flightRetrieveView'],generateTime,property.colEdit)
        }
        return searchDataMap
    }
    render(){
        const { titleName, type, tableDatas, tableColumnsObj, x, y, clickCloseBtn,size,dialogName} = this.props;
        const {flightDatas} = this.state
        const { getFieldDecorator } = this.props.form;
        const state = this.state;
        const { width } = tableColumnsObj;
        const rulesGenerate = {
            flightId: getFieldDecorator("flightId", {
                initialValue:  state.flightId ||"",
                rules: [
                    {validator : this.notEmpty}
                ]
            }),
            selectDate: getFieldDecorator("selectDate", {
                initialValue: state.selectDate || "today",
                rules: [
                    {validator : this.notEmpty}
                ]
            }),
        };
        return (
            <DraggableModule
                x = {x}
                y = {y}
                bounds = ".root"
            >
                <div className="box no-cursor" style={{ width: width + 50 }}>
                    <div className="sub-table search-table" tablename="search">
                        <Row className="title drag-target cursor">
                            <span>{ titleName }</span>
                            <div
                                className="close-target"
                                onClick={ () => {
                                clickCloseBtn(type);
                            } }
                            >
                                <Icon type="close" title="关闭"/>
                            </div>

                        </Row>
                        <Row className="form-search">
                            <Form layout="inline" onSubmit={this.handleSubmit}>
                                <FormItem label="航班号:">
                                    <span>
                                        {
                                            rulesGenerate.flightId(
                                                <Input
                                                    type="text"
                                                    size={size}
                                                    placeholder="请输入航班号"
                                                    className="flightId"
                                                    style={{ width: '65%', marginRight: '3%' }}
                                                />
                                            )
                                        }
                                        {
                                            rulesGenerate.selectDate(
                                                <Select
                                                    size={size}
                                                    style={{ width: '32%' }}
                                                >
                                                    <Option value="yestoday">昨日</Option>
                                                    <Option value="today">今日</Option>
                                                    <Option value="tomorrow">明日</Option>
                                                </Select>
                                            )
                                        }
                            </span>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" className="c-btn c-btn-blue">查询</Button>
                                </FormItem>
                            </Form>
                        </Row>
                        <Row className="content">
                            <Table
                                columns={ tableColumnsObj.columns }
                                dataSource={ Object.values( flightDatas || {} ) }
                                rowKey="ID"
                                size="small"
                                scroll={{
                                x: width,
                                y: 200
                            }}
                                bordered
                                pagination = { false }
                                onRow = {(record, index) =>{
                                const id = record["ID"] || "";
                                return {
                                    flightid: id,
                                    rowid: index*1+1
                                }
                            }}
                            />
                            {
                                dialogName == "search"
                                    ? <OperationDialogContainer
                                        requestCallback = { this.requestCallback }
                                        tableName = "search"
                                    />
                                    : ""
                            }
                        </Row>
                    </div>
                </div>
            </DraggableModule>
        )
    }
}
export default Form.create()( FlightSearchModule) ;