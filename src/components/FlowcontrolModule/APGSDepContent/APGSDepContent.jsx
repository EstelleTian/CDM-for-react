//低能见度受限页面(属于机场流控)
//低能见度受限是限制类型为GS地面停止流控
import React from 'react';
import { Row, Col,  Button, Form, Input, Checkbox, Select, Radio, DatePicker, TimePicker, Modal, Spin,    } from 'antd';
import Loader from 'components/Loader/Loader';
import { getPointByAirportUrl, getFlowcontrolTemplateUrl, publishFlowcontrolUrl, updateFlowcontrolUrl,getFlowcontrolByIdUrl } from 'utils/request-urls';
import {  request, requestGet } from 'utils/request-actions';
import moment from 'moment';
import './APGSDepContent.less';
import {isValidVariable, isValidObject} from "utils/basic-verify";
import {AuthorizationUtil} from "utils/authorization-util";

const FormItem = Form.Item;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const { Option } = Select;


class APGSDepContent extends React.Component{
    constructor( props ){
        super(props);

        this.computeFlowcontrolName = this.computeFlowcontrolName.bind(this);
        this.splicingName = this.splicingName.bind(this);
        this.splicingGSDepTypeName = this.splicingGSDepTypeName.bind(this);

        this.handleValidateFlowcontrolType = this.handleValidateFlowcontrolType.bind(this);
        this.handleChangeTemplate = this.handleChangeTemplate.bind(this);

        this.getPointByAirport = this.getPointByAirport.bind(this);
        this.getFlowcontrolTemplate = this.getFlowcontrolTemplate.bind(this);
        this.getFlowcontrolData = this.getFlowcontrolData.bind(this);
        this.updatePoints = this.updatePoints.bind(this);
        this.updateTemplate = this.updateTemplate.bind(this);
        this.updateOriginalData = this.updateOriginalData.bind(this);
        this.resetALLFields = this.resetALLFields.bind(this);

        this.onChangeFlowcontrolPoint = this.onChangeFlowcontrolPoint.bind(this);

        this.onEndTimeChange = this.onEndTimeChange.bind(this);
        this.getDateTime = this.getDateTime.bind(this);
        //验证规则
        this.validateFlowcontrolName = this.validateFlowcontrolName.bind(this);
        this.validateFlowcontrolValue = this.validateFlowcontrolValue.bind(this);
        this.validateAirportFormat = this.validateAirportFormat.bind(this);
        this.validateStartDate = this.validateStartDate.bind(this);
        this.validateStartTime = this.validateStartTime.bind(this);
        this.validateEndDate = this.validateEndDate.bind(this);
        this.validateEndTime = this.validateEndTime.bind(this);
        this.ForceTriggerValidate = this.ForceTriggerValidate.bind(this);
        this.checkFlowcontrolPoints = this.checkFlowcontrolPoints.bind(this);
        this.checkFlowcontrolName = this.checkFlowcontrolName.bind(this);
        this.confirmSubmit = this.confirmSubmit.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleConvertFormData = this.handleConvertFormData.bind(this);
        this.handleSubmitCallback = this.handleSubmitCallback.bind(this);
        this.state = {
            // 高度选项
            levelValues: [600,900,1200,1500,1800,2100,2400,2700,3000,3300,3600,3900,4200,4500,4800,5100,5400,5700,6000,
                6300,6600,6900,7200,7500,7800,8100,8400,8900,9200,9500,9800,10100,10400,10700,11000,11300,11600,11900,12200,12500,13100,13700,14300,14900],
            // 高度选项
            levelOptions: [],

            flowcontrolPointsList : [], // 流控点对象集合
            allFlowcontrolPoints : [], // 全部流控点
            checkedControlPoints : [], // 勾选的限制流控点(含所属组,不用作最终表单提交)
            controlPoints : [], // 勾选的限制流控点(不含所属组,用于最终表单提交)

            template : {}, // 流控模板数据对象
            templateOptions: [], // 模板选项
            loading : false, // 加载
            originalData: {}, // 流控原数据(修改页面用)
            pageType : '发布' // 发布或修改 默认是发布
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
        const placetype = 'GS_DEP';
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
        let allFlowcontrolPoints = [];
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
                allFlowcontrolPoints.push(i);
            })
        });
        this.setState({
            flowcontrolPointsList,
            allFlowcontrolPoints
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

                // 流控类型 (1:非长期  0:长期)
                if(flowcontrol.flowcontrolType == 0 ){
                    flowcontrol.flowcontrolType = true;
                }else if(flowcontrol.flowcontrolType == 1) {
                    flowcontrol.flowcontrolType = false;
                }

                // 指定时隙
                if(flowcontrol.assignSlot){
                    flowcontrol.assignSlot = flowcontrol.assignSlot.split(',');
                }

                // 勾选流控点
                if(flowcontrol.controlPoints ){
                    // 将流控数据中的流控点转为数组
                    let points = flowcontrol.controlPoints.split(',');
                    // 所有流控点集合
                    const {flowcontrolPointsList = [], allFlowcontrolPoints = []} = this.state;

                    // 用于存储对应流控点+所属组
                    let checkedValue = [];
                    // 用于存储对应流控点
                    let val = [];
                    // 对比流控数据中的流控点与本机场的所有流控点，找出交集数据
                    points.map((item) =>{
                        item = item.trim();
                        // 遍历所有流控点集合
                        for(let i=0; i<allFlowcontrolPoints.length; i++ ){
                            let point = allFlowcontrolPoints[i];
                            if(item == point.name){
                                checkedValue.push(point.value);
                                val.push(item);
                            }
                        }
                    });
                    // 更新controlPoints
                    this.setState({
                        controlPoints: val
                    });
                    // 更新checkedControlPoints
                    this.setState({
                        checkedControlPoints : checkedValue
                    });
                }

                // 高度
                if(isValidVariable(flowcontrol.controlLevel)){
                    let { controlLevel } = flowcontrol;
                    controlLevel = controlLevel.split(',');
                    flowcontrol.controlLevel = controlLevel;
                }

                // 预留时隙
                if(isValidVariable(flowcontrol.reserveSlots)){
                    flowcontrol.reserveSlots = flowcontrol.reserveSlots.split(',');
                }

                // 受控降落机场
                if(isValidVariable(flowcontrol.controlDirection)){
                    flowcontrol.controlDirection = flowcontrol.controlDirection.split(',');
                }
                // 豁免降落机场
                if(isValidVariable(flowcontrol.exemptDirection)){
                    flowcontrol.exemptDirection = flowcontrol.exemptDirection.split(',');
                }

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


    // 拼接流控名称
    computeFlowcontrolName() {
        let res = '';
        const { type,controlDepDirection,value, assignSlot  } = this.props.form.getFieldsValue(['type', 'controlDepDirection', 'value', 'assignSlot']);
        const { controlPoints } = this.state;
        if(type == 'GS_DEP'){ // 限制类型为地面停止
            // 若未勾选限制流控点,则以受控起飞机场命名
            if(controlPoints.length < 1) {
                res = controlDepDirection + '放行 低能见度'
            }else {
                // 若勾选限制流控点,则以勾选的限制流控点命名
                res = controlPoints.join(',') + ' 低能见度'
            }
        }
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
            if(type == 'GS_DEP'){ // 限制类型为地面停止
               let name =  this.splicingGSDepTypeName();
                // 设置流控名称
                _form.setFieldsValue({
                    name : name,
                })
            }
        }

    }

    // 拼接低能见度限制类型流控名称
    splicingGSDepTypeName () {
        // 结果
        let res = '';
        let _form = this.props.form;
        let controlDepDirection = _form.getFieldValue('controlDepDirection');
        const { controlPoints } = this.state;

        // 若未勾选限制流控点,则以受控起飞机场命名
        if(controlPoints.length < 1) {
            res = controlDepDirection + '放行 低能见度'
        }else {
            // 若勾选限制流控点,则以勾选的限制流控点命名
            res = controlPoints.join(',') + ' 低能见度'
        }
        return res;
    };

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
    //检验流控点是否选择并提示
    checkFlowcontrolPoints(){
        const { controlPoints, pageType } = this.state;
        const checkFlowcontrolName = this.checkFlowcontrolName;
        if(!controlPoints || controlPoints.length == 0){
            Modal.confirm({
                iconType : 'exclamation-circle',
                title: '提示',
                content: '尚未选择限制方向，则影响的航班将不再考虑受控点因素，建议返回添加受控点。',
                cancelText: '修改方向',
                okText: `确认${pageType}`,
                onOk(){ checkFlowcontrolName() },
            });
        }else {
            //检验流控名称与流控限制条件是否一致，不一致提示
            this.checkFlowcontrolName();
        }
    }
    //检验流控名称与流控限制条件是否一致，不一致提示
    checkFlowcontrolName(){
        const {  pageType } = this.state;
        const name = this.props.form.getFieldValue('name');
        const calculationName = this.splicingGSDepTypeName();
        const confirmSubmit = this.confirmSubmit;
        if(name == calculationName){
            // 确认提交
            this.confirmSubmit();
        }else {

            Modal.confirm({
                iconType : 'exclamation-circle',
                title: '提示',
                content: '流控限制条件与流控名称暂不相符，建议返回修改流控名称。',
                cancelText: '修改名称',
                okText: `确认${pageType}`,
                onOk(){ confirmSubmit() },
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
                // 检验流控点是否选择并提示
                this.checkFlowcontrolPoints()

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
        const {id} = this.state.originalData;
        // 获取全部组件的值
        const data = this.props.form.getFieldsValue();
        const { loginUserInfo, systemConfig } = this.props;
        const { controlPoints, } = this.state;
        // 拷贝组件数据
        let flow = JSON.parse(JSON.stringify(data));
        // 设置id
        if(id){
            flow.id = id;
        }
        // 处理数据
        // 流控类型 (1:非长期  0:长期)
        if(flow.flowcontrolType){
            flow.flowcontrolType = 0;
        }else {
            flow.flowcontrolType = 1;
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
        flow.placeType = 'AP';// 固定值
        // 开始前压缩策略,必传
        flow.compressAtStartStrategy = 'ALL'; // 固定值
        // 流控起降类型,必传
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
        }else if(status != 200 && res.error){
            Modal.error({
                title: `流控${pageType}失败`,
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
        const { flowcontrolPointsList,  checkedControlPoints, levelOptions, templateOptions, originalData} = this.state;

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
        const flowcontrolTypeFlag = this.props.form.getFieldValue("flowcontrolType");

        // 校验规则
        const rulesGenerate = {
            // 流控名称
            name: getFieldDecorator("name", {
                initialValue: originalData.name || '',
                rules: [
                    {
                        required: true,
                        message: "请输入或自动命名流控名称"
                    } 
                ]
            }),
            // 长期流控
            flowcontrolType: getFieldDecorator("flowcontrolType", {
                initialValue: originalData.flowcontrolType || false,
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
                        validator :  this.validateEndDate
                    }, // 日期时间比较
                ]
            }),
            // 截止时间
            endTime: getFieldDecorator("endTime",{
                initialValue: originalData.endTime ? moment(originalData.endTime.substring(8,12), 'HHmm' ) : null,
                rules: [
                    {
                        validator :  this.validateEndTime
                    }, // 日期时间比较
                ]
            }),

            // 限制类型
            type: getFieldDecorator("type", {
                initialValue: "GS_DEP",
                rules: [
                    {
                        required: true,
                        message: "请选择限制类型"
                    },
                ]
            }),


            // 预锁航班时隙变更策略
             strategy: getFieldDecorator("strategy", {
                initialValue: "ALL",
                rules: [
                    // {
                    //     validator : this.validateFlowcontrolAssignSlot
                    // }
                ]
            }),
            // 时间窗
            winTime: getFieldDecorator("winTime", (isValidVariable(id) && strategy =='PART')  ? {
                rules: [
                    {
                        validator :  this.validateFlowcontrolValue
                    } // 正整数
                ]
            }:{}),
            // 受控起飞机场
            controlDepDirection : getFieldDecorator("controlDepDirection", {
                initialValue: originalData.controlDepDirection || this.props.loginUserInfo.airports,
                rules: []
            }),
            // 豁免起飞机场
            exemptDepDirection: getFieldDecorator("exemptDepDirection", {
                initialValue: "",
                rules: []
            }),
            // 受控降落机场
            controlDirection: getFieldDecorator("controlDirection", {
                initialValue: originalData.controlDirection || [],
                rules: [{
                    validator : this.validateAirportFormat
                }]
            }),
            // 豁免降落机场
            exemptDirection: getFieldDecorator("exemptDirection", {
                initialValue: originalData.exemptDirection || [],
                rules: [{
                    validator : this.validateAirportFormat
                }]
            }),
            // 限制高度
            controlLevel : getFieldDecorator("controlLevel", {
                initialValue:originalData.controlLevel || [],
                rules: []
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
            // 备注
            comments: getFieldDecorator("comments",{
                initialValue: originalData.comments || '',
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
                                <Col {...Layout3}>
                                    <div className="label"><i className="iconfont icon-star-sm"></i>流控名称</div>
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
                                <Col {...Layout4} offset={2}>
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
                                限制时间
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
                                                    AuthorizationUtil.hasAuthorized(allAuthority,441) ?
                                                        <Radio value="GS_DEP">低能见度</Radio>
                                                        : ''
                                                }

                                            </RadioGroup>
                                        )
                                    }
                                </Col>

                            </Row>
                        </Col>
                    </Col>
                    {
                        ( isValidVariable(id) && AuthorizationUtil.hasAuthorized(allAuthority,436)) ?
                            <Col {...Layout24}>
                                <Col {...BasicTitleLayout} >
                                    <div className="row-title">
                                        预锁航班时隙变更策略
                                    </div>
                                </Col>
                                <Col {...ContentLayout} >
                                    <Row>
                                        <Col {...Layout3}>
                                            <div className="label">变更策略</div>
                                        </Col>
                                        <Col {...Layout9}>
                                            <FormItem>
                                                {
                                                    rulesGenerate.strategy(
                                                        <RadioGroup
                                                        >
                                                            <Radio value='ALL'>自动压缩</Radio>
                                                            <Radio value='PART'>公司申请变更</Radio>
                                                            <Radio value='NONE'>不自动压缩</Radio>
                                                        </RadioGroup>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col {...Layout4} className="text-center">
                                            <div className="label">
                                                {strategy == 'PART' ? '时间窗' :''}
                                            </div>
                                        </Col>
                                        <Col {...Layout6}>
                                            {strategy == 'PART' ?
                                                <FormItem>
                                                    {
                                                        rulesGenerate.winTime(
                                                            <Input placeholder="时间窗" className="limit-value" />
                                                        )
                                                    }
                                                    <span className="unit label">分钟</span>
                                                </FormItem>
                                                :''}

                                        </Col>
                                    </Row>
                                </Col>
                            </Col>
                            : ''
                    }

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
                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >

                            <div className="row-title">
                                限制方向
                            </div>
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout3}>
                                    <div className="label">模板</div>

                                </Col>
                                <Col {...Layout10}>
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
                                            <Col {...Layout3}>
                                                <div className="label">
                                                { item.description }
                                                </div>
                                            </Col>
                                            <Col {...Layout21}>
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
                                <Col {...Layout3}>
                                    <div className="label">受控起飞机场</div>

                                </Col>
                                <Col {...Layout9}>
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
                                <Col {...Layout3} >
                                    <div className="label">豁免起飞机场</div>

                                </Col>
                                <Col {...Layout9}>
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
                                <Col {...Layout3}>
                                    <div className="label">
                                        高度
                                    </div>

                                </Col>
                                <Col {...Layout21}>
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

                    <Col {...Layout24}>
                        <Col {...BasicTitleLayout} >

                            <div className="row-title">
                                备注
                            </div>
                        </Col>
                        <Col {...ContentLayout} >
                            <Row>
                                <Col {...Layout3}>
                                    <div className="label">
                                        备注
                                    </div>

                                </Col>
                                <Col {...Layout21}>
                                    {
                                        rulesGenerate.comments(
                                            <textarea rows="4"  className="comments"></textarea>
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

export default Form.create()(APGSDepContent) ;