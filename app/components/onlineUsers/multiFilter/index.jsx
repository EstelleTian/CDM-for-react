import React from 'react'
import { Form, Input, Popover, Button, DatePicker, Tag, Modal } from 'antd';
import axios from 'axios'
import $ from 'jquery'
import { sendMultiFiltersUrl, parseFullTime } from '../../../utils/requestUrls'
import './multiFilter.less'
const FormItem = Form.Item;

class MultiFilterForm extends React.Component {
    disabledStartDate = (startTime) => {
        const endTime = this.props.form.getFieldValue("endTime");
        if (!startTime || !endTime) {
            return false;
        }
        return startTime.valueOf() > endTime.valueOf();
    }

    disabledEndDate = (endTime) => {
        const startTime = this.props.form.getFieldValue("startTime");
        if (!endTime || !startTime) {
            return false;
        }
        return endTime.valueOf() <= startTime.valueOf();
    }

    onStartChange = (value) => {
        this.props.form.setFieldsValue({
            "startTime": value
        })
    }

    onEndChange = (value) => {
        this.props.form.setFieldsValue({
            "endTime": value
        })
    }

    resetForm = () => {
        this.props.form.resetFields();
        this.sendMultiRequest({});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let start = values['startTime'] || "";
                if("" != start){
                    start = start.format('YYYYMMDDHHmmss')
                }
                let end = values['endTime'] || "";
                if("" != end){
                    end = end.format('YYYYMMDDHHmmss')
                }
                let username = values['username'] || "";
                let clientVersion = values['clientVersion'] || "";
                let ipAddress = values['ipAddress'] || "";
                let sendDatas = {
                    username,
                    clientVersion,
                    ipAddress,
                    startTime: start,
                    endTime: end
                }
                this.sendMultiRequest(sendDatas)
            }
        });
    }

    sendMultiRequest = ( datas ) => {
        const { updateOnlineUserList, updateMultiFilter, closeFilterPopover, history } = this.props;
        let sendValues = {
            username: "",
            clientVersion: "",
            ipAddress: "",
            startTime: "",
            endTime: "",
            ...datas
        }
        const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
        axios.request({
            url: sendMultiFiltersUrl,
            method: 'post',
            params: sendValues,
            headers: {
                Authorization: UUMAToken,
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            withCredentials: true
        }).then( response => {
            const json = response.data;
            const status = json.status*1 || 0;
            if(200 == status){
                if(json.hasOwnProperty("onLineUserResultList")){
                    const userList = json.onLineUserResultList || [];
                    updateOnlineUserList(userList, true);
                    updateMultiFilter(sendValues);
                    closeFilterPopover();
                }else if(json.hasOwnProperty("warn")){
                    closeFilterPopover();
                    const error = json.warn.message ? json.warn.message : "";
                    Modal.error({
                        title: "查询失败:" +error
                    })
                }
            }else if( 400 == status ){
                Modal.error({
                    title: "登录失效，请重新登录!",
                    onOk(){
                        history.push('/');
                    }
                })
            }else{
                console.error("received data is invalida.");
                console.error(json);
            }
        }).catch(err => {
            console.error(err);
        })

        // $.ajax({
        //     url: sendMultiFiltersUrl,
        //     data: sendValues,
        //     type: 'POST',
        //     dataType: 'json',
        //     beforeSend: function(request) {
        //         request.setRequestHeader("Authorization", UUMAToken);
        //     },
        //     success: (res) => {
        //         if("200" == res.status){
        //             if(res.hasOwnProperty("onLineUserResultList")){
        //                 const userList = res.onLineUserResultList || [];
        //                 updateOnlineUserList(userList, false);
        //                 updateMultiFilter(sendValues);
        //                 closeFilterPopover();
        //             }else if(res.hasOwnProperty("warn")){
        //                 closeFilterPopover();
        //                 const error = res.warn.message ? res.warn.message : "";
        //                 Modal.error({
        //                     title: "查询失败:" +error
        //                 })
        //             }
        //         }
        //
        //
        //     },
        //     error: (err) => {
        //         console.error(err);
        //     }
        // })
    }

    render() {
        const { toggleFilterPopover, multiFilterKey } = this.props;
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };

        return (
            <Form onSubmit={this.handleSubmit} className="filter_form">
                <FormItem
                    {...formItemLayout}
                    label="用户名"
                    hasFeedback
                >
                    {getFieldDecorator('username', {
                        initialValue: multiFilterKey.username || ""
                    })(
                        <Input type="string" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="客户端版本"
                    hasFeedback
                >
                    {getFieldDecorator('clientVersion', {
                        initialValue: multiFilterKey.clientVersion || ""
                    })(
                        <Input type="string" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="IP地址"
                    hasFeedback
                >
                    {getFieldDecorator('ipAddress', {
                        initialValue: multiFilterKey.ipAddress || ""
                    })(
                        <Input type="string" />
                    )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="登录开始时间"
                hasFeedback
            >
                {getFieldDecorator('startTime', {
                })(
                    <DatePicker
                        disabledDate={this.disabledStartDate}
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="格式YYYY-MM-DD HH:mm:ss"
                        onChange={this.onStartChange}
                        style={{width: '200px'}}
                    />
                )}
            </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="登录结束时间"
                    hasFeedback
                >
                    {getFieldDecorator('endTime', {
                    })(
                        <DatePicker
                            disabledDate={this.disabledEndDate}
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="格式YYYY-MM-DD HH:mm:ss"
                            onChange={this.onEndChange}
                            style={{width: '200px'}}
                        />
                    )}
                </FormItem>
                <FormItem wrapperCol={{span: 16,offset: 8}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button type="ghost" className="m_l_10 clear_btn" onClick={this.resetForm}>清空</Button>
                    <Button type="ghost" className="m_l_10 clear_btn" onClick={toggleFilterPopover}>取消</Button>
                </FormItem>
            </Form>
        );
    }
}
MultiFilterForm = Form.create()(MultiFilterForm);

class MultiFilter extends React.Component{
    render(){
        const { toggleFilterPopover, multiFilterKey, filterPopover } = this.props;
        return (
            <div>
                <Popover
                    content={
                        <div>
                            <MultiFilterForm
                                {...this.props}
                            />
                        </div>
                    }
                    visible={filterPopover}
                    trigger="click"
                >
                    <Button type="primary" icon="search" onClick={toggleFilterPopover}>多条件查询</Button>
                </Popover>
                <div className="tag_items">
                    {
                        multiFilterKey.username.trim() != "" ? <Tag>用户名：{multiFilterKey.username}</Tag> : ""
                    }
                    {
                        multiFilterKey.clientVersion.trim() != "" ? <Tag>客户端版本：{multiFilterKey.clientVersion}</Tag> : ""
                    }
                    {
                        multiFilterKey.ipAddress.trim() != "" ? <Tag>IP地址：{multiFilterKey.ipAddress}</Tag> : ""
                    }
                    {
                        multiFilterKey.startTime.trim() != "" ? <Tag>登录开始时间：{parseFullTime(multiFilterKey.startTime)}</Tag> : ""
                    }

                    {
                        multiFilterKey.endTime.trim() != "" ? <Tag>登录结束时间：{parseFullTime(multiFilterKey.endTime)}</Tag> : ""
                    }
                </div>
            </div>
        )
    }
}

export default MultiFilter;