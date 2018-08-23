//机场流控页面
import React from 'react';
import { Row, Col, Icon, Button, Card, Form, Input, Checkbox, Select, Radio, DatePicker, TimePicker, Modal, Spin,    } from 'antd';
import Loader from 'components/Loader/Loader';
import { getPointByAirportUrl, getFlowcontrolTemplateUrl, publishFlowcontrolUrl } from 'utils/request-urls';
import {  request, requestGet } from 'utils/request-actions';
import moment from 'moment';
import './APContent.less';
import {isValidVariable} from "utils/basic-verify";

const FormItem = Form.Item;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const { Option } = Select;


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
        this.handleChangeTemplate = this.handleChangeTemplate.bind(this);

        this.getPointByAirport = this.getPointByAirport.bind(this);
        this.getFlowcontrolTemplate = this.getFlowcontrolTemplate.bind(this);
        this.updatePoints = this.updatePoints.bind(this);
        this.updateTemplate = this.updateTemplate.bind(this);
        this.resetALLFields = this.resetALLFields.bind(this);

        this.onChangeFlowcontrolPoint = this.onChangeFlowcontrolPoint.bind(this);

        this.onEndTimeChange = this.onEndTimeChange.bind(this);
        this.getDateTime = this.getDateTime.bind(this);
        //验证规则
        this.validateFlowcontrolName = this.validateFlowcontrolName.bind(this);
        this.validateFlowcontrolValue = this.validateFlowcontrolValue.bind(this);
        this.validateFlowcontrolAssignSlot = this.validateFlowcontrolAssignSlot.bind(this);
        this.validateFlowcontrolReserveSlots = this.validateFlowcontrolReserveSlots.bind(this);
        this.validateAirportFormat = this.validateAirportFormat.bind(this);
        this.validateStartDate = this.validateStartDate.bind(this);
        this.validateStartTime = this.validateStartTime.bind(this);
        this.validateEndDate = this.validateEndDate.bind(this);
        this.validateEndTime = this.validateEndTime.bind(this);
        this.ForceTriggerValidate = this.ForceTriggerValidate.bind(this);
        this.handleChangeReserveSlots = this.handleChangeReserveSlots.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitCallback = this.handleSubmitCallback.bind(this);

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

            template : {}, // 流控模板数据对象
            templateOptions: [], // 模板选项
            loading : false // 加载

        }
    }
    // 转换高度选项
    connectLevel(){
        let arr = this.state.levelValues;
        let result = [];
        arr.map((item)=>{
            result.push(<Option key={item.toString(10)}>{item.toString(10)}</Option>)
        });

        this.setState({
            levelOptions : result
        })
    }

    // 获取流控模板数据
    getFlowcontrolTemplate(){
        // 用户登录信息
        const { loginUserInfo } = this.props;
        // 用户名
        const { username } = loginUserInfo;
        // 类型
        const placetype = 'AP';
        // 参数
        const params = {
            username,
            placetype,
        };
        // 发送请求
        requestGet(getFlowcontrolTemplateUrl, params, this.updateTemplate);
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
    // 重置所有表单组件
    resetALLFields() {
        // 重置所有Form托管的组件值（为 initialValue）与状态
        this.props.form.resetFields();
        // 清空所有组件值
        this.props.form.setFieldsValue({
            name: '',
            type: '',
            flowcontrolType: false,
            originalPublishUnit: '',
            startDate: undefined,
            startTime: undefined,
            endDate: undefined,
            endTime: undefined,
            value: undefined,
            assignSlot: [],
            controlDepDirection: '',
            exemptDepDirection: '',
            controlDirection: [],
            exemptDirection: [],
            controlLevel: [],
            reason:'',
            reserveSlots:[],
            comments: '',
        });


        // 清空勾选的航路点
        this.setState({
            checkedControlPoints : [],
            controlPoints : [],
        })
    }

    // 更新流控模板
    updateTemplate(res) {
        let result = [];
        let data = {};
        // 取流控模板集合
        let  { flowcontrolTemplateList = [] } = res;
        flowcontrolTemplateList.map((item)=>{
            result.push(<Option key={item.id}>{item.name}</Option>);
            data[item.id] = item;
        });
        // 更新流控模板Select选项
        this.setState({
            templateOptions : result
        });

        // 更新流控数据对象
        this.setState({
            template : data
        });
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
        // 更新controlPoints
        this.setState({
            controlPoints: points
        })
    }
    // 变更模板
    handleChangeTemplate(value) {
        console.log(arguments);
        const { template } =this.state;
        // 重置所有表单组件
        this.resetALLFields();
        let templateData = template[value];
        const { generateTime} = this.props;
        // 数据生成时间
        const {time} = generateTime;
        // 数据日期
        const standardDate = time ? time.substring(0,8):'';
        // 数据时间
        const standardTime = time ? time.substring(8,12):'';

        const dateFormat = 'YYYYMMDD';
        const timeFormat = 'HHmm';

        if(value && templateData){

            // 设置模板对应字段数值
            this.props.form.setFieldsValue({
                name : templateData.name || '',
                type : templateData.type || '',
                originalPublishUnit: templateData.publishUnit || '',
                controlDepDirection: templateData.controlDepDirection || '',
                controlDirection : templateData.controlDirection ?  templateData.controlDirection.split(',') : [],
                exemptDirection : templateData.exemptDirection ?  templateData.exemptDirection.split(',') : [],
                startDate : moment( standardDate, dateFormat ),
                startTime:moment(standardTime, timeFormat),
            });
            // 勾选流控点
            if(templateData.pointsType &&templateData.controlPoints ){
                // 将模板数据中的流控点转为数组
                let points = templateData.controlPoints.split(',');
                // 用于存储对应流控点+所属组
                let checkedValue = [];
                points = points.map((item) =>{
                    item = item.trim();
                    const p = item+'_'+ templateData.pointsType;
                    checkedValue.push(p);
                    return item;
                });

                // 更新controlPoints
                this.setState({
                    controlPoints: points
                });
                // 更新checkedControlPoints
                this.setState({
                    checkedControlPoints : checkedValue
                });
            }
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
    // 指定分钟--校验规则
    validateFlowcontrolAssignSlot = (rule, value, callback) => {
        const type = this.props.form.getFieldValue("type");
        // 若限制类型不是ASSIGN，则始终设置此校验为通过
        if(type != 'ASSIGN'){
            callback();
            return;
        }
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

            }
        }
    };
    // 预留时隙--校验规则
    validateFlowcontrolReserveSlots = (rule, value, callback) => {
        const type = this.props.form.getFieldValue("type");
        // 若限制类型不是TIME，则始终设置此校验为通过
        if(type != 'TIME'){
            callback();
            return;
        }

        // 数据无效则通过校验 (因为不是必填项)
        if(!value){
            callback();
            return
        }
        let len = value.length;
        // 未通过的数值集合
        let invalid = [];
        // 年月日校验规则 8位
        const  regexp = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)/;
        // 时分校验规则 4位 0000~2359
        const reg =  /(^[0-1][0-9]|^2[0-3])[0-5]{1}[0-9]{1}$/;
        for (let i=0; i<len; i++){
            var item = value[i];
            // 长度等于12
            if(item.length == 12){
                // 日期
                let date = item.substring(0,8);
                // 时间
                let time = item.substring(8,12);
                // 日期校验
                let dateValid = regexp.test(date);
                // 时间校验
                let timeValid = reg.test(time);
                // 日期未通过校验或时间未通过校验
                if(!dateValid || !timeValid){
                    // 添加到未通过校验数值集合中
                    invalid.push(item)
                }
            }else {
                // 长度不等于12添加到未通过校验数值集合中
                invalid.push(item);
            }
        }
        // 若未通过的数值集合为空
        if(invalid.length < 1){
            // 通过校验
            callback();
        }else {
            // 若未通过的数值集合不空，校验不通过并提示未通过校验的数值
            callback(invalid.join(',')+'无效')
        }

    };
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
    // 变更预留时隙
    handleChangeReserveSlots(value,option){
        const { startDate, startTime,} = this.getDateTime();
        // 0000~2359规则
        const regexp = /(^[0-1][0-9]|^2[0-3])[0-5]{1}[0-9]{1}$/;
        // 数值集合
        let len = value.length;
        // 取最后一个值
        let lastVal = value[len-1];

        // 最后一个值是否满足0000~2359规则
        const valid = regexp.test(lastVal);
        let newDate = '';
        const dateFormat = 'YYYYMMDD';
        // 开始日期和开始时间不为空且最后一个值满足规则,进行自动填充为
        if(startDate !='' && startTime !='' && valid ){
            // 录入值小于或等于开始时间，则自动填充日期为开始日期后1天
            if(lastVal*1 <= startTime*1){
                newDate = moment(moment(startDate).add(1, 'day')).endOf('day');
            }else {
                // 截止时间大于开始时间，则截止日期与开始日期相同
                newDate =  moment(startDate,dateFormat);
            }
            // 最后计算得12位日期时间字符串
            const res = newDate.format(dateFormat) + lastVal;
            // 是否有重复
            let repeat = false;
            // 遍历
            for(var i=0; i<len; i++){
                // 若与结果数值相同
                if(res == value[i]){
                    // 删除最后这个值
                    value.splice(len-1,1);
                    repeat = true;
                    break;
                }
            }
            // 若没有有重复,则更新最后一个值
            if(!repeat){
                // 更新最后一个值
                value[len-1] = res;
            }
        }
    }

    // 开始日期--校验规则
    validateStartDate = (rule, value, callback) => {
        const { startDate, startTime, endDate, endTime,startDateTime, endDateTime } = this.getDateTime();
        // 结束日期和结束时间都为空时，校验通过
        if(endDate == "" && endTime == ""){
            callback();
        }else if (startDate != "" && startTime != ""
            && endDate != "" && endTime != "") {
            if(startDateTime *1 >= endDateTime *1){
                callback("开始时间不能晚于截止时间");
            }else {
                callback();
                this.ForceTriggerValidate(['startTime','endDate', 'endTime'],false);
            }
        }
    };
    // 开始时间--校验规则
    validateStartTime = (rule, value, callback) => {
        const { startDate, startTime, endDate, endTime,startDateTime, endDateTime } = this.getDateTime();
        // 结束日期和结束时间都为空时，校验通过
        if(endDate == "" && endTime == ""){
            callback();
        }else if (startDate != "" && startTime != ""
            && endDate != "" && endTime != "") {
            if(startDateTime *1 >= endDateTime *1){
                callback("开始时间不能晚于截止时间");
            }else {
                callback();
                this.ForceTriggerValidate(['startDate','endDate', 'endTime'],false);
            }
        }


    };
    // 截止日期--校验规则
    validateEndDate = (rule, value, callback) => {
        const { startDate, startTime, endDate, endTime,startDateTime, endDateTime } = this.getDateTime();
        // 结束日期和结束时间都为空时，校验通过
        if(endDate == "" && endTime == ""){
            callback();
            this.ForceTriggerValidate(['endTime'],false);
        }else if (startDate != "" && startTime != ""
            && endDate != "" && endTime != "") {
            if(startDateTime *1 >= endDateTime *1){
                callback("截止时间不能早于开始时间");
            }else {
                callback();
                this.ForceTriggerValidate(['startDate', 'startTime', 'endTime'],false);
            }
        }else if(endDate == "" && endTime != "" ){
            callback("截止时间无效");
        }else if(endDate != "" && endTime == "" ){
            this.ForceTriggerValidate(['endTime'],true);
        }


    };
    // 截止时间--校验规则
    validateEndTime = (rule, value, callback) => {
        const { startDate, startTime, endDate, endTime,startDateTime, endDateTime } = this.getDateTime();
        // 结束日期和结束时间都为空时，校验通过
        if(endDate == "" && endTime == ""){
            callback();
            this.ForceTriggerValidate(['endDate'],false);
        }else if (startDate != "" && startTime != ""
            && endDate != "" && endTime != "") {
            if(startDateTime *1 >= endDateTime *1){
                callback("截止时间不能早于开始时间");
            }else {
                callback();
                this.ForceTriggerValidate(['startDate', 'startTime', 'endDate'],false);
            }
        }else if(endDate != "" && endTime == "" ){
            callback("截止时间无效");
        }else if(endDate == "" && endTime != "" ){
            this.ForceTriggerValidate(['endDate'],true);
        }

    };

    //流控名称--校验规则
    validateFlowcontrolName = (rule, value, callback) => {
        //若value值为空
        if( !isValidVariable(value) ){
            callback('请输入或自动命名流控名称');
        }else{
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
        const _form = this.props.form;
        _form.validateFieldsAndScroll({
            force:true,
        },(err, values) => {
            //校验通过
            if (!err) {
                // 转换表单字段数据
                this.handleConvertFormData(values);
            }
        });
    }
    // 转换表单字段数据
    handleConvertFormData(data){
        const { loginUserInfo, systemConfig } = this.props;
        const { controlPoints, } = this.state;
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
            flow.assignSlot = flow.assignSlot ? flow.assignSlot.join(',') : '';
        }else if(flow.type =='TIME') {
            flow.valueStr = flow.value;
        }

        if(flow.type !=='TIME' && flow.type !=='ASSIGN'){
            delete flow.value;
        }

        // 限制时间
        const { startDateTime, endDateTime } = this.getDateTime(); // 获取开始和截止日期时间
        flow.startTime = startDateTime;
        flow.endTime = endDateTime;
        // 删除无用字段
        delete flow.startDate;
        delete flow.endDate;

        // 限制高度
        flow.controlLevel = flow.controlLevel.join(',');

        // 限制流控点
        flow.controlPoints = controlPoints.join(',');

        // 受控降落机场
        flow.controlDirection = flow.controlDirection.join(',').toUpperCase();
        // 豁免降落机场
        flow.exemptDirection = flow.exemptDirection.join(',').toUpperCase();

        if(flow.reserveSlots){
            flow.reserveSlots = flow.reserveSlots.join(',');
        }
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
        // 开启加载
        this.setState({
            loading : true
        });
        request(publishFlowcontrolUrl,'POST',JSON.stringify(params),this.handleSubmitCallback);
    }
    // 表单提交回调函数
    handleSubmitCallback(res){
        const { status, flowcontrol} = res;
        //
        const { clickCloseBtn, dialogName } = this.props;
        // 关闭加载
        this.setState({
            loading : false
        });
        if(status == 200){
            Modal.success({
                title: '流控发布成功',
                content: '流控发布成功',
                okText: '确认',
                onOk(){
                    clickCloseBtn(dialogName);
                },
            });
        }else if(status != 200 && res.error){
            Modal.error({
                title: '流控发布失败',
                content: res.error.message,
                okText: '确认',
                onOk(){ },
            });
        }
    }

    //
    componentDidMount(){
        //获取受控点
        this.getPointByAirport();
        // 获取流控模板
        this.getFlowcontrolTemplate();
        // 转换高度选项
        this.connectLevel();
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
        const { flowcontrolPointsList,  checkedControlPoints, levelOptions, templateOptions} = this.state;

        const { clickCloseBtn, dialogName, generateTime} = this.props;
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
            // 开始日期
            startDate: getFieldDecorator("startDate",{
                initialValue: moment( standardDate, dateFormat ),
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
                initialValue: moment(standardTime, 'HHmm'),
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
                // initialValue: moment( endDate, dateFormat ),
                rules: [
                    {
                        validator :  this.validateEndDate
                    }, // 日期时间比较
                ]
            }),
            // 截止时间
            endTime: getFieldDecorator("endTime",{
                // initialValue: moment( endTime, 'HHmm'),
                rules: [
                    {
                        validator :  this.validateEndTime
                    }, // 日期时间比较
                ]
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
            // 预留时隙
            reserveSlots: getFieldDecorator("reserveSlots", {
                rules: [
                    {
                        validator : this.validateFlowcontrolReserveSlots
                    }
                ]
            }),
            // 备注
            comments: getFieldDecorator("comments",{
                rules: []
            })
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
                                <Col {...Layout4}>
                                    <div className="label">流控名称</div>
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
                                    <div className="label">发布用户</div>

                                </Col>
                                <Col {...Layout8}>
                                    {
                                        rulesGenerate.publishUserZh(
                                            <Input placeholder="请输入发布者"  disabled ={true} />
                                        )
                                    }

                                </Col>
                                <Col {...Layout4} className="text-center">
                                    <div className="label">原发布者</div>

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
                            <div className="row-title">
                                限制时间
                            </div>

                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    <div className="label">起始时间</div>

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
                                <Col {...Layout4} className="text-center">
                                    <div className="label">截止时间</div>

                                </Col>
                                <Col {...Layout4}>
                                    <FormItem>
                                        {
                                            rulesGenerate.endDate(
                                                <DatePicker
                                                    allowClear={true} // 显示清除按钮
                                                    placeholder="截止日期,可选项"
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
                                                    placeholder="截止时间,可选项"

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
                                <Col {...Layout4}>
                                    <div className="label">类型</div>

                                </Col>
                                <Col {...Layout8}>
                                    {
                                        rulesGenerate.type(
                                            <RadioGroup
                                                // onChange={this.handleChangeType}
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
                                    <div className="label">
                                        { (type == 'TIME') ? "限制数值" : "" }
                                        { (type == 'ASSIGN') ? "指定分钟" : "" }
                                    </div>

                                </Col>
                                <Col {...Layout6}>
                                    { (type == 'TIME') ?
                                        <FormItem>
                                            {
                                                rulesGenerate.value(
                                                    <Input placeholder="限制数值" className="limit-value" />
                                                )
                                            }
                                            <span className="unit label">分钟</span>
                                        </FormItem>
                                        : "" }
                                    { (type == 'ASSIGN') ?
                                        <FormItem>

                                            {
                                                rulesGenerate.assignSlot(
                                                    <Select
                                                        mode="tags"
                                                        placeholder="请输入00-59正整数,多个值以逗号分隔,以升序排序且间隔不小于5;"
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

                            <div className="row-title">
                                限制原因
                            </div>
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    <div className="label">原因</div>

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

                            <div className="row-title">
                                限制方向
                            </div>
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    <div className="label">模板</div>

                                </Col>
                                <Col {...Layout20}>
                                    <Select
                                        allowClear = {true}
                                        placeholder="请选择模板"
                                        onChange={ this.handleChangeTemplate}
                                    >
                                        { templateOptions }
                                    </Select>
                                </Col>
                            </Row>
                            {
                                flowcontrolPointsList.map((item) =>{
                                    return (
                                        <Row key= {item.id}>
                                            <Col {...Layout4}>
                                                <div className="label">
                                                { item.description }
                                                </div>
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
                                    <div className="label">受控起飞机场</div>

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
                                    <div className="label">受控降落机场</div>

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
                                    <div className="label">豁免起飞机场</div>

                                </Col>
                                <Col {...Layout8}>
                                    {
                                        rulesGenerate.exemptDepDirection(
                                            <Input placeholder="" disabled ={true} />
                                        )
                                    }

                                </Col>
                                <Col {...Layout4} className="text-center">
                                    <div className="label">豁免降落机场</div>

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

                            <div className="row-title">
                                限制高度
                            </div>
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    <div className="label">
                                        高度
                                    </div>

                                </Col>
                                <Col {...Layout20}>
                                    {
                                        rulesGenerate.controlLevel(
                                            <Select
                                                allowClear = {true}
                                                mode="multiple"
                                                placeholder="请选择限制高度"
                                            >
                                                { levelOptions }
                                            </Select>
                                        )
                                    }

                                </Col>
                            </Row>
                        </Col>
                    </Col>
                    { (type == 'TIME') ?
                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >

                            <div className="row-title">
                                预留时隙
                            </div>
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    <div className="label">
                                        时隙
                                    </div>

                                </Col>
                                <Col {...Layout20}>
                                    <FormItem>
                                    {
                                        rulesGenerate.reserveSlots(
                                            <Select
                                                mode="tags"
                                                placeholder="请输入时隙"
                                                onChange={this.handleChangeReserveSlots}
                                            >

                                            </Select>
                                        )
                                    }
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Col> : ''
                    }
                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >

                            <div className="row-title">
                                备注
                            </div>
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout4}>
                                    <div className="label">
                                        备注
                                    </div>

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
                {
                    this.state.loading ? <Loader/> : ''
                }
            </Form>
        )
    }
};

export default Form.create()(APContent) ;