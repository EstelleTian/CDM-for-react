import React from 'react'
import {Table, ICon, Button, Col, Row, Input, Popconfirm} from 'antd'
import { getLoginVersionByCategoryIdUrl,deleteLoginVersionUrl} from '../../../utils/requestUrls'
import LoginVersionModalContainer from '../../../container/loginVersionModalContainer'
import { sendGetListReq, sendDeleteOneReq } from "../../../utils/requests"
const Search = Input.Search
import '../../common/atable.less'

class loginVersionList extends React.Component{
    constructor(props){
        super(props);
        this.getColumns = this.getColumns.bind(this);
        this.getDatas = this.getDatas.bind(this);
        // this.retrieveloginVersionList = this.retrieveloginVersionList.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
    }

    componentDidMount(){
        // this.retrieveloginVersionList()
    }

    // 通过登录控制类型id获取登录控制版本列表
    retrieveloginVersionList(){
        const { refreshLoginVersion, history, loginCategoryModal } = this.props;
        // 获取登录控制类型id
        let loginTypeId = loginCategoryModal.data.id || '';
        sendGetListReq(getLoginVersionByCategoryIdUrl + loginTypeId, refreshLoginVersion, "loginVersions", history);
    }

    //删除请求
    sendDeleteAjax(id){
        const { delOneLoginVersion } = this.props;
        sendDeleteOneReq(deleteLoginVersionUrl, delOneLoginVersion, id);
    }

    //列配置
    getColumns(){
        const { optsAuths } = this.props;
        const columns = [
            {
                title: "序号",
                dataIndex: 'key',
                width: '3%',
                sorter: (a, b) => a.key - b.key,
            },{
                title: "客户端版本号",
                dataIndex: 'clientVersion',
                width: '6%',
                sorter: (a, b) => {
                    var nameA = a.clientVersion.toUpperCase();
                    var nameB = b.clientVersion.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }else if (nameA > nameB) {
                        return 1;
                    }else{
                        return 0;
                    }
                }
            },  {
                title: "发布者",
                dataIndex: 'publishUser',
                width: '6%',
            },{
                title: "发布者中文",
                dataIndex: 'publishUserZH',
                width: '8%'
            },{
                title: "操作",
                dataIndex: 'operators',
                width: '6%',
                render : ( text, record, index ) => (
                        <div className="table_opts">
                            {
                                (optsAuths.indexOf('31010711') == -1) ? ''
                                    : <Button type="primary"
                                              shape="circle"
                                              icon="edit"
                                              title="修改"
                                              onClick={()=>{
                                                  this.onClickEdit(record)
                                              }}
                                    ></Button>
                            }
                            {
                                (optsAuths.indexOf('31010711') == -1) ? ''
                                    : <Popconfirm title={`确定删除客户端版本${record.clientVersion}`} okText="确定" cancelText="取消"
                                                  onConfirm={ () => {
                                                      this.sendDeleteAjax(record.id)
                                                  }}
                                >
                                    <Button type="default"
                                            shape="circle"
                                            icon="delete"
                                            title="删除"
                                    ></Button>
                                </Popconfirm>
                            }
                        </div>
                    )
            },
        ];
        return columns
    }

    //表格数据处理
    getDatas(){
        const { loginVersionList } = this.props;
        let orgData = loginVersionList.data;
        let tableData = [];
        //遍历用户，补充key和操作列
        for(let n=0; n< orgData.length; n++){
            const loginVersion = orgData[n];
            let oneRow = {};
            oneRow["key"] = n+1;
            oneRow["id"] = loginVersion.id;
            oneRow["clientVersion"] = loginVersion.clientVersion;
            oneRow["loginTypeId"] = loginVersion.loginTypeId;
            oneRow["version"] = loginVersion.version;
            oneRow["createTime"] = loginVersion.createTime;
            oneRow["updateTime"] = loginVersion.updateTime;
            oneRow["publishUser"] = loginVersion.publishUser;
            oneRow["publishUserZH"] = loginVersion.publishUserZH;
            oneRow["loginVersion"] = loginVersion;
            oneRow["operators"] = "";

            //添加一条数据
            tableData.push(oneRow);
        }
        return tableData
    }

    //点击修改处理事件
    onClickEdit(orgData){
        // 触发打开登录控制类型模块方法
        const { openLoginVersionModal, loginCategoryModal } = this.props;
        // 将登录控制类型的id传入LoginVersionModal中
        let loginData = loginCategoryModal.data || {};
        openLoginVersionModal(orgData, loginData)
    }

    render(){
        const {  loginVersionList, updateLoginVersionSearch, openLoginVersionModal,optsAuths, loginCategoryModal } = this.props;
        return(
            <div className="table_container">
                <Row span={24} className="table_nav">
                    <Col span={10}>
                        <span  className="table_title"></span>
                    </Col>
                    <Col className="operators" span={14}>
                        {   // 添加版本按钮
                            (optsAuths.indexOf('31010711') == -1) ? ''
                                : <Button
                                type="primary"
                                onClick={() => {
                                    // 将登录控制类型的id传入LoginVersionModal中
                                    let loginData = loginCategoryModal.data || {};
                                    openLoginVersionModal({}, loginData);
                                }
                                }>
                                添加版本
                            </Button>
                        }
                        {
                            // 预留自定义搜索类型框,权限码未定
                            // (optsAuths.indexOf('') == -1) ? ''
                            //     : <Search
                            //     placeholder="自定义搜索"
                            //     style={{ width:210 }}
                            //     onSearch={value => updateLoginVersionSearch(value)}
                            // />
                        }
                    </Col>
                </Row>
                <Row span={24} className="table_canvas">

                    <Table
                        bordered
                        pagination={{
                            defaultPageSize: 20,
                            showSizeChanger:true,
                            showTotal : total => `总计 ${total} 条`
                        }}
                        loading={loginVersionList.loading}
                        columns={this.getColumns()}
                        dataSource={this.getDatas()}
                    />
                </Row>
                <LoginVersionModalContainer></LoginVersionModalContainer>

            </div>
        )
    }
}

export default loginVersionList;
