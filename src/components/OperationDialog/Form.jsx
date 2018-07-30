import React from 'react';
import moment from 'moment';
import { Checkbox, Input, Form, DatePicker, TimePicker, Button } from 'antd';
import './Form.less'
const FormItem = Form.Item;
const { TextArea } = Input;

const format = 'HH : mm';

class FormDialog extends React.Component{
    constructor( props ){
        super( props );
    }

    render(){
        const { rowData, showName }= this.props;
        const { getFieldDecorator } = this.props.form;
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
        const flightid = rowData["FLIGHTID"];
        const DEPAP = rowData["DEPAP"];
        const ARRAP = rowData["ARRAP"];
        const curValue = rowData[showName];

        return(
            <div className={`content ${showName}`}>
            {
                (showName == "COBT" || showName == "CTOT") ?
                <Form>
                    <FormItem
                        label="航班"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('flightid')(
                            <span className="stable-div">
                            { flightid }
                        </span>
                        )}
                    </FormItem>
                    <FormItem
                        label="机场"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('airport')(
                            <span className="stable-div">
                            { DEPAP + "-" + ARRAP }
                        </span>
                        )}
                    </FormItem>
                    <FormItem
                        label="日期"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('date', {
                            rules: [{
                                type: 'object'
                            }],
                            initialValue: moment(curValue.substring(0,8))
                        })(
                            <DatePicker
                            />
                        )}
                    </FormItem>
                    <FormItem
                        label="时间"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('time', {
                            rules: [{
                                type: 'object'
                            }],
                            initialValue: moment(curValue.substring(8,12))
                        })(
                            <TimePicker
                                format={format}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        label = ""
                        wrapperCol = {{ sm: {offset: 2, span: 16}, xs: {span: 24} }}
                    >
                        {getFieldDecorator('locked', {
                            valuePropName: 'checked'
                        })(
                            <div>
                                <Checkbox
                                    className = "system-locked"
                                    defaultChecked = {true}
                                >禁止系统自动调整</Checkbox>
                            </div>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                    >
                        {getFieldDecorator('comment', {
                            initialValue: ""
                        })(
                            <TextArea placeholder="备注(最多100个字符)"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label=""
                    >
                       <Button className="c-btn c-btn-blue">
                           指定
                       </Button>
                        <Button className="c-btn c-btn-red">
                            撤销
                        </Button>
                    </FormItem>
                </Form>
                : ""
            }
            </div>
        )


    }
};

export default FormDialog;