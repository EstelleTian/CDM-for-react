//机场流控页面
import React from 'react';
import { Row, Col, Icon, Button, Card, Form, Input, Checkbox, Select, Radio, DatePicker, TimePicker     } from 'antd';
import { getPointByAirportUrl } from 'utils/request-urls';
import {  request } from 'utils/request-actions';
import moment from 'moment';
import DraggableModule from "components/DraggableModule/DraggableModule";

import './APFlowcontrolDialog.less';

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
        this.getPointByAirport = this.getPointByAirport.bind(this);
        this.updatePoins = this.updatePoins.bind(this);
        this.handleChangeOriginalPublishUnit = this.handleChangeOriginalPublishUnit.bind(this);
        this.handleChangeFlowcontrolType = this.handleChangeFlowcontrolType.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleChangeReason = this.handleChangeReason.bind(this);
        this.state = {
            flowcontrolPointsList : [], // 流控点集合
            flowcontrolType : 1, // 长期流控  (1:非长期  0:长期)
            publishUserZh : this.props.loginUserInfo.description || '', // 发布用户
            originalPublishUnit : '', // 原发布单位
            type : 'TIME', // 限制类型
            controlPoints : [], // 限制流控点(勾选的)
            controlDepDirection : this.props.loginUserInfo.airports, // 受控起飞机场
            reason : '', // 限制原因
        }
    }
    // 拼接流控名称
    splicingName () {
        console.log('hello');
    }
    // 依据机场获取流控点(受控点)数据
    getPointByAirport(){

        const { loginUserInfo } = this.props;
        // 用户关注机场即开始点
        const { airports } = loginUserInfo;
        console.log(airports)

        let para = {
            startWaypoints : airports
        }

        request(getPointByAirportUrl,'POST',para,this.updatePoins);
    }
    // 更新流控点
    updatePoins(res) {
        let  { flowcontrolPointsList = [] } = res;
        // 过滤空点
        flowcontrolPointsList = flowcontrolPointsList.filter((item) => {
            if('AP' == item.type){                
                // 解析JSON字符串
                item.points = JSON.parse(item.points);
                return true
            }
        });
        // 处理数据
        flowcontrolPointsList.map((item) =>{
            // 增加options属性，用于生成 Checkbox 组
            item.options  = [];
            item.points.map((i,ind) =>{
                const opt = {
                    label : i.name,
                    value : i.name,
                    group : i.group,
                };
                item.options.push(opt);
            })
        });


        this.setState({
            flowcontrolPointsList
        })
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

    //
    componentDidMount(){

        this.getPointByAirport()
    }


    render(){
        const {flowcontrolType, type, flowcontrolPointsList, controlPoints, publishUserZh, controlDepDirection, reason} = this.state;
        const { titleName, clickCloseBtn, width, dialogName} = this.props;
        const dateFormat = 'YYYYMMDD';
        const format = 'HHmm';
        return (
            <DraggableModule>
                <div className="box center no-cursor" style={{ width: width }}>
                    <div className="dialog">
                        {/* 头部*/}
                        <Row className="title drag-target cursor">
                            <span>{ titleName }</span>
                            <div
                                className="close-target"
                                onClick={ () => {
                                    clickCloseBtn(dialogName);
                                } }
                            >
                                <Icon type="close" title="关闭"/>
                            </div>
                        </Row>
                        {/*/!* 内容 *!/*/}
                        <Row className="content">
                            <Col xs={{ span: 24}}  md={{ span: 24}} lg={{ span: 24}}  xl={{ span: 24}} xxl={{ span: 24}} >
                                <Card title="基本信息" className="card" >
                                    <Form className="" layout="vertical" >
                                        <Row className="" >
                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12}} xxl={{ span: 6}} >
                                                <FormItem
                                                    label="流控名称"
                                                >
                                                    <Search
                                                        placeholder="请输入流控名称"
                                                        enterButton="自动命名"
                                                        onSearch={this.splicingName}
                                                    />
                                                </FormItem>
                                            </Col>
                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12, offset: 1}} xxl={{ span: 5, offset: 1}}  >

                                                <FormItem
                                                    label="长期流控"
                                                >
                                                    <Checkbox
                                                        checked={ !flowcontrolType }
                                                        onChange={this.handleChangeFlowcontrolType}
                                                    >长期流控
                                                    </Checkbox>
                                                </FormItem>
                                            </Col>
                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12, offset: 1}} xxl={{ span: 5, offset: 1}} >
                                                <FormItem
                                                    label="发布用户"
                                                >
                                                    <Input placeholder="请输入发布者" value={ publishUserZh } disabled ={true} />
                                                </FormItem>
                                            </Col>
                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12, offset: 1}} xxl={{ span: 5, offset: 1}} >
                                                <FormItem
                                                    label="原发布者"
                                                >
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
                                                </FormItem>
                                            </Col>

                                        </Row>

                                    </Form>

                                </Card>
                                <Card title="限制时间" className="card" >
                                    <Form className="" layout="vertical" >
                                        <Row className="" >
                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12}} xxl={{ span: 6}} >
                                                <FormItem
                                                    label="开始日期"
                                                >
                                                    <DatePicker
                                                        defaultValue={moment('2018/07/25', dateFormat)}
                                                        format={dateFormat}
                                                    />
                                                </FormItem>
                                            </Col>

                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12, offset: 1}} xxl={{ span: 5, offset: 1}} >
                                                <FormItem
                                                    label="开始时间"
                                                >
                                                    <TimePicker defaultValue={moment('12:08', format)} format={format} />
                                                </FormItem>
                                            </Col>

                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12, offset: 1}} xxl={{ span: 5, offset: 1}} >
                                                <FormItem
                                                    label="结束日期"
                                                >
                                                    <Input placeholder="结束日期" />
                                                </FormItem>
                                            </Col>
                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12, offset: 1}} xxl={{ span: 5, offset: 1}} >
                                                <FormItem
                                                    label="结束时间"
                                                >
                                                    <Input placeholder="结束时间" />
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>

                                </Card>
                                <Card title="限制类型" className="card" >
                                    <Form className="" layout="vertical" >
                                        <Row className="" >
                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12}} xxl={{ span: 12}} >
                                                <FormItem
                                                    label="限制类型"
                                                >
                                                    <RadioGroup
                                                        value = {type}
                                                        onChange={this.handleChangeType}
                                                    >
                                                        <Radio value="TIME">时间</Radio>
                                                        <Radio value="GS">地面停止</Radio>
                                                        <Radio value="REQ">开车申请</Radio>
                                                        <Radio value="ASSIGN">指定时隙</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </Col>

                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12, offset: 1}} xxl={{ span: 5, offset: 1}} >
                                                <FormItem
                                                    label="限制数值"
                                                >
                                                    <Input placeholder="限制数值" />
                                                </FormItem>
                                            </Col>

                                        </Row>
                                    </Form>

                                </Card>
                                <Card title="限制方向" className="card" >
                                    <Form className="" layout="vertical" >

                                        {
                                            flowcontrolPointsList.map((item) =>{
                                                return (
                                                    <Row key= {item.id}>
                                                        <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12}} xxl={{ span: 24}} >

                                                            <FormItem
                                                                label= { item.description}
                                                            >
                                                                <CheckboxGroup
                                                                    options= { item.options}
                                                                    value = {controlPoints}
                                                                />
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                )
                                            })
                                        }


                                        <Row className="" >
                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12}} xxl={{ span: 6}} >
                                                <FormItem
                                                    label="受控起飞机场"
                                                >
                                                    <Input placeholder="受控起飞机场" value={controlDepDirection} disabled ={true} />
                                                </FormItem>
                                            </Col>

                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12, offset: 1}} xxl={{ span: 5, offset: 1}} >
                                                <FormItem
                                                    label="受控降落机场"
                                                >
                                                    <Input placeholder="受控降落机场" />
                                                </FormItem>
                                            </Col>

                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12, offset: 1}} xxl={{ span: 5, offset: 1}} >
                                                <FormItem
                                                    label="豁免起飞机场"
                                                >
                                                    <Input placeholder="" disabled ={true} />
                                                </FormItem>
                                            </Col>
                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12, offset: 1}} xxl={{ span: 5, offset: 1}} >
                                                <FormItem
                                                    label="豁免降落机场"
                                                >
                                                    <Input placeholder="豁免降落机场" />
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>

                                </Card>
                                <Card title="限制高度" className="card" >
                                    <Form className="" layout="vertical" >
                                        <Row className="" >
                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12}} xxl={{ span: 6}} >
                                                <FormItem
                                                    label="高度"
                                                >
                                                    <Input placeholder="限制高度" />
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>

                                </Card>
                                <Card title="限制原因" className="card" >
                                    <Form className="" layout="vertical" >
                                        <Row className="" >
                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12}} xxl={{ span: 24}} >
                                                <FormItem
                                                    label="原因"
                                                >
                                                    <RadioGroup
                                                        value = {reason}
                                                        onChange={this.handleChangeReason}
                                                    >
                                                        <Radio value='ACC'>空管</Radio>
                                                        <Radio value='WEATHER'>天气</Radio>
                                                        <Radio value='AIRPORT'>机场</Radio>
                                                        <Radio value='CONTROL'>航班时刻</Radio>
                                                        <Radio value='EQUIPMENT'>设备</Radio>
                                                        <Radio value='MILITARY'>其他空域用户</Radio>
                                                        <Radio value='OTHERS'>其他</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>

                                </Card>
                                <Card title="预留时隙" className="card" >
                                    <Form className="" layout="vertical" >
                                        <Row className="" >
                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12}} xxl={{ span: 6}} >
                                                <FormItem
                                                    label="时隙"
                                                >
                                                    <Input placeholder="时隙" />
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>

                                </Card>

                                <Card title="备注" className="card" >
                                    <Form className="" layout="vertical" >

                                        <Row className="" >
                                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12}} xxl={{ span: 12}} >
                                                <FormItem
                                                    label="备注"
                                                >
                                                        <textarea placeholder="请输入备注" rows="4" className="comments">

                                                        </textarea>
                                                </FormItem>
                                            </Col>
                                        </Row>

                                    </Form>
                                </Card>
                            </Col>
                        </Row>
                        {/* 底部*/}
                        <Row className="footer">
                            <Col className="" xs={{ span: 24}}  md={{ span: 24}} lg={{ span: 24}}  xl={{ span: 24}} xxl={{ span: 24}} >

                                <Button className= 'c-btn c-btn-default'
                                        onClick={ () => {
                                            clickCloseBtn(type);
                                        }}
                                >
                                    关闭
                                </Button>
                                <Button className='c-btn c-btn-blue'
                                        type="primary"
                                >
                                    提交
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </DraggableModule>
        )
    }
};

export default APFlowcontrolDialog;