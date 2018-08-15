//机场流控页面
import React from 'react';
import { Row, Col, Icon, Button, Card, Form, Input, Checkbox, Select, Radio, DatePicker, TimePicker     } from 'antd';
import { getPointByAirportUrl, publishFlowcontrolUrl } from 'utils/request-urls';
import {  request } from 'utils/request-actions';
import moment from 'moment';
import './APContent.less';
import {isValidVariable} from "utils/basic-verify";

const FormItem = Form.Item;
const Search = Input.Search;
const RadioGroup = Radio.Group;

class APContent extends React.Component{
    constructor( props ){
        super(props);
        this.splicingName = this.splicingName.bind(this);
        this.splicingGSTypeName = this.splicingGSTypeName.bind(this);
        this.splicingREQTypeName = this.splicingREQTypeName.bind(this);
        this.splicingTimeTypeName = this.splicingTimeTypeName.bind(this);
        this.splicingAssignTypeName = this.splicingAssignTypeName.bind(this);


        this.handleValidateFlowcontrolType = this.handleValidateFlowcontrolType.bind(this);
        this.handleValidateFlowcontrolValue = this.handleValidateFlowcontrolValue.bind(this);
        this.handleValidateFlowcontrolAssignSlot = this.handleValidateFlowcontrolAssignSlot.bind(this);

        this.getPointByAirport = this.getPointByAirport.bind(this);
        this.updatePoints = this.updatePoints.bind(this);
        this.handleChangeLevel = this.handleChangeLevel.bind(this);
        this.handleChangeAssignSlot = this.handleChangeAssignSlot.bind(this);

        this.onChangeFlowcontrolPoint = this.onChangeFlowcontrolPoint.bind(this);

        this.onStartDateChange = this.onStartDateChange.bind(this);
        this.onStartTimeChange = this.onStartTimeChange.bind(this);
        this.onEndDateChange = this.onEndDateChange.bind(this);
        this.onEndTimeChange = this.onEndTimeChange.bind(this);

        //验证规则
        this.validateFlowcontrolName = this.validateFlowcontrolName.bind(this);
        this.validateFlowcontrolValue = this.validateFlowcontrolValue.bind(this);
        this.validateFlowcontrolAssignSlot = this.validateFlowcontrolAssignSlot.bind(this);
        this.validateAirportFormat = this.validateAirportFormat.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitCallback = this.handleSubmitCallback.bind(this);
        // 数据生成时间
        const { time } = this.props.generateTime;

        this.state = {
            // 高度选项
            levelValues: [600,900,1200,1500,1800,2100,2400,2700,3000,3300,3600,3900,4200,4500,4800,5100,5400,5700,6000,
                6300,6600,6900,7200,7500,7800,8100,8400,8900,9200,9500,9800,10100,10400,10700,11000,11300,11600,11900,12200,12500,13100,13700,14300,14900],
            // 高度选项
            levelOptions: [],
            // 勾选的高度值
            controlLevel:[],

            flowcontrolPointsList : [], // 流控点集合
            checkedControlPoints : [], // 勾选的限制流控点(含所属组,不用作最终表单提交)
            controlPoints : [], // 勾选的限制流控点(不含所属组,用于最终表单提交)

            startDate : time.substring(0,8) || moment().format('YYYYMMDD'),
            startTime : time.substring(8,12) || moment().format('HHmm'),
            endDate : '',
            endTime : '',

        }
    }
    // 转换高度选项
    connetLevel(){
        let arr = this.state.levelValues;
        let result = [];
        arr.map((item)=>{
            result.push(<Option key={item.toString(10)}>{item.toString(10)}</Option>)
        });

        this.setState({
            levelOptions : result
        })
    }

    // 依据机场获取流控点(受控点)数据
    getPointByAirport(){
        const { loginUserInfo } = this.props;
        // 用户关注机场即开始点
        const { airports } = loginUserInfo;
        // 参数
        const params = {
            startWaypoints : airports
        };
        // 发送请求
        request(getPointByAirportUrl, 'POST', params, this.updatePoints );
    }
    // 更新流控点
    updatePoints(res) {
        let  { flowcontrolPointsList = [] } = res;
        // 过滤流控点
        flowcontrolPointsList = flowcontrolPointsList.filter((item) => {
            if('AP' == item.type){ // 类型为AP(机场)的
                // 解析JSON字符串
                item.points = JSON.parse(item.points);
                return true
            }
        });
        // 处理数据
        flowcontrolPointsList.map((item) =>{
            // 增加value属性，用于记录其所属组值
            item.points.map((i,ind) =>{
                let value = i.name+'_' + i.group; // 以下划线分隔值与所属组值
                i.value= value;
            })
        });
        this.setState({
            flowcontrolPointsList
        })
    }

    // 拼接流控名称
    splicingName () {
        let _form = this.props.form;
        // 先校验限制类型
        _form.validateFields(['type'],{
            force : true,
        }, this.handleValidateFlowcontrolType);
    }
    // 处理限制类型校验
    handleValidateFlowcontrolType(errors,values){
        let _form = this.props.form;
        let res = '';
        let type = _form.getFieldValue('type');
        // 校验不通过
        if (errors) {
            // 设置流控名称输入框校验
            _form.setFields({
                name: {
                    value: '',
                    errors: [new Error('请先选择限制类型')],
                },
            })
        }else { // 校验通过
            if(type == 'GS'){ // 限制类型为地面停止
                this.splicingGSTypeName();
            }else if(type == 'REQ'){ // 限制类型为开车申请
                this.splicingREQTypeName();
            }else if(type == 'TIME'){ // 限制类型为时间
                this.splicingTimeTypeName();
            }else if(type == 'ASSIGN'){ // 限制类型为指定时隙
                this.splicingAssignTypeName();
            }
        }

    }
    // 拼接时间限制类型
    splicingTimeTypeName() {
        let _form = this.props.form;
        // 先校验限制类型数值
        _form.validateFields(['value'],{
            force : true,
        }, this.handleValidateFlowcontrolValue);
    }
    // 处理限制数值校验
    handleValidateFlowcontrolValue(errors,values){
        let _form = this.props.form;
        let res = '';
        const { value,controlDepDirection  } = _form.getFieldsValue(['value', 'controlDepDirection']);
        const { controlPoints } = this.state;
        // 校验不通过
        if (errors) {
            setTimeout(()=>{
                // 设置流控名称输入框校验
                _form.setFields({
                    name: {
                        value: '',
                        errors: [new Error('请输入有效的限制数值后再自动命名')],
                    },
                })
            },500)
        }else {
            // 若未勾选限制流控点,则以受控起飞机场命名
            if(controlPoints.length < 1) {
                res = controlDepDirection + '放行 限制间隔' + value + '分钟'
            }else {
                // 若勾选限制流控点,则以勾选的限制流控点命名
                res = controlPoints.join(',') + ' 限制间隔' + value + '分钟'
            }
            // 设置流控名称
            _form.setFieldsValue({
                name : res
            })
        }
    }

    // 拼接地面停止限制类型流控名称
    splicingGSTypeName () {
        // 结果
        let res = '';
        let _form = this.props.form;
        let controlDepDirection = _form.getFieldValue('controlDepDirection');
        const { controlPoints } = this.state;

        // 若未勾选限制流控点,则以受控起飞机场命名
        if(controlPoints.length < 1) {
            res = controlDepDirection + ' 地面停止'
        }else {
            // 若勾选限制流控点,则以勾选的限制流控点命名
            res = controlPoints.join(',') + ' 地面停止'
        }
        // 设置流控名称
        _form.setFieldsValue({
            name : res
        })
    };
    // 拼接开车申请限制类型流控名称
    splicingREQTypeName() {
        // 结果
        let res = '';
        let _form = this.props.form;
        let controlDepDirection = _form.getFieldValue('controlDepDirection');
        const { controlPoints } = this.state;
        // 若未勾选限制流控点,则以受控起飞机场命名
        if(controlPoints.length < 1) {
            res = controlDepDirection + ' 开车申请'
        }else {
            // 若勾选限制流控点,则以勾选的限制流控点命名
            res = controlPoints.join(',') + ' 开车申请'
        }
        // 设置流控名称
        _form.setFieldsValue({
            name : res
        })
    }
    // 拼接指定时隙限制类型流控名称
    splicingAssignTypeName(){
        let _form = this.props.form;
        // 先校验指定分钟
        _form.validateFields(['assignSlot'],{
            force : true,
        }, this.handleValidateFlowcontrolAssignSlot);
    }

    // 处理限制数值校验
    handleValidateFlowcontrolAssignSlot(errors,values){
        let _form = this.props.form;
        let res = '';
        const { assignSlot,controlDepDirection  } = _form.getFieldsValue(['assignSlot', 'controlDepDirection']);
        const { controlPoints } = this.state;
        // 校验不通过
        if (errors) {
            setTimeout(()=>{
                // 设置流控名称输入框校验
                _form.setFields({
                    name: {
                        value: '',
                        errors: [new Error('请输入有效的指定分钟后再自动命名')],
                    },
                })
            },500)
        }else {
            // 若未勾选限制流控点,则以受控起飞机场命名
            if(controlPoints.length < 1) {
                res = controlDepDirection + '放行 指定时隙 ' + assignSlot.join(',') + '分钟各一架次'
            }else {
                // 若勾选限制流控点,则以勾选的限制流控点命名
                res = controlPoints.join(',') + ' 指定时隙 ' + assignSlot.join(',') + '分钟各一架次'
            }
            // 设置流控名称
            _form.setFieldsValue({
                name : res
            })
        }
    }

    // 变更高度
    handleChangeLevel(value){

        this.setState({
            controlLevel : value
        })
        console.log(value);
    }
    // 变更限制流控点
    onChangeFlowcontrolPoint(e){
        // 删除与指定项组不同的其他项
        const  removeOtherGroupItem = ( val, checkedValue ) =>{
            // 取选中的checkbox值所属group值, _之后的字符串 如: 'ZYG_APPFIX' 取'APPFIX'
            let group = val.substring(val.indexOf('_')+1);
            checkedValue = checkedValue.filter((item,index) =>{
                // 取到所属组值
                let _group = item.substring(item.indexOf('_')+1);
                // 若所属组值相同则返回该项
                if(_group === group){
                    return true;
                }else {
                    return false;
                }
            });
            return checkedValue;
        };

        let val = e.target.value;
        let checked = e.target.checked;
        let checkedValue = this.state.checkedControlPoints;
        if(checked){
            // 先删除与选中的值所属组不同的数据
            checkedValue = removeOtherGroupItem(val, checkedValue);
            // 添加选中的值
            checkedValue.push(val);
        }else {
            // 删除选中的值
            checkedValue.splice(checkedValue.indexOf(val),1);
        }

        let points = [];
        checkedValue.map((item) => {
            // 截取流控点名称
            let val =  item.substring(0, item.indexOf('_'));
            points.push(val);
        });

        // 更新checkedControlPoints
        this.setState({
            checkedControlPoints : checkedValue
        },this.handleChangeControlPoints);


    }

    // 更新勾选的限制流控点(不含所属组)
    handleChangeControlPoints() {
        // 取勾选的限制流控点(含所属组)
        const { checkedControlPoints } = this.state;
        let points = [];
        checkedControlPoints.map((item) => {
            // 截取流控点名称
            let val =  item.substring(0, item.indexOf('_'));
            points.push(val);
        });
        console.log(points)
        // 更新controlPoints
        this.setState({
            controlPoints: points
        })
    }

    // 变更指定分钟
    handleChangeAssignSlot(value, option){

    }


    //限制数值--校验规则
    validateFlowcontrolValue = (rule, value, callback) => {
        if( !isValidVariable(value) ){
            callback('请输入正整数');
        }
        const regexp = /^[1-9]\d*$/;
        const valid = regexp.test(value);
        if(!valid){
            callback('请输入正整数')
        }else {
            callback();
        }
    }
    // 指定分钟--校验规则
    validateFlowcontrolAssignSlot = (rule, value, callback) => {
        // 数据无效
        if(!value){
            callback('请输入指定分钟数值');
            return
        }
        // 取输入数值集合(数组)长度
        let len = value.length;
        if( len < 1 ){
            callback('请输入指定分钟数值');
            return;
        }
        // 取最后一个值
        let lastVal = value[len-1];
        // 00~59正整数 正则
        const regexp = /^[0-5]{1}[0-9]{1}$/;
        const valid = regexp.test(lastVal);
        if(!valid){
            callback('请输入00~59正整数');
            return;
        }else {
            if(len < 2){
                callback();
            }else {

                for (let i=0; i<len-1; i++){
                    let val = value[i];
                    let next = value[i+1];
                    if( val*1 > next*1 ){
                        callback('请按升序输入');
                        return
                    }else if(next*1 - val*1 <5 ){
                        callback('间隔要大于等于5');
                        return
                    }
                }
                callback();

                // let secondLast = value[len-2];
                // if( lastVal*1 <= secondLast*1 ){
                //     callback('请按升序输入');
                // }else if((lastVal*1 - secondLast*1) < 5 ){
                //     callback('间隔要大于等于5');
                // }else {
                //     callback();
                // }
            }
        }
    }
    // 机场名称格式--校验规则
    validateAirportFormat = (rule, value, callback) =>{
        // 数据为undefined，即没有输入任何值
        if(undefined === value ){
            callback();
            return
        }
        // 取输入数值集合(数组)长度
        let len = value.length;
        if( len < 1 ){
            callback();
            return;
        }
        // 取最后一个值
        let lastVal = value[len-1];
        const regexp = /(^[a-zA-Z]{4}|^[a-zA-Z]{2}[\?]{2}|^[a-zA-Z]{3}[\?]{1})([,]([a-zA-Z]{4}|[a-zA-Z]{2}[\?]{2}|[a-zA-Z]{3}[\?]{1}))*$/;
        const valid = regexp.test(lastVal);
        if(!valid){
            callback('请输入正确的机场格式(AAAA,BBC?,AB??,AACC)');
            return;

        }else {

            if(len < 2){
                callback();
                return;
            }else {
                for (let i=0; i<len; i++){
                    const validate = regexp.test(lastVal);
                    if(!validate){
                        callback('请输入正确的机场格式(AAAA,BBC?,AB??,AACC)');
                        return;
                    }
                }
                callback();
            }

        }
    }
    //流控名称--校验规则
    validateFlowcontrolName = (rule, value, callback) => {
        //若value值为空
        if( !isValidVariable(value) ){
            callback('请输入或自动命名流控名称');
        }else{
            callback();
        }
    };

    // 开始日期改变
    onStartDateChange( datemoment, dateString ){
        const { startDate } = this.state;
        if(dateString != ""){
            //更新选中的日期
            this.setState({
                startDate: dateString
            });
        }
    };

    //开始时间改变
    onStartTimeChange( timemoment, timeString ){
        const { startTime } = this.state;
        if( timeString != "" ){
            //更新选中的时间
            this.setState({
                startTime: timeString
            });
        }
    }
    // 结束日期改变
    onEndDateChange( datemoment, dateString ){
        const { endDate } = this.state;
        debugger
        //更新选中的日期 可以为空
        this.setState({
            endDate: dateString
        });
    };

    //结束时间改变
    onEndTimeChange( timemoment, timeString ){
        const { endTime } = this.state;

        //更新选中的时间 可以为空
        this.setState({
            endTime: timeString
        });
    }

    // 处理表单提交
    handleSubmit(e){
        e.preventDefault();
        const _form = this.props.form;
        _form.validateFieldsAndScroll((err, values) => {
            //校验通过
            if (!err) {
                // 转换表单字段数据
                this.handleConvertFormData(values);
                console.log( values );
            }
        });
    }
    // 转换表单字段数据
    handleConvertFormData(data){
        const { loginUserInfo, systemConfig } = this.props;
        const { startDate, startTime, endDate, endTime, controlPoints, } = this.state;
        // 拷贝数据
        let flow = JSON.parse(JSON.stringify(data));
        // 处理数据

        // 流控类型 (1:非长期  0:长期)
        if(flow.flowcontrolType){
            flow.flowcontrolType = 0;
        }else {
            flow.flowcontrolType = 1;
        }
        //流控数值
        if(flow.type =='ASSIGN'){
            flow.value = flow.assignSlot.join(',');
            delete flow.assignSlot;
        }else {
            delete flow.assignSlot;
        }

        if(flow.type !=='TIME' && flow.type !=='ASSIGN'){
            delete flow.value;
        }

        // 限制时间
        flow.startTime = startDate + startTime;
        flow.endTime = endDate + endTime;

        // 限制高度
        flow.controlLevel = flow.controlLevel.join(',');

        // 限制流控点
        flow.controlPoints = controlPoints.join(',');

        // 发布者
        flow.publishUser = loginUserInfo.username;
        // 系统
        flow.source = systemConfig.system;
        // 流控类型(AP:机场流控)
        flow.placeType = 'AP', // 固定值

        // 预锁航班时隙变更策略
        flow.strategy = 'ALL'; // 待处理,
        // 预锁航班时隙变更策略 时间
        flow.winTime = ''; // 固定值
        // 未知,必传
        flow.compressAtStartStrategy = 'ALL'; // 固定值
        // 未知,必传
        flow.flowType = 'DEP'; // 固定值
        // 未知,必传
        flow.priority = ''; // 固定值

        // 参数拼接
        let params = {
            // 用户id
            userId : loginUserInfo.userId,
            // 用户名
            userName : loginUserInfo.username,
            // 用户中文名
            userNameZh: flow.publishUserZh,
            // 流控数据集合
            flowcontrol : flow
        };
        console.log(params);
        request(publishFlowcontrolUrl,'POST',JSON.stringify(params),this.handleSubmitCallback);
    }
    // 表单提交回调函数
    handleSubmitCallback(res){
        console.log(res);
    }

    //
    componentDidMount(){
        //获取受控点
        this.getPointByAirport();
        this.connetLevel();
    }


    render(){
        const BasicTitleLayout = {
            xs: 24,
            md: 24,
            lg: 4,
            xl: 3,
            xxl: 2,
            className: 'row-title'
        };
        const ContentLayout = {
            xs: 24,
            md: 24,
            lg: 20,
            xl: 21,
            xxl: 22,
            className: 'row-title'
        };
        const Layout24 = { span: 24 };
        const Layout20 = { span: 20 };
        const Layout12 = { span: 12 };
        const Layout10 = { span: 10 };
        const Layout8 = { span: 8 };
        const Layout6 = { span: 6 };
        const Layout4 = { span: 4 };
        const { flowcontrolPointsList, checkedControlPoints, levelOptions, startDate, startTime, endDate, endTime,} = this.state;
        const { clickCloseBtn, dialogName} = this.props;
        const dateFormat = 'YYYYMMDD';
        const format = 'HHmm';
        const { getFieldDecorator } = this.props.form;
        const type = this.props.form.getFieldValue("type");
        const flowcontrolTypeFlag = this.props.form.getFieldValue("flowcontrolType");

        // 校验规则
        const rulesGenerate = {
            // 流控名称
            name: getFieldDecorator("name", {
                rules: [
                    {
                        required: true,
                        message: "请输入或自动命名流控名称"
                    } 
                ]
            }),
            // 长期流控
            flowcontrolType: getFieldDecorator("flowcontrolType", {
                initialValue: false,
            }),
            // 发布用户
            publishUserZh : getFieldDecorator("publishUserZh",{
                initialValue: this.props.loginUserInfo.description,
                rules: []
            }),
            // 原发布单位
            originalPublishUnit: getFieldDecorator("originalPublishUnit",{
                initialValue: "流量室",
                rules: []
            }),

            // 限制类型
            type: getFieldDecorator("type", {
                initialValue: "TIME",
                rules: [
                    {
                        required: true,
                        message: "请选择限制类型"
                    },
                ]
            }),
            // 限制数值
            value: getFieldDecorator("value", (type =='TIME')  ? {
                rules: [
                    {
                        validator :  this.validateFlowcontrolValue
                    } // 正整数
                ]
            }:{}),


            // 指定时隙
            assignSlot: getFieldDecorator("assignSlot", {
                rules: [
                    {
                        validator : this.validateFlowcontrolAssignSlot
                    }
                ]
            }),
            // 受控起飞机场
            controlDepDirection : getFieldDecorator("controlDepDirection", {
                initialValue: this.props.loginUserInfo.airports,
                rules: []
            }),
            // 豁免起飞机场
            exemptDepDirection: getFieldDecorator("exemptDepDirection", {
                initialValue: "",
                rules: []
            }),
            // 受控降落机场
            controlDirection: getFieldDecorator("controlDirection", {
                initialValue: [],
                rules: [{
                    validator : this.validateAirportFormat
                }]
            }),
            // 豁免降落机场
            exemptDirection: getFieldDecorator("exemptDirection", {
                initialValue: [],
                rules: [{
                    validator : this.validateAirportFormat
                }]
            }),
            // 限制高度
            controlLevel : getFieldDecorator("controlLevel", {
                initialValue: [],
                rules: []
            }),
            // 限制原因
            reason: getFieldDecorator("reason", {
                rules: [
                    {
                        required: true,
                        message: "请选择限制原因"
                    }
                ]
            }),
            // 备注
            comments: getFieldDecorator("comments",{
                rules: []
            })
        };
        return (
            <Form className="" layout="vertical" onSubmit={this.handleSubmit} >
                {/*/!* 内容 *!/*/}
                <Row className="content ap-flowcontrol-dialog">
                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >
                            基本信息
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    流控名称
                                </Col>
                                <Col {...Layout10}>
                                    <FormItem>
                                        {
                                            rulesGenerate.name(
                                                <Search
                                                    placeholder="请输入流控名称"
                                                    enterButton="自动命名"
                                                    title = {name}

                                                    onSearch={this.splicingName}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col {...Layout8}>
                                    <FormItem>
                                        {
                                            rulesGenerate.flowcontrolType(
                                                <Checkbox
                                                    checked={ flowcontrolTypeFlag }
                                                >长期流控
                                                </Checkbox>
                                            )
                                        }
                                    </FormItem>

                                </Col>
                            </Row>
                            <Row>
                                <Col {...Layout4}>
                                    发布用户
                                </Col>
                                <Col {...Layout8}>
                                    {
                                        rulesGenerate.publishUserZh(
                                            <Input placeholder="请输入发布者"  disabled ={true} />
                                        )
                                    }

                                </Col>
                                <Col {...Layout4} className="text-center">
                                    原发布者
                                </Col>
                                <Col {...Layout8}>
                                    {
                                        rulesGenerate.originalPublishUnit(
                                            <Select

                                            >
                                                <Option value="流量室">流量室</Option>
                                                <Option value="塔台">塔台</Option>
                                                <Option value="进近" >进近</Option>
                                                <Option value="兰州">兰州</Option>
                                                <Option value="西安">西安</Option>
                                                <Option value="广州">广州</Option>
                                                <Option value="贵阳">贵阳</Option>
                                                <Option value="昆明">昆明</Option>
                                                <Option value="拉萨">拉萨</Option>
                                                <Option value="重庆">重庆</Option>
                                                <Option value="自定义">自定义</Option>
                                            </Select>
                                        )
                                    }



                                </Col>
                            </Row>
                        </Col>
                    </Col>
                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >
                            限制时间
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    起始时间
                                </Col>
                                <Col {...Layout8}>
                                    <DatePicker
                                        className = "date-picker"
                                        disabledDate={ (current) => {
                                            //不能选早于今天的 false显示 true不显示
                                            //明天
                                            const tomorrow = moment(moment(startDate).add(1, 'day')).endOf('day');
                                            //今天
                                            const today = moment(startDate).startOf('day');
                                            //只能选今明两天
                                            return current < today || current > tomorrow;
                                        } }
                                        value = {  startDate == "" ? moment() : moment( startDate, dateFormat ) }
                                        format={dateFormat}
                                        onChange={ this.onStartDateChange }
                                    />
                                    <TimePicker
                                        className = "time-picker"
                                        value = { startTime == "" ? moment() : moment( startTime, 'HHmm') }
                                        format={format}
                                        onChange={ this.onStartTimeChange }
                                    />
                                </Col>
                                <Col {...Layout4} className="text-center">
                                    截止时间
                                </Col>
                                <Col {...Layout8}>
                                    <DatePicker
                                        allowClear = {true} // 显示清除按钮
                                        disabledDate={ (current) => {
                                            //不能选早于今天的 false显示 true不显示
                                            //今天
                                            const today = moment(startDate).startOf('day');
                                            //不能选早于今天
                                            return current < today;
                                        } }
                                        // value = {  endDate }
                                        format={dateFormat}
                                        onChange={ this.onEndDateChange }
                                    />
                                    <TimePicker
                                        // value = { endTime }
                                        format={format}
                                        onChange={ this.onEndTimeChange }
                                    />
                                </Col>
                            </Row>

                        </Col>
                    </Col>
                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >
                            限制类型
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    类型
                                </Col>
                                <Col {...Layout8}>
                                    {
                                        rulesGenerate.type(
                                            <RadioGroup
                                            >
                                                <Radio value="TIME">时间</Radio>
                                                <Radio value="GS">地面停止</Radio>
                                                <Radio value="REQ">开车申请</Radio>
                                                <Radio value="ASSIGN">指定时隙</Radio>
                                            </RadioGroup>
                                        )
                                    }
                                </Col>
                                <Col {...Layout4} className="text-center">
                                    { (type == 'TIME') ? "限制数值" : "" }
                                    { (type == 'ASSIGN') ? "指定分钟" : "" }
                                </Col>
                                <Col {...Layout6}>
                                    { (type == 'TIME') ?
                                        <FormItem>
                                            {
                                                rulesGenerate.value(
                                                    <Input placeholder="限制数值" className="limit-value" />
                                                )
                                            }
                                            <span className="unit">分钟</span>
                                        </FormItem>
                                        : "" }
                                    { (type == 'ASSIGN') ?
                                        <FormItem>

                                            {
                                                rulesGenerate.assignSlot(
                                                    <Select
                                                        mode="tags"
                                                        placeholder="请输入00-59正整数,多个值以逗号分隔,以升序排序且间隔不小于5;"
                                                        // onChange={this.handleChangeAssignSlot}
                                                    >
                                                    </Select>
                                                )

                                            }
                                        </FormItem>
                                        : "" }
                                </Col>
                            </Row>
                        </Col>
                    </Col>
                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >
                            限制原因s
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    原因
                                </Col>
                                <Col {...Layout20}>
                                    <FormItem>
                                    {
                                        rulesGenerate.reason(
                                            <RadioGroup
                                            >
                                                <Radio value='ACC'>空管</Radio>
                                                <Radio value='WEATHER'>天气</Radio>
                                                <Radio value='AIRPORT'>机场</Radio>
                                                <Radio value='CONTROL'>航班时刻</Radio>
                                                <Radio value='EQUIPMENT'>设备</Radio>
                                                <Radio value='MILITARY'>其他空域用户</Radio>
                                                <Radio value='OTHERS'>其他</Radio>
                                            </RadioGroup>
                                        )
                                    }
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Col>
                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >
                            限制方向
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    模板
                                </Col>
                                <Col {...Layout20}>

                                </Col>
                            </Row>
                            {
                                flowcontrolPointsList.map((item) =>{
                                    return (
                                        <Row key= {item.id}>
                                            <Col {...Layout4}>
                                                { item.description }
                                            </Col>
                                            <Col {...Layout20}>
                                                {
                                                    item.points.map((it,ind) =>{
                                                        return (
                                                            <Checkbox
                                                                key={it.name + ind}
                                                                value={it.value}
                                                                onChange={this.onChangeFlowcontrolPoint}
                                                                checked={ (checkedControlPoints.indexOf(it.value) == -1 ) ? false : true }
                                                            >
                                                                { it.name }
                                                            </Checkbox>
                                                        )
                                                    })
                                                }
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                            <Row>
                                <Col {...Layout4}>
                                    受控起飞机场
                                </Col>
                                <Col {...Layout8}>
                                    {
                                        rulesGenerate.controlDepDirection(
                                            <Input
                                                placeholder="受控起飞机场"
                                                disabled ={true}
                                            />
                                        )
                                    }

                                </Col>
                                <Col {...Layout4} className="text-center">
                                    受控降落机场
                                </Col>
                                <Col {...Layout8}>
                                    <FormItem>
                                    {
                                        rulesGenerate.controlDirection(
                                            <Select
                                                mode="tags"
                                                placeholder="请输入机场,格式如:(AAAA,BBC?,AB??,AACC)"
                                            >
                                            </Select>
                                        )
                                    }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col {...Layout4} >
                                    豁免起飞机场
                                </Col>
                                <Col {...Layout8}>
                                    {
                                        rulesGenerate.exemptDepDirection(
                                            <Input placeholder="" disabled ={true} />
                                        )
                                    }

                                </Col>
                                <Col {...Layout4} className="text-center">
                                    豁免降落机场
                                </Col>
                                <Col {...Layout8}>
                                    <FormItem>
                                    {
                                        rulesGenerate.exemptDirection(
                                            <Select
                                                mode="tags"
                                                placeholder="请输入机场,格式如:(AAAA,BBC?,AB??,AACC)"
                                            >
                                            </Select>
                                        )
                                    }
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Col>
                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >
                            限制高度
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    高度
                                </Col>
                                <Col {...Layout20}>
                                    {
                                        rulesGenerate.controlLevel(
                                            <Select
                                                allowClear = {true}
                                                mode="multiple"
                                                placeholder="请选择限制高度"
                                                // onChange={this.handleChangeLevel}
                                            >
                                                { levelOptions }
                                            </Select>
                                        )
                                    }

                                </Col>
                            </Row>
                        </Col>
                    </Col>
                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >
                            备注
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    备注
                                </Col>
                                <Col {...Layout20}>
                                    {
                                        rulesGenerate.comments(
                                            <textarea placeholder="请输入备注" rows="4"  className="comments"></textarea>
                                        )
                                    }

                                </Col>
                            </Row>
                        </Col>
                    </Col>


                </Row>
                {/* 底部*/}
                <Row className="footer">
                    <Col className="" {...Layout24} >

                        <Button className= 'c-btn c-btn-default'
                                onClick={ () => {
                                    clickCloseBtn(dialogName);
                                } }
                        >
                            关闭
                        </Button>
                        <Button className='c-btn c-btn-blue'
                                type="primary"
                                htmlType="submit"
                        >
                            提交
                        </Button>
                    </Col>
                </Row>
            </Form>
        )
    }
};

export default Form.create()(APContent) ;