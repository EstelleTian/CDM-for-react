import React from 'react'
import {Table, ICon, Button, Col, Row, Input, Popconfirm} from 'antd'
import { getAuthoritiesListUrl, deleteAuthoritiesUrl } from '../../../utils/requestUrls'
import AuthoritiesModalContainer from '../../../container/authoritiesModalContainer'
import { sendGetListReq, sendDeleteOneReq } from "../../../utils/requests"
const Search = Input.Search
import '../../common/atable.less'

class authoritiesList extends React.Component{
    constructor(props){
        super(props);
        this.getColumns = this.getColumns.bind(this);
        this.getDatas = this.getDatas.bind(this);
        this.retrieveAuthoritiesList = this.retrieveAuthoritiesList.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
    }

    componentDidMount(){
        this.retrieveAuthoritiesList()
    }

    //获取权限列表
    retrieveAuthoritiesList(){
        const { refreshAuths, history } = this.props;
        sendGetListReq(getAuthoritiesListUrl, refreshAuths, "authoritySet", history);
    }

    //删除请求
    sendDeleteAjax(id){
        const { delOneAuth } = this.props;
        sendDeleteOneReq(deleteAuthoritiesUrl, delOneAuth, id);
    }

    //列配置
    getColumns(){
        const columns = [
             {
                title: "序号",
                dataIndex: 'key',
                width: '7%',
                sorter: (a, b) => a.key - b.key,
            },{
                title: "权限码",
                dataIndex: 'code',
                sorter: (a, b) => (a.code*1) - (b.code*1),
            },{
                title: "权限名",
                dataIndex: 'name',
            },{
                title: "描述",
                dataIndex: 'description',
            },
            // {
            //     title: "操作",
            //     dataIndex: 'operators',
            //     width: '10%',
            //     render : ( text, record, index ) => (
            //         <div className="table_opts">
            //             {/*<Button type="primary"*/}
            //                     {/*shape="circle"*/}
            //                     {/*icon="edit"*/}
            //                     {/*title="修改"*/}
            //                     {/*onClick={()=>{*/}
            //                         {/*this.onClickEdit(record.orgData)*/}
            //                     {/*}}*/}
            //             {/*></Button>*/}
            //             {/*<Popconfirm title={`确定删除权限码:${record.code}`} okText="确定" cancelText="取消"*/}
            //                         {/*onConfirm={ () => {*/}
            //                             {/*this.sendDeleteAjax(record.id)*/}
            //                         {/*}}*/}
            //             {/*>*/}
            //                 {/*<Button type="default"*/}
            //                         {/*shape="circle"*/}
            //                         {/*icon="delete"*/}
            //                         {/*title="删除"*/}
            //                 {/*></Button>*/}
            //             {/*</Popconfirm>*/}
            //         </div>
            //     )
            // },
        ];
        return columns
    }

    //表数据处理
    getDatas(){
        const { authoritiesList } = this.props;
        let orgData = authoritiesList.data;
        let tableData = [];
        //遍历权限，补充key和操作列
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
        const { openAuthModal } = this.props;
        openAuthModal(orgData)
    }

    render(){
        const {  authoritiesList, openAuthModal, updateAuthSearch, optsAuths, searchVal } = this.props;
        let fKey = "自定义搜索";
        if(searchVal && searchVal != ""){
            fKey = searchVal;
        }
        return(
            <div className="table_container">
                <Row span={24} className="table_nav">
                    <Col span={10}>
                        <span  className="table_title">权限列表</span>
                    </Col>
                    <Col className="operators" span={14}>
                        {
                            (optsAuths.indexOf('31010421') == -1) ? ''
                                : <Button
                                    type="primary"
                                    onClick={() => {
                                        openAuthModal({})
                                    }
                                    }>
                                    添加权限
                                </Button>
                        }
                        {
                            (optsAuths.indexOf('31010412') == -1) ? ''
                                : <Search
                                    placeholder={ fKey }
                                    style={{ width:210 }}
                                    onSearch={value => updateAuthSearch(value)}
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
                        loading={authoritiesList.loading}
                        columns={this.getColumns()}
                        dataSource={this.getDatas()}
                    />
                </Row>

                <AuthoritiesModalContainer></AuthoritiesModalContainer>
            </div>
        )
    }
}

export default authoritiesList;
