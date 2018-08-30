//机场流控页面
import React from 'react';
import {Row, Col, Icon, Card, Table} from 'antd';
import DraggableModule from "components/DraggableModule/DraggableModule";
import {getFlowcontrolDetailUrl} from 'utils/request-urls';
import {FlowcontrolUtil} from 'utils/flowcontrol-data-util';
import {formatTimeString, getDayTimeFromString} from "utils/basic-verify";
import {request} from 'utils/request-actions';
import './FlowcontrolDetail.less';

class FlowcontrolDetail extends React.Component {
    constructor(props) {
        super(props);
        this.getFlowcontrolDetail = this.getFlowcontrolDetail.bind(this);
        this.handleFlowcontrolDetailData = this.handleFlowcontrolDetailData.bind(this);
        this.converFlowcontrolData = this.converFlowcontrolData.bind(this);
        this.converFlowRecords = this.converFlowRecords.bind(this);
        this.getColums = this.getColums.bind(this);
        this.batchFormattingTime = this.batchFormattingTime.bind(this);

        this.state = {}
    }

    // 获取流控详情数据
    getFlowcontrolDetail() {
        const {loginUserInfo, id, placeType} = this.props;
        const {userId} = loginUserInfo;

        // 获取参数
        let params = {
            userId,
            flowcontrol: {
                id,
                placeType
            }
        };
        // 发送请求并指定回调方法
        request(getFlowcontrolDetailUrl, 'POST', JSON.stringify(params), this.handleFlowcontrolDetailData);
    }

    // 处理流控详情数据
    handleFlowcontrolDetailData(res) {
        // 取响应结果中的流控数据
        if (res) {
            // 转换流控信息数据
            this.converFlowcontrolData(res);
            // 转换流控协调记录数据
            this.converFlowRecords(res);
        }
    }

    //批量格式化
    batchFormattingTime(array) {
    if(!array){
        return '';
    }
    let arr = array.split(',');
    arr = arr.map((item) => {
        return getDayTimeFromString(item)
    });
    return arr.join(',');
};

    // 转换流控信息数据
    converFlowcontrolData(data) {
        const {systemConfig} = this.props;


        // 生效时间计算
        const  setEffectiveTime = (flow) => {
          const { relativeStartTime,endTime, lastModifyTime, relativeEndTime } = flow;
          // 生效开始时间
          let start = relativeStartTime;
          // 生效结束时间
          let end = '';
          // 若结束时间和最后修改时间都有效，则生效结束时间取两者最小的
          if(endTime && lastModifyTime){
                end = (endTime > lastModifyTime) ? lastModifyTime : endTime;
          }else if(endTime && !lastModifyTime){// 若结束时间有效且最后修改时间无效
              // 若结束时间与相对结束时间不相等，则取相对结束时间
                if(relativeEndTime && (endTime != relativeEndTime)){
                    end = relativeEndTime;
                }else {
                    end = endTime;
                }
          }else if(!endTime && lastModifyTime){ // 若结束时间无效且最后修改时间有效
              end = lastModifyTime;
          }

          start = getDayTimeFromString(start);
          end = getDayTimeFromString(end);
          return `${start}~${end}`
        };
        // 流控状态转换
        const  setflowStatus = (flow) => {
            const { status, relativeStatus, placeType,  } = flow;
            let resObj = {
                statusZh : '',
                className : '',
            };
            if(!status){
                return resObj;
            }
            let res = '';
            if(status == 'PUBLISH'){
                resObj.statusZh = '已发布';
                resObj.className = 'running';
            }else if(status == 'RUNNING'){
                resObj.statusZh = '正在执行';
                resObj.className = 'running';
            }else if(status == 'FUTURE'){
                resObj.statusZh = '将要执行';
                resObj.className = 'future';
            }else if(status == 'TERMINATED'){
                resObj.statusZh = '人工终止';
                resObj.className = 'terminated';
            }else if(status == 'STOP'){
                resObj.statusZh = '系统终止';
                resObj.className = 'terminated';
            }else if(status == 'FINISHED'){
                resObj.statusZh = '正常结束';
                resObj.className = 'finished';
            }else if(status == 'DISCARD'){
                resObj.statusZh = '已废弃';
                resObj.className = 'cancel';
            }else if(status == 'PRE_PUBLISH'){
                resObj.statusZh = '将要发布';
                resObj.className = 'running';
            }else if(status == 'PRE_UPDATE'){
                resObj.statusZh = '将要更新';
                resObj.className = 'running';
            }else if(status == 'PRE_TERMINATED'){
                resObj.statusZh = '将要终止';
                resObj.className = 'terminated';
            }
            // 相对状态
            if(placeType =='POINT' && status && relativeStatus ){
                // 系统名
                const {systemElem} = systemConfig;
                // 状态与相对状态不相同，取相对状态值
                if(status != relativeStatus){
                    if(relativeStatus == 'RUNNING'){
                        resObj.statusZh = `${systemElem}(正在执行)`;
                        resObj.className = 'running';
                    }else if(relativeStatus == 'FINISHED'){
                        resObj.statusZh = `${systemElem}(正常结束)`;
                        resObj.className = 'finished';
                    }
                }
            }
            return resObj;
        };


        // flow 流控信息
        const {flow} = data;
        // id
        const id = flow.id || '';
        // 流控名称
        const name = flow.name || '';
        //生效时间
        const effectiveTime = setEffectiveTime(flow);
        // 流控状态
        const flowStatus = setflowStatus(flow).statusZh;
        const flowStatusClassName = setflowStatus(flow).className;
        // 流控名称(包括id)
        const nameComplex = name + ' (' + id + ')';
        // 发布用户
        const publishUser = flow.publishUserZh + ' (' + flow.publishUser + ')';
        // 来源
        const source = flow.source || '';
        // 原发布单位
        const originalPublishUnit = flow.originalPublishUnit || '';
        // 类型
        let flowcontrolType = FlowcontrolUtil.setFlowcontrolType(flow);

        // 开始时间
        const startTime = getDayTimeFromString(flow.startTime);
         // 结束时间
        const endTime = getDayTimeFromString(flow.endTime);
         // 创建时间
        const generateTime = getDayTimeFromString(flow.generateTime);
         // 修改时间
        const lastModifyTime = getDayTimeFromString(flow.lastModifyTime);
         // 纳入计算时间
        const startFlowCasaTime = getDayTimeFromString(flow.startFlowCasaTime);

        // 限制类型
        const type = FlowcontrolUtil.setType(flow);

        // 限制数值
        const value = FlowcontrolUtil.setValue(flow);

        //  受控航路点
        const controlPoints = flow.controlPoints || '';
        // 受控方向
        const flowcontrolDirection = flow.flowcontrolDirection || '';

        // 受控起飞机场
        const controlDepDirection = flow.controlDepDirection || '';
        // 受控降落机场
        const controlDirection = flow.controlDirection || '';
        // 豁免起飞机场
        const exemptDepDirection = flow.exemptDepDirection || '';
        // 豁免降落机场
        const exemptDirection = flow.exemptDirection || '';
        //限制高度
        const controlLevel = flow.controlLevel || '';
        //预留时隙
        const reserveSlots = this.batchFormattingTime(flow.reserveSlots);
        // 预锁航班时隙变更策略
        const compressAtStartStrategy = FlowcontrolUtil.setCompressAtStartStrategy(flow);
        // 压缩时间范围
        const compressAtStartWinStart = flow.compressAtStartWinStart || '';
        const compressAtEndWinEnd = flow.compressAtEndWinEnd || '';
        // 原因
        const reason = FlowcontrolUtil.setReason(flow);
        // 备注信息
        const comments = flow.comments || '';

        this.setState({
            name,
            effectiveTime,
            flowStatus,
            flowStatusClassName,
            nameComplex,
            publishUser,
            source,
            originalPublishUnit,
            flowcontrolType,
            startTime,
            endTime,
            generateTime,
            lastModifyTime,
            startFlowCasaTime,
            type,
            value,
            controlPoints,
            flowcontrolDirection,
            controlDepDirection,
            controlDirection,
            exemptDepDirection,
            exemptDirection,
            controlLevel,
            reserveSlots,
            compressAtStartStrategy,
            compressAtStartWinStart,
            compressAtEndWinEnd,
            reason,
            comments,
        })


    }

    // 转换流控协调记录数据
    converFlowRecords(data){
        const {flowRecords} = data;

        // 转换协调类型
       const setType =(record) => {
            const { type } = record;
            let res = '';
            if(type == 'PUBLISH'){
                res = '发布'
            }else if(type == 'TIME_SEGMENT'){
                res = '二类放行'
            }else if(type == 'RESERVE_SLOT'){
                res = '预留时隙'
            }else if(type == 'COMPRESS_STRATEGY'){
                res = '压缩窗口'
            }else if(type == 'TERMINATE'){
                res = '人工终止'
            }else if(type == 'UPDATE'){
                res = '修改'
            }else if(type == 'STOP'){
                res = '系统终止'
            }else if(type == 'PER_TERMINATE'){
                res = '即将终止'
            }else if(type == 'FINISHED'){
                res = '正常结束'
            }else if(type == 'ADJUST_SYSTEM_STATUS'){
                res = '系统维护'
            }
            return res;
        };
        // 转换协调状态
       const setRecordStatus =(record) => {
            const { status } = record;
            let res = '';
            if(status == 'PUBLISH'){
                res = '发布'
            }else if(status == 'UPDATE'){
                res = '修改'
            }else if(status == 'STOP'){
                res = '停止'
            }else if(status == 'ADJUST'){
                res = '调整'
            }
            return res;
        };
       // 转换协调前数值
       const setPrevious =(record) => {
           const { type, originalValue, reserveSlots } = record;
           let res = '';
           if(type == 'COMPRESS_STRATEGY' ){ // 压缩窗口
                if(originalValue){
                    const val = originalValue.split('#')[0];
                    if(val == 'PART'){
                        res = '公司申请变更'
                    }else if(val == 'ALL'){
                        res = '公司申请变更'
                    }else if(val == 'NONE'){
                        res = '公司申请变更'
                    }
                }
           }else if(type == 'UPDATE'){ // 修改
               res = originalValue
           }else if(type == 'RESERVE_SLOT'){ // 预留时隙
               res = this.batchFormattingTime(originalValue);
           }else if(type == 'TIME_SEGMENT'){ // 二类放行
               res = this.batchFormattingTime(originalValue);
           }else if(originalValue == 'PUBLISH'){ //
               res = '已发布'
           }else if(originalValue == 'FUTURE'){
               res = '将要执行'
           }else if(originalValue == 'RUNNING'){
               res = '正在执行'
           }else if(originalValue == 'PRE_PUBLISH'){
               res = '窗口期预发布'
           }else if(originalValue == 'PRE_UPDATE'){
               res = '窗口期预修改'
           }else if(originalValue == 'PRE_TERMINATED'){
               res = '窗口期预终止'
           }else if(type == 'ADJUST_SYSTEM_STATUS'){ // 系统维护
               res = originalValue
           }
           return res;
       };

       // 转换协调后数值
       const setCoordinated = (record) => {
           const { type, value, reserveSlots } = record;
           let res = '';
           if(type == 'COMPRESS_STRATEGY' ){ // 压缩窗口
               if(value){
                   const val = value.split('#')[0];
                   if(val == 'PART'){
                       res = '公司申请变更'
                   }else if(val == 'ALL'){
                       res = '公司申请变更'
                   }else if(val == 'NONE'){
                       res = '公司申请变更'
                   }
               }
           }else if(type == 'PUBLISH' || type == 'UPDATE'){ // 发布或修改
               res = value
           }else if(type == 'RESERVE_SLOT'){ // 预留时隙
               res = this.batchFormattingTime(value);
           }else if(type == 'TIME_SEGMENT'){ // 二类放行
               res = this.batchFormattingTime(value);
           }else if(value == 'STOP'){ //
               res = '系统终止'
           }else if(value == 'FINISHED'){
               res = '正常结束'
           }else if(value == 'TERMINATED'){
               res = '人工终止'
           }else if(value == 'PUBLISH'){
               res = '已发布'
           }else if(value == 'FUTURE'){
               res = '将要执行'
           }else if(value == 'RUNNING'){
               res = '正在执行'
           }else if(value == 'PRE_PUBLISH'){
               res = '即将发布'
           }else if(value == 'PRE_UPDATE'){
               res = '即将修改'
           }else if(value == 'PRE_TERMINATED'){
               res = '即将终止'
           }else if(value == 'DISCARD'){
               res = '已废弃'
           }else if(type == 'ADJUST_SYSTEM_STATUS'){ // 系统维护
               res = value
           }
           return res;
       };


        const converRecord = (record) => {
            // id
            let id = record.id;

            let fid = record.fid || '';
            // 协调类型
            let type = setType(record);
            // 协调状态
            let status = setRecordStatus(record);
            // 协调时间
            let timesTamp = record.timesTamp || '';
            // 协调用户
            let username = record.username || '';
            // 协调用户中文
            let usernamezh = (username == 'FlOWMAINTAINCE') ? '流控维护程序' : record.usernamezh || '';
            // 协调用户IP
            let ipAddress = record.ipAddress || '';
            // 协调备注
            let comment = record.comment || '';
            // 协调前
            let previous = setPrevious(record);
            // 协调后
            let coordinated = setCoordinated(record);
            return {
                id,
                type,
                status,
                timesTamp,
                usernamezh,
                ipAddress,
                comment,
                previous,
                coordinated
            }
        };

        let records = [];

        flowRecords.map((item) =>{
            records.push(converRecord(item));
        })

        this.setState({
            flowRecords : records
        })
    };
    // 协调记录表格列
    getColums(){

        //时间格式化
        const columnsTimeFormat = (value, row, index) => {
            //格式化后的value值
            const formatValue = getDayTimeFromString( value ) || "";
            //title值
            const title = formatTimeString(value) || "";

            return {
                children: formatValue,
                props:{
                    title: title
                }
            }
        };

       let columns = [
            {
                title: "协调类型	",
                dataIndex: "type",
                align: 'center',
                key: "type",
                width: 100
            },{
                title: "协调前",
                dataIndex: "previous",
                align: 'center',
                key: "previous",
                width: 100
            },{
                title: "协调后",
                dataIndex: "coordinated",
                align: 'center',
                key: "coordinated",
                width: 100
            },{
                title: "协调备注",
                dataIndex: "comment",
                align: 'center',
                key: "comment",
                width: 100
            },{
                title: "协调状态",
                dataIndex: "status",
                align: 'center',
                key: "status",
               width: 100
            },{
                title: "协调时间",
                dataIndex: "timesTamp",
                align: 'center',
                key: "timesTamp",
                render: columnsTimeFormat,
               width: 100
            },{
                title: "协调用户",
                dataIndex: "usernamezh",
                align: 'center',
                key: "usernamezh",
               width: 100
            },{
                title: "协调用户IP",
                dataIndex: "ipAddress",
                align: 'center',
                key: "ipAddress",
               width: 100
            },
        ];
        return columns;
    }
    componentDidMount() {
        // 获取流控详情数据
        this.getFlowcontrolDetail()
    }

    render() {
        const {titleName, clickCloseBtn, width = 1000, dialogName, x, y } = this.props;
        const {
            name, effectiveTime, flowStatus, nameComplex, flowStatusClassName, source, flowcontrolType, publishUser, originalPublishUnit,
            type, value, reason, controlPoints, flowcontrolDirection, controlDepDirection,controlDirection,
            exemptDepDirection, exemptDirection, controlLevel, reserveSlots, startTime, endTime, generateTime,
            lastModifyTime, startFlowCasaTime, compressAtStartStrategy, compressAtStartWinStart, compressAtEndWinEnd,
            comments, flowRecords} = this.state;
        const Layout24 = {span: 24};
        const Layout12 = {span: 12};
        const Layout6 = {span: 6};
        const columns = this.getColums();
        return (
            <DraggableModule
                bounds=".root"
                x = {x}
                y = {y}
            >
                <div className="box center no-cursor" style={{width: width}}>
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
                        {/* 表单内容*/}
                        <Row className="content flowcontol-detail">
                            <Col {...Layout24}>
                                <Row>
                                    <Col {...Layout24} className="head">
                                        <h1 className="name">{ name }</h1>
                                        <div className="effective-time">生效时间:{effectiveTime}</div>
                                        <div className={ flowStatusClassName ? `status ${flowStatusClassName}` : 'status'}>{flowStatus}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="detail-list">
                                        <Row>
                                            <Col className="description">基本信息</Col>
                                        </Row>
                                        <Row>
                                            <Col {...Layout12}>
                                                <div className="trem">流控名称</div>
                                                <div className="detail">{ nameComplex }</div>
                                            </Col>
                                            <Col {...Layout6}>
                                                <div className="trem">来源</div>
                                                <div className="detail">{source}</div>
                                            </Col>
                                            <Col {...Layout6}>
                                                <div className="trem">类型</div>
                                                <div className="detail">{flowcontrolType}</div>

                                            </Col>
                                            <Col {...Layout12}>
                                                <div className="trem">发布用户</div>
                                                <div className="detail">{ publishUser }</div>
                                            </Col>
                                            <Col {...Layout12}>
                                                <div className="trem">原发布单位</div>
                                                <div className="detail">{ originalPublishUnit }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="detail-list">
                                        <Row>
                                            <Col className="description">限制时间 </Col>
                                        </Row>
                                        <Row type="flex" justify="start">
                                            <Col {...Layout12}>
                                                <div className="trem">开始时间</div>
                                                <div className="detail">{ startTime }</div>
                                            </Col>

                                            <Col {...Layout12}>
                                                <div className="trem">结束时间</div>
                                                <div className="detail">{endTime}</div>
                                            </Col>
                                            <Col {...Layout12}>
                                                <div className="trem">创建时间</div>
                                                <div className="detail">{ generateTime }</div>
                                            </Col>
                                            <Col {...Layout12}>
                                                <div className="trem">修改时间</div>
                                                <div className="detail">{ lastModifyTime }</div>
                                            </Col>
                                            <Col {...Layout12}>
                                                <div className="trem">纳入计算时间</div>
                                                <div className="detail">{ startFlowCasaTime }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="detail-list">
                                        <Row>
                                            <Col className="description">限制类型 </Col>
                                        </Row>
                                        <Row type="flex" justify="start">
                                            <Col {...Layout12}>
                                                <div className="trem">限制类型</div>
                                                <div className="detail">{ type }</div>
                                            </Col>

                                            <Col {...Layout12}>
                                                <div className="trem">限制数值</div>
                                                <div className="detail">{ value }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="detail-list">
                                        <Row>
                                            <Col className="description">限制方向 </Col>
                                        </Row>

                                        <Row type="flex" justify="start">
                                            <Col {...Layout12}>
                                                <div className="trem">受控航路点</div>
                                                <div className="detail">{ controlPoints }</div>
                                            </Col>

                                            <Col {...Layout12}>
                                                <div className="trem">受控方向</div>
                                                <div className="detail">{ flowcontrolDirection }</div>
                                            </Col>
                                            <Col {...Layout12}>
                                                <div className="trem">受控起飞机场</div>
                                                <div className="detail">{ controlDepDirection }</div>
                                            </Col>
                                            <Col {...Layout12}>
                                                <div className="trem">豁免起飞机场</div>
                                                <div className="detail">{ exemptDepDirection }</div>
                                            </Col>
                                            <Col {...Layout12}>
                                                <div className="trem">受控降落机场</div>
                                                <div className="detail">{ controlDirection }</div>
                                            </Col>
                                            <Col {...Layout12}>
                                                <div className="trem">豁免降落机场</div>
                                                <div className="detail">{ exemptDirection }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="detail-list">
                                        <Row>
                                            <Col className="description">限制高度 </Col>
                                        </Row>

                                        <Row type="flex" justify="start">
                                            <Col {...Layout12}>
                                                <div className="trem">限制高度</div>
                                                <div className="detail">{ controlLevel }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="detail-list">
                                        <Row>
                                            <Col className="description">限制原因 </Col>
                                        </Row>

                                        <Row type="flex" justify="start">
                                            <Col {...Layout12}>
                                                <div className="trem">限制原因</div>
                                                <div className="detail">{ reason }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="detail-list">
                                        <Row>
                                            <Col className="description">预留时隙 </Col>
                                        </Row>

                                        <Row type="flex" justify="start">
                                            <Col {...Layout12}>
                                                <div className="trem">时隙时间</div>
                                                <div className="detail">{ reserveSlots }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="detail-list">
                                        <Row>
                                            <Col className="description">预锁航班时隙变更策略 </Col>
                                        </Row>

                                        <Row type="flex" justify="start">
                                            <Col {...Layout12}>
                                                <div className="trem">变更策略</div>
                                                <div className="detail">{ compressAtStartStrategy }</div>
                                            </Col>
                                            <Col {...Layout12}>
                                                <div className="trem">压缩时间范围</div>
                                                <div className="detail">{ compressAtStartWinStart ? `${compressAtStartWinStart} ~ ${compressAtEndWinEnd}` : '' }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="detail-list">
                                        <Row>
                                            <Col className="description">备注信息 </Col>
                                        </Row>

                                        <Row type="flex" justify="start">
                                            <Col {...Layout24}>
                                                <div className="trem">备注</div>
                                                <div className="detail">{ comments }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} className="detail-list">
                                        <Row>
                                            <Col className="description">协调记录 </Col>
                                        </Row>

                                        <Row type="flex" justify="start">
                                            <Col {...Layout24}>
                                                <Table
                                                    columns={ columns }
                                                    dataSource={ flowRecords }
                                                    size="small"
                                                    pagination = { false }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </div>
                </div>
            </DraggableModule>
        )
    }
}
;

export default FlowcontrolDetail ;