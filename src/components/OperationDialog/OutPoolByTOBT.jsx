//申请移出等待池---TOBT<generateTime时候，弹框提示输入TOBT
import React from 'react';
import { Row, Icon, Form, DatePicker, TimePicker, Button, message, Col } from 'antd';
import moment from 'moment';
import { isValidVariable } from "utils/basic-verify";
import { request } from "utils/request-actions";
import { host } from "utils/request-urls";
import DraggableModule from "components/DraggableModule/DraggableModule";
import "./OutPoolByTOBT.less";

const FormItem = Form.Item;

class OutPoolByTOBTForm extends React.Component{
    constructor( props ){
        super( props );
        this.submitForm = this.submitForm.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
        this.showLoading = this.showLoading.bind(this);
        this.hideLoading = this.hideLoading.bind(this);

        const { generateTime, tobt } = props;
        let timeStr = tobt;
        if( tobt*1 < generateTime*1 ){
            timeStr = generateTime;
        }
        this.state = {
            date: {
                value: timeStr.substring(0, 8) || moment().format('YYYYMMDD')
            },
            time: {
                value: timeStr.substring(8, 12) || moment().format('HHmm')
            },
            submitLoading: false,
            cancleLoading: false,
            validateStatus: "",
            help: ""
        }
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
        const { date, time,validateStatus } = this.state;
        const { id, flightid, userId, name } = this.props;
        if( validateStatus != "error" ) {
            let url = "applyFlightOutpool.bo"; //默认申请移出
            if(name == "OUTPOOL_APPROVE"){
                //批复移出
                url = "approveFlightOutpool.bo";
            }
            const str = date.value + time.value; //拼接时间

            let params = { userId, id: id*1 };
            params["tobt"] = str;
            params["type"] = "TOBT";

            //发送请求
            request( `${host}/${url}`, "post", params, (res) => {
                this.hideLoading('submit');
                this.props.requestCallback( res, flightid + "申请移出等待池" );
                this.props.clickCloseBtn();
            }, ( err ) => {
                message.error( flightid + "申请移出等待池" );
                this.hideLoading('submit');
            });

        }else{
            this.hideLoading('submit');
        }
    };
    //日期改变
    onDateChange( datemoment, dateString ){
        const { date, time } = this.state;
        if( dateString == "" ){
            //更新选中的日期
            this.setState({
                date: {
                    value: moment().format('YYYYMMDD')
                },
                validateStatus: "",
                help: ""
            });
        }else{
            //更新选中的日期
            this.setState({
                date: {
                    value: dateString
                },
                validateStatus: "",
                help: ""
            });
            //日期值去掉-
            dateString = dateString.replace(/\-/g, "");;
            //拼接为12位值
            const val = dateString + time.value;
            //做校验
            this.compareWithTOBT("date", val);
        }
    };
    //时间改变
    onTimeChange( timemoment, timeString ){
        const { date, time } = this.state;
        if( timeString == "" ){
            //更新选中的日期
            this.setState({
                time: {
                    value: moment().format('HHmm')
                },
                validateStatus: "",
                help: ""
            });
        }else{
            //更新选中的时间
            this.setState({
                time: {
                    value: timeString
                },
                validateStatus: "",
                help: ""
            });
            //拼接为12位值
            const val = date.value + timeString;
            //做校验
            this.compareWithTOBT("time", val);
        }

    };

    //和TOBT比较
    compareWithTOBT( field, value ){
        const { generateTime } = this.props;
        if( generateTime.length == 12 && value.length == 12){
            //如果当前时间小于generateTime时间，进行提示 输入时间不能早于当前时间
            if( value*1 < generateTime*1) {
                const newVal = field == 'date' ? value.substring( 0, 8 ) : value.substring( 8, 12 )
                this.setState({
                    [field]:{
                        value: newVal
                    },
                    validateStatus: "error",
                    help: "输入时间不能早于当前时间"
                })
            }else{
                //清空提示数据
                this.setState({
                    date:{
                        value: value.substring( 0, 8 )
                    },
                    time:{
                        value: value.substring( 8, 12 )
                    },
                    validateStatus: "",
                    help: ""
                })
            }
        }
    }


    render(){
        const { width = 550, flightid, clickCloseBtn, name } = this.props;
        const { date, time, validateStatus, help } = this.state;
        const formItemLayout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 18,
            }
        };
        return (
            <DraggableModule
                bounds = ".root"
            >
                <div className="box center no-cursor" style={{ width: width }}>
                    <div className="dialog">
                        {/* 头部*/}
                        <Row className="title drag-target cursor">
                            <span>{ flightid }{ name == "OUTPOOL_APPROVE" ? "批复移出等待池" : "申请移出等待池"}</span>
                            <div
                                className="close-target"
                                onClick={ clickCloseBtn }
                            >
                                <Icon type="close" title="关闭"/>
                            </div>
                        </Row>
                        {/* 表单内容*/}
                        <Form>
                            <FormItem
                                label="预关时间(TOBT)"
                                {...formItemLayout}
                                validateStatus={ validateStatus }
                                help={ help }
                            >
                                <Row>
                                    <Col span={ 12 }>
                                        <DatePicker
                                            disabledDate={ (current) => {
                                                //今天
                                                const today = moment().startOf('day');
                                                //只能选今天以后的
                                                return current < today ;
                                            } }
                                            value = { date.value == "" ? moment() : moment( date.value ) }
                                            onChange={ this.onDateChange }
                                            format = "YYYYMMDD"
                                        />
                                    </Col>
                                    <Col span={ 12 }>
                                        <TimePicker
                                            format = 'HHmm'
                                            value = { time.value == "" ? moment() : moment( time.value, 'HHmm') }
                                            onChange={ this.onTimeChange }
                                        />
                                    </Col>

                                </Row>
                            </FormItem>
                            <FormItem
                                wrapperCol = {{ offset: 16,span: 8}}
                                label=""
                                className="footer"
                            >
                                <Button className="c-btn c-btn-blue"
                                        onClick = { this.submitForm }
                                        loading = {this.state.submitLoading}
                                >
                                    确定
                                </Button>
                                <Button className="c-btn c-btn-default"
                                        onClick = { this.props.closeCollaborateDialog }
                                >
                                    取消
                                </Button>
                            </FormItem>
                        </Form>

                    </div>
                </div>
            </DraggableModule>
        )
    }
};
const OutPoolByTOBT = Form.create()(OutPoolByTOBTForm);
export default OutPoolByTOBT;
