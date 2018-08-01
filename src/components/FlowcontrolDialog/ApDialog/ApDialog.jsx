//机场流控页面
import React from 'react';
import { Row, Col, Icon, Button, Card, Form, Input, Checkbox, Select, Radio, DatePicker, TimePicker     } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;

class ApDialog extends React.Component{
    constructor( props ){
        super(props);
    }
    render(){
        const { titleName} = this.props;
        const dateFormat = 'YYYYMMDD';
        const format = 'HHmm';
        return (
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
                                        onSearch={value => console.log(value)}
                                    />
                                </FormItem>
                            </Col>
                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12, offset: 1}} xxl={{ span: 5, offset: 1}}  >

                                <FormItem
                                    label="长期流控"
                                >
                                    <Checkbox
                                        // checked={ shieldLong }
                                        // onChange={this.onChangeShieldLong}
                                    >长期流控
                                    </Checkbox>
                                </FormItem>
                            </Col>
                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12, offset: 1}} xxl={{ span: 5, offset: 1}} >
                                <FormItem
                                    label="发布用户"
                                >
                                    <Input placeholder="请输入发布者" />
                                </FormItem>
                            </Col>
                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12, offset: 1}} xxl={{ span: 5, offset: 1}} >
                                <FormItem
                                    label="原发布者"
                                >
                                    <Select
                                        defaultValue="1"
                                    >
                                        <Option value="1">流量室</Option>
                                        <Option value="2">塔台</Option>
                                        <Option value="3" >进近</Option>
                                        <Option value="4">兰州</Option>
                                        <Option value="5">西安</Option>
                                        <Option value="6">广州</Option>
                                        <Option value="7">贵阳</Option>
                                        <Option value="8">昆明</Option>
                                        <Option value="9">拉萨</Option>
                                        <Option value="10">重庆</Option>
                                        <Option value="11">自定义</Option>
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
                                    <DatePicker defaultValue={moment('2018/07/25', dateFormat)} format={dateFormat} />
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
                                    <RadioGroup >
                                        <Radio value={1}>时间</Radio>
                                        <Radio value={2}>地面停止</Radio>
                                        <Radio value={3}>开车申请</Radio>
                                        <Radio value={4}>指定时隙</Radio>
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
                        <Row className="" >
                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12}} xxl={{ span: 24}} >
                                <FormItem
                                    label="内控点"
                                >
                                    <RadioGroup >
                                        <Radio value={"ZYG"}>ZYG</Radio>
                                        <Radio value={"LUGVO"}>LUGVO</Radio>
                                        <Radio value={"P426"}>P426</Radio>
                                        <Radio value={"P415"}>P415</Radio>
                                        <Radio value={"CZH"}>CZH</Radio>
                                        <Radio value={"DOREX"}>DOREX</Radio>
                                        <Radio value={"VENON"}>VENON</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="" >
                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12}} xxl={{ span: 24}} >
                                <FormItem
                                    label="外控点"
                                >
                                    <RadioGroup >
                                        <Radio value={"AGULU"}>AGULU</Radio>
                                        <Radio value={"OMBON"}>OMBON</Radio>
                                        <Radio value={"GAO"}>GAO</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row className="" >
                            <Col xs={{ span: 12}}  md={{ span: 12}} lg={{ span: 12}}  xl={{ span: 12}} xxl={{ span: 6}} >
                                <FormItem
                                    label="受控起飞机场"
                                >
                                    <Input placeholder="受控起飞机场" />
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
                                    <Input placeholder="豁免起飞机场" />
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
                                    <RadioGroup >
                                        <Radio value={"ZYG"}>空管</Radio>
                                        <Radio value={"LUGVO"}>天气</Radio>
                                        <Radio value={"P426"}>机场</Radio>
                                        <Radio value={"P415"}>航班时刻</Radio>
                                        <Radio value={"CZH"}>设备</Radio>
                                        <Radio value={"DOREX"}>其他空域用户</Radio>
                                        <Radio value={"VENON"}>其他</Radio>
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
        )
    }
};

export default ApDialog;