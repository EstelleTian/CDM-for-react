import React from 'react';
import moment from 'moment';
import { Checkbox, Input, Form, DatePicker, TimePicker, Button, message, Radio, Select } from 'antd';
import {getDayTimeFromString, isValidObject, isValidVariable} from "utils/basic-verify";
import {request} from "utils/request-actions";
import { host } from "utils/request-urls";
import { PriorityList, DelayReasonList } from "utils/flightcoordination";
import './Form.less'

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const { TextArea } = Input;

message.config({
    top: 140,
    duration: 5,
    getContainer: () => document.getElementsByClassName("main-table")[0]
});

class FormDialog extends React.Component{
    constructor( props ){
        super( props );
        this.submitForm = this.submitForm.bind(this);
        this.submitCancelForm = this.submitCancelForm.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
        this.compareWithEOBT = this.compareWithEOBT.bind(this);
        this.showLoading = this.showLoading.bind(this);
        this.hideLoading = this.hideLoading.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.handleDeiceChange = this.handleDeiceChange.bind(this);

        const { rowData, showName } = this.props;
        const curValue = rowData[showName]; //获取当前点击单元格的数据
        let priorityVal = "0";
        let delayReasonVal = "OTHER";
        if( showName == "PRIORITY" ){
            const { originalData = {} } = rowData;
            const { flightFieldViewMap = {} } = originalData;
            const { DELAYREASON = {}, PRIORITY = {} } = flightFieldViewMap;
            priorityVal = PRIORITY.value+"" || "0";
            //默认OTHER
            delayReasonVal = DELAYREASON.value || "OTHER";
            // 优先级有不存在的值时，默认为'普通'
            if( !isValidVariable(PriorityList[priorityVal]) ){
                priorityVal = "0";
            }
        }
        this.state = {
            delay: delayReasonVal,
            priority: priorityVal,
            runway: rowData["RUNWAY"] || "",
            date: {
                value: curValue.substring(0, 8) || moment().format('YYYYMMDD'),
                validateStatus: "",
                help: ""
            },
            time: {
                value: curValue.substring(8, 12) || moment().format('HHmm'),
                validateStatus: "",
                help: ""
            },
            locked: true,
            submitLoading: false,
            cancleLoading: false,
            deice: {
                show: "deice-position",
                deicePosition: rowData["DEICE_POSITION"] || "", //除冰坪/机位
                deiceGroup: rowData["DEICE_GROUP"] || "", //除冰分组
                validateStatus: "",
                help: ""
            },
            position: { //停机位
                value: rowData["POSITION"] || "",
                validateStatus: "",
                help: ""
            },
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
    //单选按钮赋值
    onRadioChange(e, name){
        this.setState({
            ...this.state,
            [name]: e.target.value
        });
    };
    //除冰下拉框
    handleDeiceChange(e){
        this.setState({
            ...this.state,
            deice: {
                ...this.state.deice,
                show: e.target.value,
                validateStatus: "",
                help: ""
            }
        });
    };
    
    //显示按钮loading
    showLoading( name ){
        const str = name + 'Loading';
        this.setState({
            [str]: true
        });
    };

    //隐藏按钮loading
    hideLoading( name ){
        const str = name + 'Loading';
        this.setState({
            [str]: false
        });
    };

    //表单提交
    submitForm(){
        //按钮增加loading
        this.showLoading('submit');
        const { date, time, locked, deice, position } = this.state;
        const { timeAuth = {}, showName, rowData, userId } = this.props;

        //除冰组 除冰坪 是否除冰 验证机位是否为空
        let positionValue = "";
        if( showName == "DEICE_STATUS" || showName == "DEICE_GROUP" || showName == "DEICE_POSITION" ) {
            if( deice.show == 'position'){ //机位
                //获取机位数据
                positionValue = this.refs.position.input.value || ""; //获取机位内容
                //如果是空，提示错误
                if( !isValidVariable(positionValue) ){
                    this.setState({
                        deice: {
                            ...deice,
                            validateStatus: "error",
                            help: '必填项，请输入机位'
                        }
                    });
                    return;
                }
            }
        }
        //停机位 验证输入是否为空
        let gatePositionValue = "";
        if( showName == "POSITION" ) {
            //获取机位数据
            gatePositionValue = this.refs.gatePosition.input.value || ""; //获取停机位内容
            //如果是空，提示错误
            if( !isValidVariable(gatePositionValue) ){
                this.setState({
                    position: {
                        ...position,
                        validateStatus: "error",
                        help: '必填项，请输入停机位'
                    }
                });
                return;
            }
        };
        //验证date和time的validateStatus为""，则允许提交
        if( date.validateStatus != "error" && time.validateStatus != "error" && deice.validateStatus != "error" && position.validateStatus != "error"  ){
            let url = "";
            if( isValidObject( timeAuth.updateBtn ) ){
                url = timeAuth.updateBtn.url || "";
            }
            const id = rowData["ID"]*1 || null; //id
            const str = date.value + time.value; //拼接时间
            let comment;
            if( isValidVariable(this.refs.comment)){
                comment = this.refs.comment.textAreaRef.value || ""; //获取备注内容
            }
            let params = { userId, id, comment };
            if( showName == "COBT" || showName == "CTOT" ){
                const lockedValue = locked ? 1 : 0; //是否禁止系统自动调整，1 禁止  0 允许
                params["lockedValue"] = lockedValue;
                //根据showName，判断cobt和ctd提交值
                if( showName == "COBT" ){
                    params["cobt"] = str;
                }else if( showName == "CTOT" ){
                    params["ctd"] = str;
                }
            }else if( showName == "ASBT" ){//上客时间
                params["boardingTime"] = str;
            }else if( showName == "AGCT" ){//关舱门时间
                params["closeTime"] = str;
            }else if( showName == "AOBT" ){//推出时间
                params["aobt"] = str;
            }else if( showName == "HOBT" || showName == "TOBT" ){//关舱门时间
                const btnStr = timeAuth.type + "Btn";
                url = timeAuth[btnStr].url;
                if( showName == "HOBT" ){
                    params["hobt"] = str;
                }else if( showName == "TOBT" ){
                    params["tobt"] = str;
                }
            }else if( showName == "PRIORITY" ) {//航班优先级
                const btnStr = timeAuth.type + "Btn";
                url = timeAuth[btnStr].url;
                params["priority"] = this.state.priority*1;
            }else if( showName == "DEICE_STATUS" || showName == "DEICE_GROUP" || showName == "DEICE_POSITION" ) {//除冰组 除冰坪 是否除冰
                params["deiceGroup"] = deice.deiceGroup;
                if( deice.show == 'position'){ //机位
                    params["deicePosition"] = positionValue;
                }else{
                    params["deicePosition"] = deice.deicePosition;
                }
            }else if( showName == "POSITION" ) {//停机位
                params["position"] = gatePositionValue;
            }else if( showName == "RUNWAY" ) {//跑道
                params["runway"] = this.state.runway;
            }
            console.log(params, url);
            if( isValidVariable(url) ){
                //发送请求
                request( `${host}/${url}`, "post", params, (res) => {
                    this.hideLoading('submit');
                    this.props.requestCallback( res, rowData['FLIGHTID'] + "变更" + timeAuth.cn );
                }, ( err ) => {
                    message.error(rowData['FLIGHTID'] + "变更" + timeAuth.cn + "请求失败" );
                    this.hideLoading('submit');
                });
            }
        }
        else{
            this.hideLoading('submit');
        }
    };

    //表单撤销提交
    submitCancelForm(){
        this.showLoading('cancle');
        const { showName, rowData, userId, timeAuth = {} } = this.props;
        const { cancelBtn = {}, refuseBtn = {} } = timeAuth;
        let url = "";
        if( isValidObject(cancelBtn) ){
            url = cancelBtn.url || "";
        }else if( isValidObject(refuseBtn) ){
            url = refuseBtn.url || "";
        }

        const id = rowData["ID"]*1 || null; //id
        const comment = this.refs.comment.textAreaRef.value || ""; //获取备注内容
        const params = {
            userId,
            id,
            comment
        }
        if( isValidVariable(url) ){
            //发送请求
            request( `${host}/${url}`, "post", params, (res) => {
                this.hideLoading('cancle');
                this.props.requestCallback( res, rowData['FLIGHTID'] + "撤销" + timeAuth.cn );
            });
        }

    };

    render(){
        const radioStyle = {
            display: 'block',
            marginLeft: '1rem'
        };
        const { rowData, showName, timeAuth, deiceGroupName, deicePositionArray } = this.props;
        const deiceGroupArr = deiceGroupName.split(",");
        //时间列显示权限
        const formItemLayout = {
            labelCol: {
                xs: { span: 20 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 16 },
            }
        };
        const flightid = rowData["FLIGHTID"]; //航班id
        const DEPAP = rowData["DEPAP"]; //起飞机场
        const ARRAP = rowData["ARRAP"]; //降落机场
        const { date, time, locked, deice, position, runway } = this.state;

        let originalVal = "";
        let applyVal = "";
        if( timeAuth.type == "approve" ){
            if( showName == "HOBT"){
                const map = rowData.originalData.flightCoordinationRecordsMap[showName];
                originalVal = map.originalValue || "";
                applyVal = map.value || "";
            }else if( showName == "HOBT" || showName == "PRIORITY"){
                const map = rowData.originalData.flightCoordinationRecordsMap[showName];
                originalVal = PriorityList[map.originalValue+""] || "";
                applyVal = PriorityList[map.value+""] || "";
            }
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
                                                loading = {this.state.submitLoading}
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
                    (showName == "HOBT" || showName == "TOBT") ?
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
                                    <span className="stable-div" title={originalVal}>
                                        { getDayTimeFromString(originalVal) || "" }
                                    </span>
                                </FormItem>
                                <FormItem
                                    label="申请值"
                                    {...formItemLayout}
                                >
                                    <span className="stable-div" title={applyVal}>
                                        { getDayTimeFromString(applyVal) || "" }
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
                                        value = { applyVal == "" ? moment() : moment( applyVal.substring(8,12), 'HHmm') }
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
                {
                    (showName == "PRIORITY") ?
                        (timeAuth.type == "apply") ?
                            <Form>
                                <FormItem
                                    label=""
                                    {...formItemLayout}
                                >
                                    <RadioGroup
                                        onChange={(e) => {
                                            this.onRadioChange(e, 'priority')
                                        }}
                                        value={ this.state.priority }>
                                        {
                                            Object.keys(PriorityList).map((item, index) => {
                                                return (
                                                    <Radio style={radioStyle} key={item} value={item}> {PriorityList[item]} </Radio>
                                                )
                                            })
                                        }
                                    </RadioGroup>
                                </FormItem>

                                <FormItem
                                    span={ 24 }
                                    label=""
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
                                                申请
                                            </Button> : ""
                                    }
                                </FormItem>
                            </Form>
                            :
                            <Form>
                                <FormItem
                                    label="原始值"
                                    {...formItemLayout}
                                >
                                    <span className="stable-div" title={originalVal}>
                                        { getDayTimeFromString(originalVal) || "" }
                                    </span>
                                </FormItem>
                                <FormItem
                                    label="申请值"
                                    {...formItemLayout}
                                >
                                    <span className="stable-div" title={applyVal}>
                                        { getDayTimeFromString(applyVal) || "" }
                                    </span>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="申请备注"
                                >
                                    <TextArea className="stable-div" ref="comment" placeholder=""/>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="批复备注"
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
                {
                    (showName == "DELAY_REASON") ?
                        <Form>
                            <FormItem
                                label=""
                                {...formItemLayout}
                            >
                                <RadioGroup
                                    onChange={(e) => {
                                        this.onRadioChange(e, 'delay')
                                    }}
                                    value={ this.state.delay }>
                                    {
                                        Object.keys(DelayReasonList).map((item, index) => {
                                            return (
                                                <Radio style={radioStyle} key={item} value={item}> {DelayReasonList[item]} </Radio>
                                            )
                                        })
                                    }
                                </RadioGroup>
                            </FormItem>
                            {
                                this.state.delay == "OTHER" ?
                                    <FormItem
                                        span={ 24 }
                                        label=""
                                    >
                                        <TextArea ref="comment" placeholder="备注(最多100个字符)"/>
                                    </FormItem>
                                : ""
                            }
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
                                            确定
                                        </Button> : ""
                                }
                                {
                                    (isValidObject( timeAuth.cancelBtn ) &&  timeAuth.cancelBtn.show) ?
                                        <Button className="c-btn c-btn-red"
                                                onClick = { this.submitCancelForm }
                                        >
                                            清除
                                        </Button> : ""
                                }
                            </FormItem>
                        </Form>
                        :""
                }
                {
                    (showName == "DEICE_STATUS" || showName == "DEICE_GROUP" || showName == "DEICE_POSITION") ?
                        <Form>
                            <FormItem
                                label="状态"
                                {...formItemLayout}
                            >
                                <RadioGroup defaultValue="deice-position" onChange={this.handleDeiceChange}>
                                    <RadioButton value="deice-position">冰坪</RadioButton>
                                    <RadioButton value="position">机位</RadioButton>
                                </RadioGroup>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={ deice.show == "deice-position" ? "冰坪" : "机位"}
                                validateStatus={ deice.validateStatus }
                                help={ deice.help }
                            >
                                {
                                    deice.show == "deice-position" ?
                                    <Select
                                        defaultValue={ deice.deicePosition == "" ? "待定" : deice.deicePosition }
                                         onChange={(value) => {
                                            this.setState({
                                                deice: {
                                                    ...deice,
                                                    deicePosition: value
                                                }
                                            })
                                        }}
                                    >
                                        <Option value="0">待定</Option>
                                        {
                                            deicePositionArray.map(( item, index ) => (
                                                <Option key={index} value={item}>{item}</Option>
                                            ))
                                        }
                                    </Select> :
                                        <Input
                                            ref="position"
                                            placeholder="请输入机位"
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if( isValidVariable(val.trim()) && deice.validateStatus != ""){
                                                    this.setState({
                                                        deice: {
                                                            ...deice,
                                                            validateStatus: "",
                                                            help: ""
                                                        }
                                                    })
                                                }
                                            }}
                                        />
                                }
                            </FormItem>
                            <FormItem
                                label="分组"
                                {...formItemLayout}
                            >
                                <Select defaultValue={ deice.deiceGroup == "" ? deiceGroupArr[0] : deice.deiceGroup } onChange={(value) => {
                                    this.setState({
                                        deice: {
                                            ...deice,
                                            deiceGroup: value
                                        }
                                    })
                                }}>
                                    {
                                        deiceGroupArr.map(( item, index ) => (
                                            <Option key={index} value={item}>{item}</Option>
                                        ))
                                    }
                                </Select>
                            </FormItem>
                            <FormItem
                                label="备注"
                                {...formItemLayout}
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
                                            确定
                                        </Button> : ""
                                }
                                {
                                    (isValidObject( timeAuth.cancelBtn ) &&  timeAuth.cancelBtn.show) ?
                                        <Button className="c-btn c-btn-red"
                                                onClick = { this.submitCancelForm }
                                        >
                                            清除
                                        </Button> : ""
                                }
                            </FormItem>
                        </Form>
                        :""
                }
                {
                    (showName == "POSITION") ?
                        <Form>
                            <FormItem
                                {...formItemLayout}
                                label="停机位"
                                validateStatus={ position.validateStatus }
                                help={ position.help }
                            >
                                <Input
                                    ref="gatePosition"
                                    placeholder="请输入停机位"
                                    defaultValue={position.value}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if( isValidVariable(val.trim()) && position.validateStatus != ""){
                                            this.setState({
                                                position: {
                                                    ...position,
                                                    validateStatus: "",
                                                    help: ""
                                                }
                                            })
                                        }
                                    }}
                                />
                            </FormItem>
                            <FormItem
                                label="备注"
                                {...formItemLayout}
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
                                            确定
                                        </Button> : ""
                                }
                                {
                                    (isValidObject( timeAuth.cancelBtn ) &&  timeAuth.cancelBtn.show) ?
                                        <Button className="c-btn c-btn-red"
                                                onClick = { this.submitCancelForm }
                                        >
                                            清除
                                        </Button> : ""
                                }
                            </FormItem>
                        </Form>
                        :""
                }
                {
                    (showName == "RUNWAY") ?
                        <Form>
                            {
                                timeAuth.runwayArr.length > 0 ?
                                <FormItem
                                    {...formItemLayout}
                                    label="跑道"
                                >
                                    <RadioGroup
                                        onChange={(e) => {
                                            this.onRadioChange(e, 'runway')
                                        }}
                                        defaultValue = {runway}
                                        value={runway}
                                    >
                                        {
                                            timeAuth.runwayArr.map((item, index) => (
                                                <Radio key={index} value={item}>{item}</Radio>
                                            ))
                                        }
                                    </RadioGroup>
                                </FormItem> : ""
                            }
                            <FormItem
                                label="备注"
                                {...formItemLayout}
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
                                            确定
                                        </Button> : ""
                                }
                                {
                                    (isValidObject( timeAuth.cancelBtn ) &&  timeAuth.cancelBtn.show) ?
                                        <Button className="c-btn c-btn-red"
                                                onClick = { this.submitCancelForm }
                                        >
                                            清除
                                        </Button> : ""
                                }
                            </FormItem>
                        </Form>
                        :""
                }

            </div>
        )


    }
};

export default FormDialog;