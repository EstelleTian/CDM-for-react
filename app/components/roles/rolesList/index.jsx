import React from 'react'
import {Table, ICon, Button, Col, Row, Input, Popconfirm} from 'antd'
import { getRolesListUrl, getAuthoritiesListUrl, deleteRolesUrl } from '../../../utils/requestUrls'
import RoleModalContainer from '../../../container/roleModalContainer'
import { sendGetListReq, sendDeleteOneReq } from "../../../utils/requests"
const Search = Input.Search
import '../../common/atable.less'

class rolesList extends React.Component{
    constructor(props){
        super(props);
        this.getColumns = this.getColumns.bind(this);
        this.getDatas = this.getDatas.bind(this);
        this.retrieveRoleList = this.retrieveRoleList.bind(this);
        this.retrieveAuthoritiesList = this.retrieveAuthoritiesList.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
    }

    componentDidMount(){
        this.retrieveRoleList()
        //检测权限数据是否有，若没有，手动提前获取
        const { authoritiesList } = this.props;
        if( authoritiesList.data.length == 0 ){
            this.retrieveAuthoritiesList();
        }

    }

    //获取角色列表
    retrieveRoleList(){
        const { refreshRoles, history } = this.props;
        sendGetListReq(getRolesListUrl, refreshRoles, "roleSet", history);
    }

    //获取权限列表
    retrieveAuthoritiesList(){
        const { refreshAuths, history } = this.props;
        sendGetListReq(getAuthoritiesListUrl, refreshAuths, "authoritySet", history);

    }

    //删除请求
    sendDeleteAjax(id){
        const { delOneRole } = this.props;
        sendDeleteOneReq(deleteRolesUrl, delOneRole, id);
    }

    //列配置
    getColumns(){
        const { optsAuths } = this.props;
        const columns = [
            {
                title: "序号",
                dataIndex: 'key',
                width: '5%',
                sorter: (a, b) => a.key - b.key,
            }, {
                title: "角色名",
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
                dataIndex: 'description'
            },
            // {
            //     title: "权限",
            //     dataIndex: 'authstr',
            //     render: (text) => (
            //         <span className="auth_content">{text}</span>
            //     )
            // },
            {
                title: "操作",
                dataIndex: 'operators',
                width: '10%',
                render : ( text, record, index ) => (
                    <div className="table_opts">
                        {
                            (optsAuths.indexOf('31010341') == -1) ? ''
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
                            (optsAuths.indexOf('31010331') == -1) ? ''
                                : <Popconfirm title={`确定删除角色${record.name}`} okText="确定" cancelText="取消"
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

    //
    getDatas(){
        const { roleList } = this.props;
        let orgData = roleList.data;
        let tableData = [];
        //遍历角色，补充key和操作列
        for(let n=0; n< orgData.length; n++){
            const role = orgData[n];
            let oneRow = {};
            oneRow["key"] = n+1;
            oneRow["id"] = role.id;
            oneRow["name"] = role.name;
            oneRow["description"] = role.description;
            oneRow["operators"] = "";
            oneRow["orgData"] = orgData[n];//原数据
            // //处理权限字段
            // const authorities = role.authorities;
            // let authstr = "";
            // //过滤权限，提取权限描述字段拼接
            // authorities.forEach( auth => {
            //     authstr += auth.description+","
            // })
            // //截取尾巴,
            // oneRow["authstr"] = authstr.substring(0, authstr.length-1);
            tableData.push(oneRow);
        }
        return tableData
    }

    //点击修改处理事件
    onClickEdit(orgData){
        //触发打开用户模块方法
        const { openRoleModal, setDefaultData } = this.props;

        const authorities = orgData.authorities;
        let authIdstr = "";
        //过滤权限，提取权限描述字段拼接
        authorities.forEach( auth => {
            authIdstr += auth.id+","
        })
        //截取尾巴,
        authIdstr = authIdstr.substring(0, authIdstr.length-1);

        //设置checkbox默认值
        setDefaultData(authIdstr)
        //打开模态框
        openRoleModal(orgData)
    }


    render(){
        const {  roleList, openRoleModal, updateRoleSearch, optsAuths, searchVal } = this.props;
        let fKey = "自定义搜索";
        if(searchVal && searchVal != ""){
            fKey = searchVal;
        }
        return(
            <div className="table_container">
                <Row type="flex" span={24} className="table_nav">
                    <Col span={10}>
                        <span  className="table_title">角色列表</span>
                    </Col>
                    <Col className="operators" span={14}>
                        {
                            (optsAuths.indexOf('31010321') == -1) ? ''
                                : <Button
                                    type="primary"
                                    onClick={() => {
                                        //打开模态框
                                        openRoleModal({})
                                    }
                                    }>
                                    添加角色
                                </Button>
                        }
                        {
                            (optsAuths.indexOf('31010312') == -1) ? ''
                                :  <Search
                                    placeholder={ fKey }
                                    style={{ width:210 }}
                                    onSearch={value => updateRoleSearch(value)}
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
                        loading={roleList.loading}
                        columns={this.getColumns()}
                        dataSource={this.getDatas()}
                    />
                </Row>

                <RoleModalContainer></RoleModalContainer>
            </div>
        )
    }
}

export default rolesList;
