import React from 'react'
import axios from 'axios'
import $ from 'jquery'
import { Row, Col, Modal, Badge} from 'antd'
import OnlineUser from "../onlineUser/index"
import SliderBar from '../sliderBar/index'
import { getOnlineUserListUrl, sendMultiFiltersUrl} from '../../../utils/requestUrls'
import FilterContainer from '../../../container/filterContainer/index'
import './onlineUserList.less'


class OnlineUserList extends React.Component{
    constructor(props){
        super(props);
        this.retrieveUserList = this.retrieveUserList.bind(this);
        this.timerId = "";
    }

    componentDidMount(){
        this.retrieveUserList();
    }

    componentWillUnmount(){
        clearTimeout(this.timerId);
    }

    //获取全部用户
    retrieveUserList(){
        //取用户token
        const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
        if(UUMAToken == ""){
            return;
        }
        const that = this;
        const { updateOnlineUserList, multiFilterKey, history } = this.props;

        //是否有多条件查询
        let hasMultiFilter = false;
        for(let key in multiFilterKey){
            if(multiFilterKey[key].trim() != ""){
                hasMultiFilter = true;
            }
        }
        let $usNoData = $(".us_no_datas");
        if( $usNoData.length != 0 ){
            $usNoData.html("用户查询中...");
        }
        //若有多条件查询，执行条件查询用户接口
        if(hasMultiFilter){
            axios.request({
                url: sendMultiFiltersUrl,
                method: 'post',
                params: multiFilterKey,
                headers: {
                    Authorization: UUMAToken,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                },
                withCredentials: true
            }).then( response => {
                const json = response.data;
                const status = json.status*1 || 0;
                if(200 == status){
                    if(json.hasOwnProperty("onLineUserResultList")){
                        const userList = json.onLineUserResultList || [];
                        updateOnlineUserList(userList, false);
                    }else if(json.hasOwnProperty("warn")){
                        const error = json.warn.message ? json.warn.message : "";
                        Modal.error({
                            title: "查询失败:" +error
                        })
                    }
                    //定时刷新用户列表
                    that.timerId = setTimeout(function(){
                        that.retrieveUserList();
                    }, 1000*30);
                }else if( 400 == status ){
                    Modal.error({
                        title: "登录失效，请重新登录!",
                        onOk(){
                            history.push('/');
                        }
                    })
                }else{
                    console.error("received data is invalida.");
                    console.error(json);
                    //定时刷新用户列表
                    that.timerId = setTimeout(function(){
                        that.retrieveUserList();
                    }, 1000*30);
                }
            }).catch(err => {
                console.error(err);
                //定时刷新用户列表
                that.timerId = setTimeout(function(){
                    that.retrieveUserList();
                }, 1000*30);
            })
        }else{//若没有多条件查询，执行查询全部在线用户接口
            axios.get(getOnlineUserListUrl,{
                headers: {
                    Authorization: UUMAToken
                },
                withCredentials: true
            }).then( response => {
                const json = response.data;
                const status = json.status*1;
                if( status == 200 ){
                    if(json.hasOwnProperty("warn")){
                        $usNoData.html("暂无数据");
                        updateOnlineUserList([], true);
                    }else{
                        const userList = json.onLineUserResultList || [];
                        if(userList.length == 0){
                            $usNoData.html("暂无数据");
                        }
                        updateOnlineUserList(userList, false);
                    }

                    //定时刷新用户列表
                    that.timerId = setTimeout(function(){
                        that.retrieveUserList();
                    }, 1000*30);
                }else if( json.hasOwnProperty("error") && status == 400 ){
                    Modal.error({
                        title: "登录失效，请重新登录!",
                        onOk(){
                            history.push('/');
                        }
                    })
                }else{
                    console.error("received data is invalida.");
                    console.error(json);
                    //定时刷新用户列表
                    that.timerId = setTimeout(function(){
                        that.retrieveUserList();
                    }, 1000*30);
                }
            }).catch(err => {
                console.error(err);
                //定时刷新用户列表
                that.timerId = setTimeout(function(){
                    that.retrieveUserList();
                }, 1000*30);
            })

        }
    }

    render(){
        const { forceLogout, selectedUser, toggleSlider, closeSlider, usersObj, sliderBar, history, totalNum, optsAuths } = this.props;
        const groupsArr = Object.keys(usersObj).sort();
        const visible = sliderBar.visible;
        return(
            <div className="us_cantainer">
                <FilterContainer totalNum={totalNum} ></FilterContainer>
                <Row className="no_margin">
                    {
                        groupsArr.length
                            ? groupsArr.map( group => (
                            <Col key={group} span={24}>
                                <Col span={24} className="group_name">
                                    <div>
                                        {group}
                                        <span className="count"><Badge count={usersObj[group].length} style={{ backgroundColor: '#63b5f1' }} /></span>
                                    </div>
                                </Col>
                                <Col span={24}>
                                    {
                                        usersObj[group].length
                                            ? usersObj[group].map(userobj => (
                                                    <Col key={userobj.token} xl={3} lg={5} md={6}>
                                                        <OnlineUser
                                                            userobj = {userobj}
                                                            forceLogout = {forceLogout}
                                                            selectedUser = {selectedUser}
                                                            toggleSlider = {toggleSlider}
                                                            history = {history}
                                                            optsAuths = {optsAuths}
                                                        ></OnlineUser>
                                                    </Col>
                                                )
                                            ) :<div className="us_no_datas">暂无用户数据</div>
                                    }
                                </Col>
                            </Col>
                            )
                        )  : <div className="us_no_datas">暂无数据</div>
                    }
                </Row>
                {
                    visible ? <SliderBar userObj = { sliderBar.userObj } closeSlider={closeSlider} />: ""
                }
            </div>

        )
    }
}

export default OnlineUserList;