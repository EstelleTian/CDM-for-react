//机场流控页面
import React from 'react';
import { Row, Col, Icon, Button, Card, Form, Input, Checkbox, Select, Radio, DatePicker, TimePicker     } from 'antd';
import { getPointByAirportUrl } from 'utils/request-urls';
import {  request } from 'utils/request-actions';
import moment from 'moment';
import './APContent.less';
import {isValidVariable} from "utils/basic-verify";

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;

class APFlowcontrolDialog extends React.Component{
    constructor( props ){
        super(props);
        this.splicingName = this.splicingName.bind(this);
        this.splicingGSTypeName = this.splicingGSTypeName.bind(this);
        this.splicingREQTypeName = this.splicingREQTypeName.bind(this);

        this.handleValidateFlowcontrolType = this.handleValidateFlowcontrolType.bind(this);

        this.getPointByAirport = this.getPointByAirport.bind(this);
        this.updatePoints = this.updatePoints.bind(this);
        this.handleChangeOriginalPublishUnit = this.handleChangeOriginalPublishUnit.bind(this);
        this.handleChangeFlowcontrolType = this.handleChangeFlowcontrolType.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleChangeReason = this.handleChangeReason.bind(this);
        this.handleChangeLevel = this.handleChangeLevel.bind(this);

        this.onChangeFlowcontrolPoint = this.onChangeFlowcontrolPoint.bind(this);

        this.handleChangeLimitValueValue = this.handleChangeLimitValueValue.bind(this);
        this.handleChangeFlowcontrolName = this.handleChangeFlowcontrolName.bind(this);

        this.onStartDateChange = this.onStartDateChange.bind(this);
        this.onStartTimeChange = this.onStartTimeChange.bind(this);
        this.onEndDateChange = this.onEndDateChange.bind(this);
        this.onEndTimeChange = this.onEndTimeChange.bind(this);


        //
        this.validateFlowcontrolName = this.validateFlowcontrolName.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
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

            flowcontrolType : 1, // 长期流控  (1:非长期  0:长期)
            publishUserZh : this.props.loginUserInfo.description || '', // 发布用户
            originalPublishUnit : '', // 原发布单位
            type : '', // 限制类型

            controlDepDirection : this.props.loginUserInfo.airports, // 受控起飞机场
            reason : '', // 限制原因
            limitValue: '', // 限制数值
            name : '',
            startDate : time.substring(0,8) || moment().format('YYYYMMDD'),
            startTime : time.substring(8,12) || moment().format('HHmm'),
            // endDate : time.substring(0,8) || moment().format('YYYYMMDD'),
            // endTime : time.substring(8,12) || moment().format('HHmm'),
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
        })

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
        }
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
    // 变更流控名称
    handleChangeFlowcontrolName(e){
        let val = e.target.value;
        let _form = this.props.form;
        _form.setFieldsValue({
            name : val
        })
        console.log(this.state.name);
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
        const { type } = this.state;
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
            // 重置流控名称输入框校验
            // _form.resetFields('name');

            if(type == 'GS'){ // 限制类型为地面停止
                res = this.splicingGSTypeName();
            }else if(type == 'REQ'){ // 限制类型为开车申请
                res = this.splicingREQTypeName();
            }else if(type == 'TIME'){ // 限制类型为时间

            }else if(type == 'ASSIGN'){ // 限制类型为指定时隙

            }

            // 设置
            _form.setFieldsValue({
                name : res
            })
            console.log(this.state.name);
        }

    }
    // 拼接地面停止限制类型流控名称
    splicingGSTypeName () {
        // 结果
        let res = '';
        const { controlDepDirection, controlPoints } = this.state;

        // 若未勾选限制流控点,则以受控起飞机场命名
        if(controlPoints.length < 1) {
            res = controlDepDirection + ' 地面停止'
        }else {
            // 若勾选限制流控点,则以勾选的限制流控点命名
            res = controlPoints.join(',') + ' 地面停止'
        }
        return res;
    };
    // 拼接开车申请限制类型流控名称
    splicingREQTypeName() {
        // 结果
        let res = '';

        const { controlDepDirection, controlPoints } = this.state;
        // 若未勾选限制流控点,则以受控起飞机场命名
        if(controlPoints.length < 1) {
            res = controlDepDirection + ' 开车申请'
        }else {
            // 若勾选限制流控点,则以勾选的限制流控点命名
            res = controlPoints.join(',') + ' 开车申请'
        }
        return res;
    }

    // 变更流控类型(长期/非长期)
    handleChangeFlowcontrolType(e){
        let checked = e.target.checked;
        let val = checked ? 0 : 1;
        this.setState({
            flowcontrolType : val
        })
        console.log(checked);
    }

    // 变更原发布单位
    handleChangeOriginalPublishUnit(value){
        this.setState({
            originalPublishUnit : value
        })
    }
    // 变更流控限制类型
    handleChangeType(e) {
        let val = e.target.value;
        this.setState({
            type : val
        })
        console.log(val);
    }
    // 变更限制原因
    handleChangeReason(e) {
        let val = e.target.value;
        this.setState({
            reason : val
        })
        console.log(val);
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
        });

        // 更新controlPoints
        this.setState({
            controlPoints: points
        });
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

    // 变更限制数值
    handleChangeLimitValueValue(e){
        let val = e.target.value;
        this.setState({
            limitValue : val
        })
    }

    handleSubmit(e){
        e.preventDefault();
        const _form = this.props.form;
        _form.validateFieldsAndScroll((err, values) => {
            //success
            if (!err) {
                console.log( values );
            }
        });
    }
    //
    positiveInteger = (rule, value, callback) => {
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
    //流控名称--验证
    validateFlowcontrolName = (rule, value, callback) => {
        //若value值为空
        if( !isValidVariable(value) ){
            callback('请输入或自动命名流控名称');
        }else{
            callback();
        }
    }

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
            xxl: 2
        };
        const ContentLayout = {
            xs: 24,
            md: 24,
            lg: 20,
            xl: 21,
            xxl: 22
        };
        const Layout24 = { span: 24 };
        const Layout20 = { span: 20 };
        const Layout12 = { span: 12 };
        const Layout10 = { span: 10 };
        const Layout8 = { span: 8 };
        const Layout6 = { span: 6 };
        const Layout4 = { span: 4 };
        const {flowcontrolType, flowcontrolPointsList, checkedControlPoints,
            publishUserZh, controlDepDirection, reason, levelOptions, limitValue,
            name, startDate, startTime, endDate, endTime,
        } = this.state;
        const { clickCloseBtn, dialogName} = this.props;
        const dateFormat = 'YYYYMMDD';
        const format = 'HHmm';
        const { getFieldDecorator } = this.props.form;
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
            limitValue: getFieldDecorator("limitValue", {
                rules: [
                    {
                        validator : this.positiveInteger
                    } // 正整数
                ]
            }),
            // 指定时隙
            assignSlot: getFieldDecorator("assignSlot", {
                rules: [
                    {
                        validator : this.positiveInteger
                    } // 正整数
                ]
            }),
            // 限制原因
            reason: getFieldDecorator("reason", {
                rules: [
                    {
                        // required: true,
                        message: "请选择限制原因"
                    },// 必选
                ]
            }),
        };
        const type = this.props.form.getFieldValue("type");
        const flowcontrolTypeFlag = this.props.form.getFieldValue("flowcontrolType");
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
                                                onChange={this.handleChangeFlowcontrolName}
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
                                    <Input placeholder="请输入发布者" value={ publishUserZh } disabled ={true} />
                                </Col>
                                <Col {...Layout4}>
                                    原发布者
                                </Col>
                                <Col {...Layout8}>
                                    <Select
                                        defaultValue="流量室"
                                        onChange={this.handleChangeOriginalPublishUnit}
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
                                <Col {...Layout20}>
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
                                        value = {  startDate == "" ? moment() : moment( startDate, dateFormat ) }
                                        format={dateFormat}
                                        onChange={ this.onStartDateChange }
                                    />
                                    <TimePicker
                                        value = { startTime == "" ? moment() : moment( startTime, 'HHmm') }
                                        format={format}
                                        onChange={ this.onStartTimeChange }
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col {...Layout4}>
                                    截止时间
                                </Col>
                                <Col {...Layout20}>
                                    <DatePicker
                                        allowClear = {true} // 显示清除按钮
                                        disabledDate={ (current) => {
                                            //不能选早于今天的 false显示 true不显示
                                            //明天
                                            const tomorrow = moment(moment().add(1, 'day')).endOf('day');
                                            //今天
                                            const today = moment().startOf('day');
                                            //只能选今明两天
                                            return current < today || current > tomorrow;
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
                                                initialValue
                                            >
                                                <Radio value="TIME">时间</Radio>
                                                <Radio value="GS">地面停止</Radio>
                                                <Radio value="REQ">开车申请</Radio>
                                                <Radio value="ASSIGN">指定时隙</Radio>
                                            </RadioGroup>
                                        )
                                    }
                                </Col>
                                <Col {...Layout4}>
                                    { (type == 'TIME') ? "限制数值" : "" }
                                    { (type == 'ASSIGN') ? "指定分钟" : "" }
                                </Col>
                                <Col {...Layout6}>
                                    { (type == 'TIME') ?
                                        <FormItem>
                                            {
                                                rulesGenerate.limitValue(
                                                    <Input placeholder="限制数值" />
                                                )
                                            }
                                            <span className="unit">分钟</span>
                                        </FormItem>
                                        : "" }
                                    { (type == 'ASSIGN') ?
                                        <FormItem>
                                            {
                                                rulesGenerate.assignSlot(
                                                    <Input placeholder="指定分钟" />
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
                            限制原因
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    原因
                                </Col>
                                <Col {...Layout20}>
                                    {
                                        rulesGenerate.reason(
                                            <RadioGroup
                                                // value = {reason}
                                                // onChange={this.handleChangeReason}
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
                                    <Input placeholder="受控起飞机场" value={controlDepDirection} disabled ={true} />
                                </Col>
                                <Col {...Layout4}>
                                    受控降落机场
                                </Col>
                                <Col {...Layout8}>
                                    <Input placeholder="受控降落机场" />
                                </Col>
                            </Row>
                            <Row>
                                <Col {...Layout4}>
                                    豁免起飞机场
                                </Col>
                                <Col {...Layout8}>
                                    <Input placeholder="" disabled ={true} />
                                </Col>
                                <Col {...Layout4}>
                                    豁免降落机场
                                </Col>
                                <Col {...Layout8}>
                                    <Input placeholder="豁免降落机场" />
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
                                    <Select
                                        allowClear = {true}
                                        mode="multiple"
                                        placeholder="请选择限制高度"
                                        onChange={this.handleChangeLevel}
                                    >
                                        { levelOptions }
                                    </Select>
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
                                    <textarea placeholder="请输入备注" rows="4"  className="comments"></textarea>
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

export default Form.create()(APFlowcontrolDialog) ;