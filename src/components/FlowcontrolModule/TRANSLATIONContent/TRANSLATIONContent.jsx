//大面积延误流控页面
import React from 'react';
import { Row, Col, Icon, Button, Card, Form, Input, Checkbox, Select, Radio, DatePicker, TimePicker, Modal, Spin,    } from 'antd';
import Loader from 'components/Loader/Loader';
import { getPointByAirportUrl, getFlowcontrolTemplateUrl, publishFlowcontrolUrl, updateFlowcontrolUrl,getFlowcontrolByIdUrl } from 'utils/request-urls';
import {  request, requestGet } from 'utils/request-actions';
import moment from 'moment';
import './TRANSLATIONContent.less';
import {isValidVariable, isValidObject} from "utils/basic-verify";
import {AuthorizationUtil} from "utils/authorization-util";
import  { FlowcontrolDataUtil }  from 'utils/flowcontrol-data-util';
const FormItem = Form.Item;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const { Option } = Select;


class TRANSLATIONContent extends React.Component{
    constructor( props ){
        super(props);


        this.handleValidateFlowcontrolType = this.handleValidateFlowcontrolType.bind(this);

        this.getFlowcontrolData = this.getFlowcontrolData.bind(this);
        this.updateOriginalData = this.updateOriginalData.bind(this);

        this.onEndTimeChange = this.onEndTimeChange.bind(this);
        this.getDateTime = this.getDateTime.bind(this);
        //验证规则
        this.validateFlowcontrolValue = this.validateFlowcontrolValue.bind(this);
        this.validateStartDate = this.validateStartDate.bind(this);
        this.validateStartTime = this.validateStartTime.bind(this);
        this.validateEndDate = this.validateEndDate.bind(this);
        this.validateEndTime = this.validateEndTime.bind(this);

        this.ForceTriggerValidate = this.ForceTriggerValidate.bind(this);

        this.confirmSubmit = this.confirmSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleConvertFormData = this.handleConvertFormData.bind(this);
        this.handleSubmitCallback = this.handleSubmitCallback.bind(this);
        this.updateFlowcontrolData = this.updateFlowcontrolData.bind(this);
        this.state = {

            loading : false, // 加载
            originalData: {}, // 流控原数据(修改页面用)
            pageType : '发布' // 发布或修改 默认是发布
        }
    }

    // 获取流控数据(修改页面)
    getFlowcontrolData(){
        // 取流控id
        const {id} = this.props;
        // 用户id
        const { userId } = this.props.loginUserInfo;
        // 若流控id有效,则是修改
        if(id){

            const param = {
                userId,
                id,
            };
            // 开启加载
            this.setState({
                loading : true,
            });
            request(getFlowcontrolByIdUrl, 'POST', param, this.updateOriginalData)
        }
    }
    // 更新流控原数据
    updateOriginalData(res) {
        // 获取流控数据成功
        if(res && 200 == res.status){
            // 流控数据
            const { flowcontrol } = res;
            if(isValidObject(flowcontrol)){

                // 更新State
                    this.setState({
                        originalData: flowcontrol,
                        pageType : flowcontrol.id ? '修改' : '发布'
                    },()=>{
                        // 关闭加载
                        this.setState({
                            loading : false,

                        });
                    })
            }
        }
    }


    // 处理限制类型校验
    handleValidateFlowcontrolType(errors,values){
        let _form = this.props.form;

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

            // 再校验限制受控点
            _form.validateFields(['points'],{
                force : true,
            }, this.handleValidateFlowcontrolPoint);

        }

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
    };


    // 获取开始和截止日期时间
    getDateTime = () => {
        const _form = this.props.form;
        let {startDate, startTime, endDate, endTime} = _form.getFieldsValue(['startDate', 'startTime', 'endDate', 'endTime']);
        const dateFormat = 'YYYYMMDD';
        const timeFormat = 'HHmm';
        startDate = startDate ? startDate.format(dateFormat) : '';
        startTime = startTime ? startTime.format(timeFormat) : '';
        endDate = endDate ? endDate.format(dateFormat) : '';
        endTime = endTime ? endTime.format(timeFormat) : '';
        let startDateTime = startDate + startTime;
        let endDateTime = endDate + endTime;
        return {
            startDate,
            startTime,
            endDate,
            endTime,
            startDateTime,
            endDateTime
        }
    };
    // 对指定表单域再次校验
    /**
     * @param  arr 指定表单域名 数组 每项必须为字符串
     *
     * @param  every 是否对指定的每一个表单域进行再次校验 布尔  false 仅对未通过的表单域进行再次校验  true 对每一个表单域进行再次校验
     *
     * */
    ForceTriggerValidate = (arr, every) => {
        const _form = this.props.form;
        // 对指定的全部再次校验
        if(every){
            // 遍历对每一个进行再次校验
            arr.map((item) => {
                _form.validateFields([item], {
                    force: true,
                });
            });
        }else { // 仅对未通过的表单域进行再次校验

            // 遍历
            arr.map((item)=>{
                // 获取这个输入控件的 Error
                let err = _form.getFieldError(item);
                // 若Error有效，即这个输入控件之前经过校验且校验不通过，则对其再次校验
                if(err){
                    _form.validateFields([item],{
                        force:true,
                    });
                }
            });
        }
    };


    // 开始日期--校验规则
    validateStartDate = (rule, value, callback) => {
        const { startDate, startTime, endDate, endTime,startDateTime, endDateTime } = this.getDateTime();
        if (startDate != "" && startTime != ""
            && endDate != "" && endTime != "") {
            if(startDateTime *1 >= endDateTime *1){
                callback("开始时间不能晚于截止时间");
            }else {
                callback();
                this.ForceTriggerValidate(['startTime', 'endDate', 'endTime'],false);
            }
        }else {
            callback();
        }
    };
    // 开始时间--校验规则
    validateStartTime = (rule, value, callback) => {
        const { startDate, startTime, endDate, endTime,startDateTime, endDateTime } = this.getDateTime();
        if (startDate != "" && startTime != ""
            && endDate != "" && endTime != "") {
            if(startDateTime *1 >= endDateTime *1){
                callback("开始时间不能晚于截止时间");
            }else {
                callback();
                this.ForceTriggerValidate(['startDate', 'endDate', 'endTime'],false);
            }
        }else {
            callback();
        }


    };
    // 截止日期--校验规则
    validateEndDate = (rule, value, callback) => {
        const { startDate, startTime, endDate, endTime,startDateTime, endDateTime } = this.getDateTime();
        if (startDate != "" && startTime != ""
            && endDate != "" && endTime != "") {
            if(startDateTime *1 >= endDateTime *1){
                callback("截止时间不能早于开始时间");
            }else {
                callback();
                this.ForceTriggerValidate(['startDate', 'startTime', 'endTime'],false);
            }
        }else {
            callback();
        }


    };
    // 截止时间--校验规则
    validateEndTime = (rule, value, callback) => {
        const { startDate, startTime, endDate, endTime,startDateTime, endDateTime } = this.getDateTime();
        if (startDate != "" && startTime != ""
            && endDate != "" && endTime != "") {
            if(startDateTime *1 >= endDateTime *1){
                callback("截止时间不能早于开始时间");
            }else {
                callback();
                this.ForceTriggerValidate(['startDate', 'startTime', 'endDate'],false);
            }
        }else {
            callback();
        }
        
    };



    //截止时间改变
    onEndTimeChange( timemoment, timeString ){
        const { startDate, startTime, endDate, endTime, } = this.getDateTime();
        let newDate = '';
        const dateFormat = 'YYYYMMDD';
        // 自动填充结束日期
        if(timeString!='' && startDate !=''  && startTime !='' && endDate == ''){
            // 截止时间小于或等于开始时间，则截止日期为开始日期后1天
            if(timeString*1 <= startTime*1){
                newDate = moment(moment(startDate).add(1, 'day')).endOf('day');
            }else {
                // 截止时间大于开始时间，则截止日期与开始日期相同
                newDate =  moment(startDate,dateFormat);
            }
            const _form = this.props.form;
            //更新截止日期
            _form.setFieldsValue({
                endDate: newDate
            });
        }

    }


    // 处理表单提交
    handleSubmit(e){
        e.preventDefault();
        // 全部校验表单组件
        const _form = this.props.form;
        _form.validateFieldsAndScroll({
            force:true,
        },(err, values) => {
            //校验通过
            if (!err) {
                // 确认提交
                this.confirmSubmit()
            }
        });
    }
    // 确认提交
    confirmSubmit() {
        const handleConvertFormData = this.handleConvertFormData;
        const {  pageType } = this.state;
        Modal.confirm({
            // iconType : 'exclamation-circle',
            title: '提示',
            content:`确定${pageType}本条流控` ,
            cancelText: '取消',
            okText: `确认${pageType}`,
            onOk(){ handleConvertFormData() },
        });
    }
    // 转换表单字段数据并提交
    handleConvertFormData(){
        // 流控id
        const {id, controlDepDirection} = this.state.originalData;
        // 获取全部组件的值
        const data = this.props.form.getFieldsValue();
        const { loginUserInfo, systemConfig } = this.props;
        // 拷贝组件数据
        let flow = JSON.parse(JSON.stringify(data));
        // 设置id
        if(id){
            flow.id = id;
        }
        // 流控类型 (1:非长期  0:长期)
        flow.flowcontrolType = 1; // 固定值
        // 限制时间
        const { startDateTime, endDateTime } = this.getDateTime(); // 获取开始和截止日期时间
        flow.startTime = startDateTime;
        flow.endTime = endDateTime;

        // 删除无用字段
        delete flow.startDate;
        delete flow.endDate;

        // 受控起飞机场
        flow.controlDepDirection = controlDepDirection || loginUserInfo.airports;

        // 发布者
        flow.publishUser = loginUserInfo.username;
        // 系统
        flow.source = systemConfig.system;

        // 流控类型(POINT:航路流控)
        flow.placeType = 'AP';// 固定值
        // 开始前压缩策略,必传
        flow.compressAtStartStrategy = 'ALL'; // 固定值
        // 流控起降类型,必传
        flow.flowType = 'DEP'; // 固定值
        // 未知,必传
        flow.priority = ''; // 固定值
        // 预锁航班时隙变更策略
        flow.strategy = "ALL";

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
        // 开启加载
        this.setState({
            loading : true
        });
        // 提交数据
        let url = id ? updateFlowcontrolUrl : publishFlowcontrolUrl;
        request(url,'POST',JSON.stringify(params),this.handleSubmitCallback);
    }
    // 表单提交回调函数
    handleSubmitCallback(res){
        const {  pageType } = this.state;
        const { status, flowcontrol} = res;
        //
        const { clickCloseBtn, dialogName } = this.props;
        // 关闭加载
        this.setState({
            loading : false
        });
        if(status == 200){
            Modal.success({
                title: `流控${pageType}成功`,
                content: `流控${pageType}成功`,
                okText: '确认',
                onOk(){
                    clickCloseBtn(dialogName);
                },
            });
            // 更新流控数据
            this.updateFlowcontrolData(res);
        }else if(status != 200 && res.error){
            Modal.error({
                title: `流控${pageType}失败`,
                content: res.error.message,
                okText: '确认',
                onOk(){ },
            });
        }
    }

    /**
     * 更新流控数据
     * @param res 流控接口数据
     * */
    updateFlowcontrolData(res){
        const {updateMultiFlowcontrolDatas} = this.props;
        const {flowcontrol, flowcontrolList, authMap} = res;
        const flowcontrolDataMap = {};

        if(flowcontrol){
            const flowcontrolID = flowcontrol.id;
            flowcontrolDataMap[flowcontrolID] = flowcontrol;
        }else if(flowcontrolList){
            flowcontrolList.map((item)=> {
                const flowcontrolID = item.id;
                flowcontrolDataMap[flowcontrolID] = item;
            })
        }
        // 转换数据
        const data = FlowcontrolDataUtil.connectAuth(flowcontrolDataMap, authMap);
        // 更新到流控列表数据集合
        updateMultiFlowcontrolDatas(data);
    }

    //
    componentDidMount(){

        // 获取流控数据(修改页面)
        this.getFlowcontrolData();
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
        const Layout21 = { span: 21 };
        const Layout10 = { span: 10 };
        const Layout9 = { span: 9 };
        const Layout8 = { span: 8 };
        const Layout6 = { span: 6 };
        const Layout5 = { span: 5 };
        const Layout4 = { span: 4 };
        const Layout3 = { span: 3 };
        const { originalData} = this.state;

        const { clickCloseBtn, dialogName, generateTime, loginUserInfo, id} = this.props;
        // 用户权限
        const {allAuthority} = loginUserInfo;
        // 数据生成时间
        const {time} = generateTime;
        // 数据日期
        const standardDate = time ? time.substring(0,8):'';
        // 数据时间
        const standardTime = time ? time.substring(8,12):'';

        const dateFormat = 'YYYYMMDD';
        const timeFormat = 'HHmm';
        const { getFieldDecorator } = this.props.form;
        const type = this.props.form.getFieldValue("type");
        const strategy = this.props.form.getFieldValue("strategy");

        // 校验规则
        const rulesGenerate = {
            // 流控名称
            name: getFieldDecorator("name", {
                initialValue: originalData.name || '',
                rules: [
                    {
                        required: true,
                        message: "请输入流控名称"
                    }
                ]
            }),

            // 发布用户
            publishUserZh : getFieldDecorator("publishUserZh",{
                initialValue: originalData.publishUserZh || this.props.loginUserInfo.description,
                rules: []
            }),
            // 原发布单位
            originalPublishUnit: getFieldDecorator("originalPublishUnit",{
                initialValue: originalData.originalPublishUnit || "流量室",
                rules: []
            }),
            // 开始日期
            startDate: getFieldDecorator("startDate",{
                initialValue: originalData.startTime ? moment(originalData.startTime.substring(0,8), dateFormat ) : moment( standardDate, dateFormat ),
                rules: [
                    { required: true,
                        message: "开始日期不能为空"
                    },
                    {
                        validator :  this.validateStartDate
                    } // 日期时间比较
                ]
            }),
            // 开始时间
            startTime: getFieldDecorator("startTime", {
                initialValue: originalData.startTime ? moment(originalData.startTime.substring(8,12), 'HHmm' ) : moment(standardTime, 'HHmm'),
                rules: [
                    {
                        required: true,
                        message: '开始时间不能为空'
                    },
                    {
                        validator :  this.validateStartTime
                    } // 日期时间比较

                ]
            }),
            // 截止日期
            endDate: getFieldDecorator("endDate",{
                initialValue: originalData.endTime ? moment(originalData.endTime.substring(0,8), dateFormat ) : null,
                rules: [
                    {
                        required: true,
                        message: '截止日期不能为空'
                    },
                    {
                        validator :  this.validateEndDate
                    }, // 日期时间比较
                ]
            }),
            // 截止时间
            endTime: getFieldDecorator("endTime",{
                initialValue: originalData.endTime ? moment(originalData.endTime.substring(8,12), 'HHmm' ) : null,
                rules: [
                    {
                        required: true,
                        message: '截止时间不能为空'
                    },
                    {
                        validator :  this.validateEndTime
                    }, // 日期时间比较
                ]
            }),

            // 限制类型
            type: getFieldDecorator("type", {
                initialValue: originalData.type || "TRANSLATION",
                rules: [
                    {
                        required: true,
                        message: "请选择限制类型"
                    },
                ]
            }),
            // 恢复用时
            valueStr: getFieldDecorator("valueStr", {
                initialValue: originalData.value || '',
                rules: [
                    {
                        required: true,
                        message: '请输入正整数'
                    },
                    {
                        validator :  this.validateFlowcontrolValue
                    } // 正整数
                ]
            }),

            // 限制原因
            reason: getFieldDecorator("reason", {
                initialValue: originalData.reason || '',
                rules: [
                    {
                        required: true,
                        message: "请选择限制原因"
                    }
                ]
            }),
        };
        return (
            <Form className="ap-flowcontrol-form" layout="vertical" onSubmit={this.handleSubmit} >
                {/*/!* 内容 *!/*/}
                <Row className="content ap-flowcontrol-dialog">
                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >
                            <div className="row-title">
                                基本信息
                            </div>

                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout3}>
                                    <div className="label"><i className="iconfont icon-star-sm"></i>流控名称</div>
                                </Col>
                                <Col {...Layout10}>
                                    <FormItem>
                                        {
                                            rulesGenerate.name(
                                                <Input
                                                    placeholder="请输入流控名称"
                                                    title = {name}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>
                                <Col {...Layout3}>
                                    <div className="label">发布用户</div>

                                </Col>
                                <Col {...Layout9}>
                                    {
                                        rulesGenerate.publishUserZh(
                                            <Input placeholder="请输入发布者"  disabled ={true} />
                                        )
                                    }

                                </Col>
                                <Col {...Layout4} className="text-center">
                                    <div className="label">原发布者</div>

                                </Col>
                                <Col {...Layout5}>
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
                            <div className="row-title">
                                延误时间范围
                            </div>

                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout3}>
                                    <div className="label"><i className="iconfont icon-star-sm"></i>起始时间</div>

                                </Col>
                                <Col {...Layout4}>
                                    <FormItem>
                                        {
                                            rulesGenerate.startDate(
                                                <DatePicker
                                                    className = "date-picker"
                                                    // allowClear = {false} // 不显示清除按钮
                                                    disabledDate={ (current) => {
                                                        //不能选早于今天的 false显示 true不显示
                                                        //明天
                                                        const tomorrow = moment(moment(standardDate).add(1, 'day')).endOf('day');
                                                        //今天
                                                        const today = moment(standardDate).startOf('day');
                                                        //只能选今明两天
                                                        return current < today || current > tomorrow;
                                                    } }
                                                    format={dateFormat}
                                                    // onChange={ this.onStartDateChange }
                                                    placeholder="开始日期,必选项"
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col {...Layout4}>
                                    <FormItem>
                                        {
                                            rulesGenerate.startTime(
                                                <TimePicker
                                                    className = "time-picker"
                                                    // allowEmpty = { false} // 不显示清除按钮
                                                    format={timeFormat}
                                                    // onChange={ this.onStartTimeChange }
                                                    placeholder="开始时间,必选项"
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col {...Layout4} offset={1} className="text-center">
                                    <div className="label">
                                        <i className="iconfont icon-star-sm"></i>
                                        截止时间
                                    </div>

                                </Col>
                                <Col {...Layout4}>
                                    <FormItem>
                                        {
                                            rulesGenerate.endDate(
                                                <DatePicker
                                                    allowClear={true} // 显示清除按钮
                                                    placeholder="截止日期,必选项"
                                                    disabledDate={ (current) => {
                                                        //不能选早于今天的 false显示 true不显示
                                                        //今天
                                                        const today = moment(standardDate).startOf('day');
                                                        //不能选早于今天
                                                        return current < today;
                                                    } }

                                                    format={dateFormat}
                                                    // onChange={ this.onEndDateChange }
                                                />
                                            )
                                        }


                                    </FormItem>
                                </Col>
                                <Col {...Layout4}>
                                    <FormItem>
                                        {
                                            rulesGenerate.endTime(
                                                <TimePicker
                                                    format={timeFormat}
                                                    onChange={ this.onEndTimeChange }
                                                    placeholder="截止时间,必选项"

                                                />
                                            )
                                        }

                                    </FormItem>
                                </Col>

                            </Row>

                        </Col>
                    </Col>
                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >
                            <div className="row-title">
                                限制类型
                            </div>

                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout3}>
                                    <div className="label"><i className="iconfont icon-star-sm"></i>类型</div>

                                </Col>
                                <Col {...Layout9}>
                                    {
                                        rulesGenerate.type(
                                            <RadioGroup
                                                // onChange={this.handleChangeType}
                                            >
                                                {
                                                    AuthorizationUtil.hasAuthorized(allAuthority,420) ?
                                                        <Radio value="TRANSLATION">大面积延误</Radio>
                                                        : ''
                                                }
                                            </RadioGroup>
                                        )
                                    }
                                </Col>
                                <Col {...Layout4} className="text-center">
                                    <div className="label">
                                        <i className="iconfont icon-star-sm"></i>
                                        恢复用时
                                    </div>

                                </Col>
                                <Col {...Layout6}>
                                    <FormItem>
                                        {
                                            rulesGenerate.valueStr(
                                                <Input placeholder="恢复用时" className="limit-value" />
                                            )
                                        }
                                        <span className="unit label">小时</span>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Col>


                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >
                            <div className="row-title">
                                限制原因
                            </div>
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout3}>
                                    <div className="label"><i className="iconfont icon-star-sm"></i>原因</div>
                                </Col>
                                <Col {...Layout21}>
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
                {
                    this.state.loading ? <Loader/> : ''
                }
            </Form>
        )
    }
};

export default Form.create()(TRANSLATIONContent) ;