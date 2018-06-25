import React from 'react'
import axios from 'axios'
import {Table, ICon, Button, Col, Row, Input, Modal } from 'antd'
import { getAllLoginCategoryUrl, getLoginVersionByCategoryIdUrl} from '../../../utils/requestUrls'
import LoginCategoryModalContainer from '../../../container/loginCategoryModalContainer'
import { sendGetListReq } from "../../../utils/requests"
const Search = Input.Search
import '../../common/atable.less'
import {updateLoginVersion} from "../../../actions/index";

class loginCategoryList extends React.Component{
    constructor(props){
        super(props);
        this.getColumns = this.getColumns.bind(this);
        this.getDatas = this.getDatas.bind(this);
        this.retrieveLoginCategoryList = this.retrieveLoginCategoryList.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
    }

    componentDidMount(){
        this.retrieveLoginCategoryList()
    }

    //获取登录控制类型列表
    retrieveLoginCategoryList(){
        const { refreshLoginCategory, history } = this.props;
        sendGetListReq(getAllLoginCategoryUrl, refreshLoginCategory, "loginCategories", history);
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
                title: "类型码",
                dataIndex: 'categoryCode',
                width: '10%',
                sorter: (a, b) => {
                    var nameA = a.categoryCode.toUpperCase();
                    var nameB = b.categoryCode.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }else if (nameA > nameB) {
                        return 1;
                    }else{
                        return 0;
                    }
                }
            }, {
                title: "类型描述",
                dataIndex: 'categoryDescription',
                width: '15%',
            }, {
                title: "发布者",
                dataIndex: 'publishUser',
                width: '10%',
            },{
                title: "发布者中文",
                dataIndex: 'publishUserZH',
                width: '10%'
            },{
                title: "操作",
                dataIndex: 'operators',
                width: '7%',
                render : ( text, record, index ) => (
                        <div className="table_opts">
                            {
                                (optsAuths.indexOf('31010711') == -1) ? ''
                                    : <Button type="primary"
                                              shape="circle"
                                              icon="edit"
                                              title="修改"
                                              onClick={()=>{
                                                  this.onClickEdit(record.loginCategory)
                                              }}
                                    ></Button>
                            }
                            {
                                (optsAuths.indexOf('31010711') == -1) ? ''
                                    : <Button type="default"
                                              shape="circle"
                                              icon="bars"
                                              title="查看版本"
                                              onClick={()=>{
                                                  this.onClickVersion(record.loginCategory)
                                              }}
                                ></Button>
                            }
                        </div>
                    )
            },
        ];
        return columns
    }

    //表格数据处理
    getDatas(){
        const { loginCategoryList } = this.props;
        let orgData = loginCategoryList.data;
        let tableData = [];
        //遍历用户，补充key和操作列
        for(let n=0; n< orgData.length; n++){
            const loginCategory = orgData[n];
            let oneRow = {};
            oneRow["key"] = n+1;
            oneRow["id"] = loginCategory.id;
            oneRow["categoryCode"] = loginCategory.categoryCode;
            oneRow["categoryDescription"] = loginCategory.categoryDescription;
            oneRow["version"] = loginCategory.version;
            oneRow["createTime"] = loginCategory.createTime;
            oneRow["updateTime"] = loginCategory.updateTime;
            oneRow["publishUser"] = loginCategory.publishUser;
            oneRow["publishUserZH"] = loginCategory.publishUserZH;
            oneRow["loginCategory"] = loginCategory;
            oneRow["operators"] = "";

            //添加一条数据
            tableData.push(oneRow);
        }
        return tableData
    }

    //点击修改处理事件
    onClickEdit(orgData){
        // 触发打开登录控制类型模块方法
        const { openLoginCategoryModal } = this.props;
        openLoginCategoryModal('update', orgData);
    }
    // 查询一个登录控制版本
    onClickVersion(orgData){
        const { openLoginCategoryModal, refreshLoginVersion, history } = this.props;
        const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
        //发送请求
        const id = orgData.id;
        if(!id){
            return;
        }
        let url = getLoginVersionByCategoryIdUrl + id;
        axios.get(url,{
            headers: {
                Authorization: UUMAToken
            },
            withCredentials: true
        }).then( response => {
            const json = response.data;
            if(json.hasOwnProperty("error") && json.status*1 == 400){
                Modal.error({
                    title: "登录失效，请重新登录!",
                    onOk(){
                        history.push('/');
                    }
                })
            }else{
                const loginVersionsData = json.loginVersions || [];
                refreshLoginVersion({
                    data: loginVersionsData,
                    isLoading: false
                });
                openLoginCategoryModal('showVersion', orgData);
            }
        }).catch(err => {
            console.error(err);
        })
    }

    render(){
        const {  loginCategoryList } = this.props;
        return(
            <div className="table_container">
                <Row span={24} className="table_nav">
                    <Col span={10}>
                        <span  className="table_title">登录控制类型列表</span>
                    </Col>
                    <Col className="operators" span={14}>
                        {   // 预留添加类型按钮,权限码未定
                            // (optsAuths.indexOf('') == -1) ? ''
                            //     : <Button
                            //     type="primary"
                            //     onClick={() => {
                            //         openLoginCategoryModal({})
                            //     }
                            //     }>
                            //     添加类型
                            // </Button>
                        }
                        {
                            // 预留自定义搜索类型框,权限码未定
                            // (optsAuths.indexOf('') == -1) ? ''
                            //     : <Search
                            //     placeholder="自定义搜索"
                            //     style={{ width:210 }}
                            //     onSearch={value => updateLoginCategorySearch(value)}
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
                        loading={loginCategoryList.loading}
                        columns={this.getColumns()}
                        dataSource={this.getDatas()}
                    />
                </Row>
                <LoginCategoryModalContainer></LoginCategoryModalContainer>
            </div>
        )
    }
}

export default loginCategoryList;
