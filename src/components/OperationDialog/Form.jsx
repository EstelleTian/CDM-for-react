import React from 'react';
import moment from 'moment';
import { Checkbox, Input, Form, DatePicker, TimePicker, Button } from 'antd';
import './Form.less'
import {isValidObject, isValidVariable} from "utils/basic-verify";
import {request} from "utils/request-actions";
import { host } from "utils/request-urls";
import {updateMultiTableDatas} from "components/FlightsSortModule/Redux";

const FormItem = Form.Item;
const { TextArea } = Input;

class FormDialog extends React.Component{
    constructor( props ){
        super( props );
        this.submitForm = this.submitForm.bind(this);
        this.submitCancelForm = this.submitCancelForm.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
        this.compareWithEOBT = this.compareWithEOBT.bind(this);
        const { rowData, showName } = this.props;
        const curValue = rowData[showName]; //获取当前点击单元格的数据
        this.state = {
            date: {
                value: curValue.substring(0,8) || moment().format('YYYYMMDD'),
                validateStatus: "",
                help: ""
            },
            time: {
                value: curValue.substring(8,12) || moment().format('HHmm'),
                validateStatus: "",
                help: ""
            },
            locked: true,
        }
    };

    //和EOBT比较
    compareWithEOBT( field, value ){
        const { rowData } = this.props;
        const eobt = rowData["EOBT"] || "";
        if( eobt.length == 12 && value.length == 12){
            //如果当前时间小于eobt时间，进行提示
            if( value*1 < eobt*1) {
                const newVal = field == 'date' ? value.substring( 0, 8 ) : value.substring( 8, 12 )
                this.setState({
                    [field]:{
                        value: newVal,
                        validateStatus: "warning",
                        help: "建议输入时间不早于EOBT"
                    }
                })
            }else{
                //清空提示数据
                this.setState({
                    date:{
                        value: value.substring( 0, 8 ),
                        validateStatus: "",
                        help: ""
                    },
                    time:{
                        value: value.substring( 8, 12 ),
                        validateStatus: "",
                        help: ""
                    }
                })
            }
        }
    }

    //日期改变
    onDateChange( datemoment, dateString ){
        const { date, time } = this.state;
        if( dateString == "" ){
            //更新选中的日期
            this.setState({
                date: {
                    value: moment().format('YYYYMMDD'),
                    validateStatus: "",
                    help: ""
                }
            });
        }else{
            //更新选中的日期
            this.setState({
                date: {
                    ...date,
                    value: dateString
                }
            });
            //日期值去掉-
            dateString = dateString.replace(/\-/g, "");;
            //拼接为12位值
            const val = dateString + time.value;
            //做校验
            this.compareWithEOBT("date", val);
        }


    };
    //时间改变
    onTimeChange( timemoment, timeString ){
        const { date, time } = this.state;
        if( timeString == "" ){
            //更新选中的日期
            this.setState({
                time: {
                    value: moment().format('HHmm'),
                    validateStatus: "",
                    help: ""
                }
            });
        }else{
            //更新选中的时间
            this.setState({
                time: {
                    ...time,
                    value: timeString
                }
            });
            //拼接为12位值
            const val = date.value + timeString;
            //做校验
            this.compareWithEOBT("time", val);
        }

    };

    //表单提交
    submitForm(){
        const { date, time, locked } = this.state;
        const { timeAuth = {} } = this.props;
        //验证date和time的validateStatus为""，则允许提交
        if( date.validateStatus == "" && time.validateStatus == "" ){
            const { showName, rowData, userId } = this.props;
            const url = timeAuth.updateBtn.url || "";
            const id = rowData["ID"]*1 || null; //id
            const str = date.value + time.value; //拼接时间
            const comment = this.refs.comment.textAreaRef.value || ""; //获取备注内容
            let params = {};
            if( showName == "COBT" || showName == "CTOT" ){
                const lockedValue = locked ? 1 : 0; //是否禁止系统自动调整，1 禁止  0 允许
                //根据showName，判断cobt和ctd提交值
                let ctd = "";
                let cobt = "";
                if( showName == "COBT" ){
                    cobt = str;
                    ctd = rowData["CTOT"];
                }else if( showName == "CTOT" ){
                    cobt = rowData["COBT"];
                    ctd = str;
                }
                //拼接为接口提交数据集合
                params = {
                    userId,
                    id,
                    cobt,
                    ctd,
                    comment,
                    lockedValue
                }
            }else if( showName == "ASBT" ){//上客时间
                params = {
                    userId,
                    id,
                    boardingTime: str,
                    comment
                }
            }else if( showName == "AGCT" ){//关舱门时间
                params = {
                    userId,
                    id,
                    close: str,
                    comment
                }
            }else if( showName == "AOBT" ){//关舱门时间
                params = {
                    userId,
                    id,
                    aobt: str,
                    comment
                }
            }



            console.log(params, url);

            //发送请求
            request( `${host}/${url}`, "post", params, (res) => {
                console.log(res);
                this.props.requestCallback(res);
            } );


        }
    };

    //表单撤销提交
    submitCancelForm(){
        const { showName, rowData, userId, timeAuth = {} } = this.props;
        const url = timeAuth.cancelBtn.url || "";
        const id = rowData["ID"]*1 || null; //id
        const comment = this.refs.comment.textAreaRef.value || ""; //获取备注内容
        const params = {
            userId,
            id,
            comment
        }
        console.log(params, url);

    };

    render(){
        const { rowData, showName, timeAuth } = this.props;
        //时间列显示权限
        const formItemLayout = {
            labelCol: {
                xs: { span: 22 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 22 },
                sm: { span: 16 },
            },
        };
        const flightid = rowData["FLIGHTID"]; //航班id
        const DEPAP = rowData["DEPAP"]; //起飞机场
        const ARRAP = rowData["ARRAP"]; //降落机场
        const { date, time, locked } = this.state;

        let originalVal = "";
        let applyVal = "";
        if( showName == "HOBT" && timeAuth.type == "approve"){
            originalVal = rowData[showName];
            applyVal = rowData.originalData.flightCoordinationRecordsMap[showName].value || "";
        }

        return(
            <div className={`content ${showName}`}>
                {
                    (showName == "COBT" || showName == "CTOT") ?
                        <Form>
                            <FormItem
                                label="航班"
                                {...formItemLayout}
                            >
                        <span className="stable-div">
                            { flightid }
                        </span>
                            </FormItem>
                            <FormItem
                                label="机场"
                                {...formItemLayout}
                            >
                        <span className="stable-div">
                            { DEPAP + "-" + ARRAP }
                        </span>
                            </FormItem>
                            <FormItem
                                label="日期"
                                {...formItemLayout}
                                validateStatus={ date.validateStatus }
                                help={ date.help }
                            >
                                <DatePicker
                                    disabledDate={ (current) => {
                                        //不能选早于今天的 false显示 true不显示
                                        //明天
                                        const tomorrow = moment(moment().add(1, 'day')).endOf('day');
                                        //今天
                                        const today = moment().startOf('day');
                                        //只能选今明两天
                                        return current < today || current > tomorrow;
                                    } }
                                    value = {  date.value == "" ? moment() : moment( date.value ) }
                                    onChange={ this.onDateChange }
                                    format = "YYYYMMDD"
                                />
                            </FormItem>
                            <FormItem
                                label="时间"
                                {...formItemLayout}
                                validateStatus={ time.validateStatus }
                                help={ time.help }
                            >
                                <TimePicker
                                    format = 'HHmm'
                                    value = { time.value == "" ? moment() : moment( time.value, 'HHmm') }
                                    onChange={ this.onTimeChange }
                                />
                            </FormItem>
                            <FormItem
                                label = ""
                                wrapperCol = {{ sm: {offset: 2, span: 16}, xs: {span: 24} }}
                            >
                                <div>
                                    <Checkbox
                                        className = "system-locked"
                                        defaultChecked = { locked }
                                        onChange = {(e)=>{
                                            this.setState({
                                                locked: !locked
                                            })
                                        }}
                                    >禁止系统自动调整</Checkbox>
                                </div>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="备注"
                            >
                                <TextArea ref="comment" placeholder="备注(最多100个字符)"/>
                            </FormItem>
                            <FormItem
                                wrapperCol = {{ sm: {offset: 2, span: 22}, xs: {span: 24} }}
                                label=""
                                className="footer"
                            >
                                {
                                    (isValidObject( timeAuth.updateBtn ) &&  timeAuth.updateBtn.show) ?
                                        <Button className="c-btn c-btn-blue"
                                                onClick = { this.submitForm }
                                        >
                                            指定
                                        </Button> : ""
                                }
                                {
                                    (isValidObject( timeAuth.cancelBtn ) &&  timeAuth.cancelBtn.show) ?
                                        <Button className="c-btn c-btn-red"
                                                onClick = { this.submitCancelForm }
                                        >
                                            撤销
                                        </Button> : ""
                                }
                            </FormItem>
                        </Form>
                        : ""
                }
                {
                    (showName == "ASBT" || showName == "AGCT" || showName == "AOBT") ?
                        <Form>
                            <FormItem
                                label="航班"
                                {...formItemLayout}
                            >
                        <span className="stable-div">
                            { flightid }
                        </span>
                            </FormItem>
                            <FormItem
                                label="机场"
                                {...formItemLayout}
                            >
                        <span className="stable-div">
                            { DEPAP + "-" + ARRAP }
                        </span>
                            </FormItem>
                            <FormItem
                                label="日期"
                                {...formItemLayout}
                                validateStatus={ date.validateStatus }
                                help={ date.help }
                            >
                                <DatePicker
                                    disabledDate={ (current) => {
                                        //不能选早于今天的 false显示 true不显示
                                        //明天
                                        const tomorrow = moment(moment().add(1, 'day')).endOf('day');
                                        //今天
                                        const today = moment().startOf('day');
                                        //只能选今明两天
                                        return current < today || current > tomorrow;
                                    } }
                                    value = {  date.value == "" ? moment() : moment( date.value ) }
                                    onChange={ this.onDateChange }
                                />
                            </FormItem>
                            <FormItem
                                label="时间"
                                {...formItemLayout}
                                validateStatus={ time.validateStatus }
                                help={ time.help }
                            >
                                <TimePicker
                                    format = 'HHmm'
                                    value = { time.value == "" ? moment() : moment( time.value, 'HHmm') }
                                    onChange={ this.onTimeChange }
                                />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="备注"
                            >
                                <TextArea ref="comment" placeholder="备注(最多100个字符)"/>
                            </FormItem>
                            <FormItem
                                wrapperCol = {{ sm: {offset: 2, span: 22}, xs: {span: 24} }}
                                label=""
                                className="footer"
                            >
                                {
                                    (isValidObject( timeAuth.updateBtn ) &&  timeAuth.updateBtn.show) ?
                                        <Button className="c-btn c-btn-blue"
                                                onClick = { this.submitForm }
                                        >
                                            指定
                                        </Button> : ""
                                }
                                {
                                    (isValidObject( timeAuth.cancelBtn ) &&  timeAuth.cancelBtn.show) ?
                                        <Button className="c-btn c-btn-red"
                                                onClick = { this.submitCancelForm }
                                        >
                                            撤销
                                        </Button> : ""
                                }
                            </FormItem>
                        </Form>
                        : ""
                }
                {
                    (showName == "HOBT") ?
                        (timeAuth.type == "apply") ?
                            <Form>
                                <FormItem
                                    label="航班"
                                    {...formItemLayout}
                                >
                                    <span className="stable-div">
                                        { flightid }
                                    </span>
                                        </FormItem>
                                <FormItem
                                    label="机场"
                                    {...formItemLayout}
                                >
                            <span className="stable-div">
                                { DEPAP + "-" + ARRAP }
                            </span>
                        </FormItem>
                                <FormItem
                                    label="日期"
                                    {...formItemLayout}
                                    validateStatus={ date.validateStatus }
                                    help={ date.help }
                                >
                                    <DatePicker
                                        disabledDate={ (current) => {
                                            //不能选早于今天的 false显示 true不显示
                                            //明天
                                            const tomorrow = moment(moment().add(1, 'day')).endOf('day');
                                            //今天
                                            const today = moment().startOf('day');
                                            //只能选今明两天
                                            return current < today || current > tomorrow;
                                        } }
                                        value = {  date.value == "" ? moment() : moment( date.value ) }
                                        onChange={ this.onDateChange }
                                    />
                                </FormItem>
                                <FormItem
                                    label="时间"
                                    {...formItemLayout}
                                    validateStatus={ time.validateStatus }
                                    help={ time.help }
                                >
                                    <TimePicker
                                        format = 'HHmm'
                                        value = { time.value == "" ? moment() : moment( time.value, 'HHmm') }
                                        onChange={ this.onTimeChange }
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="备注"
                                >
                                    <TextArea ref="comment" placeholder="备注(最多100个字符)"/>
                                </FormItem>
                                <FormItem
                                    wrapperCol = {{ sm: {offset: 2, span: 22}, xs: {span: 24} }}
                                    label=""
                                    className="footer"
                                >
                                    {
                                        (isValidObject( timeAuth.applyBtn ) &&  timeAuth.applyBtn.show) ?
                                            <Button className="c-btn c-btn-blue"
                                                    onClick = { this.submitForm }
                                            >
                                                指定
                                            </Button> : ""
                                    }
                                </FormItem>
                            </Form>
                            :
                            <Form>
                                <FormItem
                                    label="航班"
                                    {...formItemLayout}
                                >
                                    <span className="stable-div">
                                        { flightid }
                                    </span>
                                </FormItem>
                                <FormItem
                                    label="机场"
                                    {...formItemLayout}
                                >
                                    <span className="stable-div">
                                        { DEPAP + "-" + ARRAP }
                                    </span>
                                </FormItem>
                                <FormItem
                                    label="原始值"
                                    {...formItemLayout}
                                >
                                    <span className="stable-div">
                                        { originalVal }
                                    </span>
                                </FormItem>
                                <FormItem
                                    label="申请值"
                                    {...formItemLayout}
                                >
                                    <span className="stable-div">
                                        { applyVal }
                                    </span>
                                </FormItem>
                                <FormItem
                                    label="日期"
                                    {...formItemLayout}
                                    validateStatus={ date.validateStatus }
                                    help={ date.help }
                                >
                                    <DatePicker
                                        disabledDate={ (current) => {
                                            //不能选早于今天的 false显示 true不显示
                                            //明天
                                            const tomorrow = moment(moment().add(1, 'day')).endOf('day');
                                            //今天
                                            const today = moment().startOf('day');
                                            //只能选今明两天
                                            return current < today || current > tomorrow;
                                        } }
                                        value = {  date.value == "" ? moment() : moment( date.value ) }
                                        onChange={ this.onDateChange }
                                    />
                                </FormItem>
                                <FormItem
                                    label="时间"
                                    {...formItemLayout}
                                    validateStatus={ time.validateStatus }
                                    help={ time.help }
                                >
                                    <TimePicker
                                        format = 'HHmm'
                                        value = { time.value == "" ? moment() : moment( time.value, 'HHmm') }
                                        onChange={ this.onTimeChange }
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="备注"
                                >
                                    <TextArea ref="comment" placeholder="备注(最多100个字符)"/>
                                </FormItem>
                                <FormItem
                                    wrapperCol = {{ sm: {offset: 2, span: 22}, xs: {span: 24} }}
                                    label=""
                                    className="footer"
                                >
                                    {
                                        (isValidObject( timeAuth.approveBtn ) &&  timeAuth.approveBtn.show) ?
                                            <Button className="c-btn c-btn-blue"
                                                    onClick = { this.submitForm }
                                            >
                                                批复
                                            </Button> : ""
                                    }
                                    {
                                        (isValidObject( timeAuth.refuseBtn ) &&  timeAuth.refuseBtn.show) ?
                                            <Button className="c-btn c-btn-red"
                                                    onClick = { this.submitCancelForm }
                                            >
                                                拒绝
                                            </Button> : ""
                                    }
                                </FormItem>
                            </Form>
                        : ""
                }
            </div>
        )


    }
};

export default FormDialog;