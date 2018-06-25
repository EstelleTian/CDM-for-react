import React from 'react'
import {Table, Button, Col, Row, Input, Popconfirm} from 'antd'
import { getGroupsListUrl, deleteGroupstUrl } from '../../../utils/requestUrls'
import GroupModalContainer from '../../../container/groupModalContainer'
import { sendGetListReq, sendDeleteOneReq } from "../../../utils/requests"
const Search = Input.Search
import '../../common/atable.less'

class groupsList extends React.Component{
    constructor(props){
        super(props);
        this.getColumns = this.getColumns.bind(this);
        this.getDatas = this.getDatas.bind(this);
        this.retrieveGroupList = this.retrieveGroupList.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
    }

    componentDidMount(){
        this.retrieveGroupList()
    }

    //获取组列表
    retrieveGroupList(){
        const { refreshGroups, history } = this.props;
        sendGetListReq(getGroupsListUrl, refreshGroups, "groupSet", history);
    }

    //删除请求
    sendDeleteAjax(id){
        const { delOneGroup } = this.props;
        sendDeleteOneReq(deleteGroupstUrl, delOneGroup, id);
    }

    //列配置
    getColumns(){
        const { optsAuths } = this.props;
        const columns = [
            {
                title: "序号",
                dataIndex: 'key',
                width: '7%',
                sorter: (a, b) => a.key - b.key,
            }, {
                title: "组名",
                dataIndex: 'name',
                sorter: (a, b) => {
                    var nameA = a.name.toUpperCase();
                    var nameB = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }else if (nameA > nameB) {
                        return 1;
                    }else{
                        return 0;
                    }
                }
            }, {
                title: "描述",
                dataIndex: 'description',
            },  {
                title: "操作",
                dataIndex: 'operators',
                width: '10%',
                render : ( text, record, index ) => (
                    <div className="table_opts">
                        {
                            (optsAuths.indexOf('31010541') == -1) ? ''
                                : <Button type="primary"
                                          shape="circle"
                                          icon="edit"
                                          title="修改"
                                          onClick={()=>{
                                              this.onClickEdit(record.orgData)
                                          }}
                                ></Button>
                        }
                        {
                            (optsAuths.indexOf('31010531') == -1) ? ''
                                : <Popconfirm title={`确定删除组${record.name}`} okText="确定" cancelText="取消"
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

    //表数据处理
    getDatas(){
        const { groupList } = this.props;
        let orgData = groupList.data;
        let tableData = [];
        //遍历组，补充key和操作列
        for(let n=0; n< orgData.length; n++){
            let oneRow = {
                ...orgData[n]
            };
            oneRow["key"] = n+1;
            oneRow["operators"] = "";
            oneRow["orgData"] = orgData[n];//原数据
            tableData.push(oneRow);
        }
        return tableData
    }

    //点击修改处理事件
    onClickEdit(orgData){
        //触发打开用户模块方法
        const { openGroupModal } = this.props;
        openGroupModal(orgData)
    }

    render(){
        const {  groupList, openGroupModal, updateGroupSearch, optsAuths, searchVal } = this.props;
        let fKey = "自定义搜索";
        if(searchVal && searchVal != ""){
            fKey = searchVal;
        }
        return(
            <div className="table_container">
                <Row span={24} className="table_nav">
                    <Col span={10}>
                        <span  className="table_title">组列表</span>
                    </Col>
                    <Col className="operators" span={14}>
                        {
                            (optsAuths.indexOf('31010521') == -1) ? ''
                                : <Button
                                    type="primary"
                                    onClick={() => {
                                        openGroupModal({})
                                    }
                                    }>
                                    添加组
                                </Button>
                        }
                        {
                            (optsAuths.indexOf('31010512') == -1) ? ''
                                : <Search
                                    placeholder={ fKey }
                                    style={{ width:210 }}
                                    onSearch={value => updateGroupSearch(value)}
                                />
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
                        loading={groupList.loading}
                        columns={this.getColumns()}
                        dataSource={this.getDatas()}
                    />
                </Row>
                <GroupModalContainer></GroupModalContainer>
            </div>
        )
    }
}

export default groupsList;
