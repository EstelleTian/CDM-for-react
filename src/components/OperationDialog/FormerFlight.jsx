import React from 'react';
import { Row, Col, Icon, Input, Select, Button, message } from 'antd';
import { getDayTimeFromString } from "utils/basic-verify";
import { requestGet, request } from "utils/request-actions";
import { getSingleFormerFlightUrl, updateFormerFlightUrl } from "utils/request-urls";
import { FmeStatusList } from "utils/flightcoordination";
import DraggableModule from "components/DraggableModule/DraggableModule";
import './FormerFlight.less';


const Option = Select.Option;

class FormerFlight extends React.Component{
    constructor(props){
        super(props);
        this.getRecordRequest = this.getRecordRequest.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.convertFlightData = this.convertFlightData.bind(this);
        this.showLoading = this.showLoading.bind(this);
        this.hideLoading = this.hideLoading.bind(this);
        this.state = {
            flightViewMap: {}, //本段航班
            formerFlightViewMap: {},  //前段航班集合
            submitLoading: false,
            formerId: ""
        };
    };
    //请求方法
    getRecordRequest(){
        const { id, userId } = this.props;
        //根据航班id获取协调记录
        const params = {
            userId: userId,
            id: id*1
        };
        requestGet( getSingleFormerFlightUrl, params, (res) => {
            const { flightViewMap = {}, formerFlightViewlist = [], generateTime = "" } = res;
            console.log(res);
            const newFlightViewMap = this.convertFlightData(flightViewMap);
            let newFormerFlightViewlist = {};
            for(let index in formerFlightViewlist){
                const formerFlight = this.convertFlightData(formerFlightViewlist[index]);
                for( let id in formerFlight ){
                    newFormerFlightViewlist[id] = formerFlight[id];
                }
            }

            //更新协调记录
            this.setState({
                flightViewMap: newFlightViewMap,
                formerFlightViewMap: newFormerFlightViewlist,
            });
        })
    };
    //将数据转化为显示的格式
    convertFlightData( dataMap ){
        let res = {};
        for( let id in dataMap ){
            const { flightFieldMap = {} } = dataMap[id];
            const { FLIGHTID = {}, PREGISTENUM = {}, DEPAP = {}, ARRAP = {}, DEPTIME = {}, ARRTIME = {}, FMESTATUS = {}, FMEALN = {}, FMEPTN = {} } = flightFieldMap;
            const flightid = FLIGHTID.value || "";  //航班号
            const pregistnum = PREGISTENUM.value || "";  //注册号
            const depap = DEPAP.value || "-";  //起飞机场
            const arrap = ARRAP.value || "-";  //降落机场
            const deptime = getDayTimeFromString(DEPTIME.value || "");  //起飞时间
            const arrtime = getDayTimeFromString(ARRTIME.value || "");  //降落时间
            const fmestatus = FmeStatusList[FMESTATUS.value] || "";  //状态  0 SCH 1 FPL 2 DEP  3 ARR 4 DLA 5 RTN_CPL 6 CNL
            const fmealn = ( FMEALN.value || false ) ? "备降" : "";  //备降 true/false
            const fmeptn = ( FMEPTN.value || false ) ? "返航" : "";  //返航 true/false
            let str = flightid + " " + pregistnum + " " + depap + "-" + arrap + " " + deptime + "-" +
                arrtime + " " + fmestatus + " " + fmealn + " " + fmeptn;
            res[id] = str;
        }
        return res;
    }

    componentWillMount(){
        this.getRecordRequest();
    };
    componentWillUpdate(){
        this.getRecordRequest();
    };
    shouldComponentUpdate(nextProps, nextState){
        if( nextProps.id == this.props.id ){
            var keysA = Object.keys(this.state.flightViewMap);
            var keysB = Object.keys(nextState.flightViewMap);
            if (keysA.length !== keysB.length) {
                return true;
            }else{
                for (let idx = 0; idx < keysA.length; idx++) {
                    let key = keysA[idx];
                    if( keysB.indexOf(key) == -1 ){
                        return true;
                    }
                }
                return false;
            }
        }else{
            return true;
        }
    };

    handleChange(value) {
        console.log(`selected ${value}`);
        this.setState({
            formerId: value
        })
    }
    submitForm() {
        console.log('submitForm');
        //按钮增加loading
        this.showLoading('submit');
        const { id, userId, flightid, clickCloseBtn } = this.props;
        const { formerId } = this.state;
        const params = {
            id: id*1,
            userId,
            formerId: formerId*1
        };
            //发送请求
            request( updateFormerFlightUrl, "post", params, (res) => {
                this.hideLoading('submit');
                this.props.requestCallback( res, flightid + "指定前序航班" );
                clickCloseBtn();
            }, ( err ) => {
                message.error(flightid + "指定前序航班" );
                this.hideLoading('submit');
            });

    }
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

    render(){
        const { width = 550, flightid, clickCloseBtn, x, y } = this.props;
        const { flightViewMap, formerFlightViewMap } = this.state;
        const flightViewId = Object.keys(flightViewMap);
        const formerFlightViewIds = Object.keys(formerFlightViewMap);
        return (
            <DraggableModule
                bounds = ".root"
                x = {x}
                y = {y}
            >
                <div className="box center no-cursor former-dialog" style={{ width: width }}>
                    <div className="dialog">
                        {/* 头部*/}
                        <Row className="title drag-target cursor">
                            <span>{ flightid }指定前序航班</span>
                            <div
                                className="close-target"
                                onClick={ clickCloseBtn }
                            >
                                <Icon type="close" title="关闭"/>
                            </div>
                        </Row>
                        {/* 表单内容*/}
                        <div className="content">
                            <Row className="line">
                                <Col span={4} className="label">
                                    本段航班：
                                </Col>
                                <Col span={20}>
                                    <Input defaultValue = {flightViewMap[flightViewId[0]]} readOnly />
                                </Col>
                            </Row>
                            <Row className="line">
                                <Col span={4} className="label">
                                    前段航班：
                                </Col>
                                <Col span={20}>
                                    <Select
                                        onChange={this.handleChange}
                                        placeholder="请选择前序航班">
                                        {
                                            formerFlightViewIds.map(( id )=>(
                                                <Option key={id} value={id}>{formerFlightViewMap[id]}</Option>
                                            ))
                                        }
                                    </Select>
                                </Col>
                            </Row>
                            <Row className="footer">
                                <Button className="c-btn c-btn-blue"
                                        onClick = { this.submitForm }
                                        loading = {this.state.submitLoading}
                                >
                                    提交
                                </Button>
                                <Button className="c-btn c-btn-default"
                                        onClick = { clickCloseBtn }
                                >
                                    关闭
                                </Button>
                            </Row>
                        </div>
                    </div>
                </div>
            </DraggableModule>
        )
    }
};

export default FormerFlight;