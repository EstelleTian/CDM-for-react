import React from 'react'
import {Table, ICon, Button, Col, Row, Input, Popconfirm} from 'antd'
import { getUsersListUrl, getRolesListUrl, getGroupsListUrl, deleteUsesrUrl } from '../../../utils/requestUrls'
import UserModalContainer from '../../../container/userModalContainer'
import { sendGetListReq, sendDeleteOneReq } from "../../../utils/requests"
const Search = Input.Search
import '../../common/atable.less'

class rolesList extends React.Component{
    constructor(props){
        super(props);
        this.getColumns = this.getColumns.bind(this);
        this.getDatas = this.getDatas.bind(this);
        this.retrieveUserList = this.retrieveUserList.bind(this);
        this.retrieveRoleList = this.retrieveRoleList.bind(this);
        this.retrieveGroupList = this.retrieveGroupList.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
    }

    componentDidMount(){
        this.retrieveUserList()
        //检测角色、组数据是否有，若没有，手动提前获取
        const { roleList, groupList } = this.props;
        if( roleList.data.length == 0 ){
            this.retrieveRoleList();
        }
        if( groupList.data.length == 0 ){
            this.retrieveGroupList();
        }
    }

    //获取用户列表
    retrieveUserList(){
        const { refreshUsers, history } = this.props;
        sendGetListReq(getUsersListUrl, refreshUsers, "userSet", history);
    }

    //获取角色列表
    retrieveRoleList(){
        const { refreshRoles, history } = this.props;
        sendGetListReq(getRolesListUrl, refreshRoles, "roleSet", history);
    }

    //获取组列表
    retrieveGroupList(){
        const { refreshGroups, history } = this.props;
        sendGetListReq(getGroupsListUrl, refreshGroups, "groupSet", history);
    }

    //删除请求
    sendDeleteAjax(id){
        const { delOneUser } = this.props;
        sendDeleteOneReq(deleteUsesrUrl, delOneUser, id);
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
            },{
                title: "用户名",
                dataIndex: 'username',
                width: '10%',
                sorter: (a, b) => {
                    var nameA = a.username.toUpperCase();
                    var nameB = b.username.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }else if (nameA > nameB) {
                        return 1;
                    }else{
                        return 0;
                    }
                }
            }, {
                title: "中文描述",
                dataIndex: 'descriptionCN',
                width: '15%',
            }, {
                title: "英文描述",
                dataIndex: 'descriptionEN',
                width: '15%',
            },{
                title: "部门/组",
                dataIndex: 'groupstr',
                width: '15%',
                render: (text) => (
                    <span className="auth_content">{text}</span>
                )
            }, {
                title: "角色",
                dataIndex: 'rolestr',
                render: (text) => (
                    <span className="auth_content">{text}</span>
                )
            }, {
                title: "操作",
                dataIndex: 'operators',
                width: '10%',
                render : ( text, record, index ) => (
                        <div className="table_opts">
                            {
                                (optsAuths.indexOf('31010241') == -1) ? ''
                                    : <Button type="primary"
                                              shape="circle"
                                              icon="edit"
                                              title="修改"
                                              onClick={()=>{
                                                  this.onClickEdit(record.user)
                                              }}
                                    ></Button>
                            }
                            {
                                (optsAuths.indexOf('31010231') == -1) ? ''
                                    : <Popconfirm title={`确定删除用户：${record.username}`} okText="确定" cancelText="取消"
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
        const { userList } = this.props;
        let orgData = userList.data;
        let tableData = [];
        //遍历用户，补充key和操作列
        for(let n=0; n< orgData.length; n++){
            const user = orgData[n];
            let oneRow = {};
            oneRow["key"] = n+1;
            oneRow["id"] = user.id;
            oneRow["username"] = user.username;
            oneRow["descriptionCN"] = user.descriptionCN;
            oneRow["descriptionEN"] = user.descriptionEN;
            oneRow["user"] = user;
            oneRow["operators"] = "";
            //处理组字段
            const groups = user.groups;
            let groupstr = "";
            //过滤组，提取组描述字段拼接
            groups.forEach( g => {
                groupstr += g.description+"，"
            })
            //截取尾巴,
            oneRow["groupstr"] = groupstr.substring(0, groupstr.length-1);
            //处理用户字段
            const roles = user.roles;
            let rolestr = "";
            //过滤用户，提取用户描述字段拼接
            roles.forEach( r => {
                rolestr += r.description+"，"
            })
            //截取尾巴,
            oneRow["rolestr"] = rolestr.substring(0, rolestr.length-1);
            //添加一条数据
            tableData.push(oneRow);
        }
        return tableData
    }

    //点击修改处理事件
    onClickEdit(orgData){
        //根据ID获取用户信息

        //触发打开用户模块方法
        const { openUserModal, setRoleDefaultData, setGroupDefaultData, updateUserSearch } = this.props;
        const roles = orgData.roles;
        let rolesIdstr = "";
        //过滤权限，提取权限描述字段拼接
        roles.forEach( role => {
            rolesIdstr += role.id+","
        })
        //截取尾巴,
        rolesIdstr = rolesIdstr.substring(0, rolesIdstr.length-1);
        //设置checkbox默认值
        setRoleDefaultData(rolesIdstr)

        const groups = orgData.groups;
        let groupIdstr = "";
        //过滤权限，提取权限描述字段拼接
        groups.forEach( group => {
            groupIdstr += group.id+","
        })
        //截取尾巴,
        groupIdstr = groupIdstr.substring(0, groupIdstr.length-1);

        setGroupDefaultData(groupIdstr);
        openUserModal(orgData)
    }

    render(){
        const {  userList, openUserModal, updateUserSearch, optsAuths, searchVal } = this.props;
        let fKey = "自定义搜索";
        if(searchVal && searchVal != ""){
            fKey = searchVal;
        }
        return(
            <div className="table_container">
                <Row span={24} className="table_nav">
                    <Col span={10}>
                        <span  className="table_title">用户列表</span>
                    </Col>
                    <Col className="operators" span={14}>
                        {
                            (optsAuths.indexOf('31010221') == -1) ? ''
                                : <Button
                                    type="primary"
                                    onClick={() => {
                                        openUserModal({})
                                    }
                                    }>
                                    添加用户
                                </Button>
                        }
                        {
                            (optsAuths.indexOf('31010212') == -1) ? ''
                                : <Search
                                    placeholder={ fKey }
                                    style={{ width:210 }}
                                    onSearch={value => updateUserSearch(value)}
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
                        loading={userList.loading}
                        columns={this.getColumns()}
                        dataSource={this.getDatas()}
                    />
                </Row>

                <UserModalContainer></UserModalContainer>
            </div>
        )
    }
}

export default rolesList;
