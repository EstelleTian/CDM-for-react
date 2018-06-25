import React from 'react'
import axios from 'axios'
import $ from 'jquery'
import {Row, Col, Button, Modal, Input} from 'antd'
import MultiFilter from '../multiFilter'
import {selectedUser} from "../onlineUser/index"
import { getOnlineUserListUrl, sendLogoutUrl, violationClientUrl } from '../../../utils/requestUrls'
import BtnContainer from "../../../container/btnContainer"
import './filterContent.less'

const Search = Input.Search;

class FilterContent extends React.Component{

    //刷新列表（查询会重置）
    retrieveUserList = () =>{
        const { updateOnlineUserList, updateMultiFilter, history, showBtnLoading } = this.props;
        const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
        //按钮loading 打开
        const opts = {
            isLoading: true,
            name: "refreshList"
        }
        showBtnLoading(opts);

        axios.get(getOnlineUserListUrl,{
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
            }else if(json.hasOwnProperty("warn")){
                updateOnlineUserList([], true);
            }else{
                const userList = json.onLineUserResultList || [];
                updateOnlineUserList(userList, false);
            }
                updateMultiFilter({});
                //按钮loading 关闭
                const opts = {
                    isLoading: false,
                    name: "refreshList"
                }
                showBtnLoading(opts);
        }).catch(err => {
            console.error(err);
        })

        // $.ajax({
        //     url: getOnlineUserListUrl,
        //     type: 'GET',
        //     dataType: 'json',
        //     beforeSend: function(request) {
        //         request.setRequestHeader("Authorization", UUMAToken);
        //     },
        //     success: function(json){
        //         if(json.hasOwnProperty("error") && json.status*1 == 400){
        //             Modal.error({
        //                 title: "登录失效，请重新登录!",
        //                 onOk(){
        //                     history.push('/');
        //                 }
        //             })
        //         }else if(json.hasOwnProperty("warn")){
        //             updateOnlineUserList({});
        //         }else{
        //             const userList = json.onLineUserResultList || [];
        //             updateOnlineUserList(userList);
        //         }
        //         updateMultiFilter({});
        //         $(".clear_btn").trigger('click');
        //     },
        //     error: function(err){
        //         console.error(err);
        //     }
        // })
    }

    multiLogoutModal = ( tokensStr, namesStr ) => {
        const { forceLogout } = this.props;
        Modal.confirm({
            title: '确定批量退出用户'+namesStr+'?',
            onOk(){
                const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
                axios.request({
                    url : sendLogoutUrl,
                    method: 'post',
                    params: { tokens : tokensStr },
                    headers: {
                        Authorization: UUMAToken,
                        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                    },
                    withCredentials: true
                }).then( response => {
                    const json = response.data;
                    const status = json.status*1 || 0;
                    if(json.hasOwnProperty("error")){
                        //错误消息
                        const msg = json.error.message || "";
                        let offOnlineList = json .offOnlineList || [];
                        let offStr = "失败用户：";
                        offOnlineList.map( item => {
                            if( subObj[item] ){
                                offStr += subObj[item] + "，";
                            }
                        })
                        offStr = offStr.substring( 0, offStr.length -1);

                        let onlineList = json .onlineList || [];
                        let onlineStr = "成功用户：";
                        onlineList.map( item => {
                            if( subObj[item] ){
                                onlineStr += subObj[item] + "，";
                            }
                        })
                        onlineStr = onlineStr.substring( 0, onlineStr.length -1);
                        Modal.warn({
                            title: "批量退出",
                            content:  onlineStr + ". " + offStr + ". "
                        })
                    }else if( status == 200 ){
                        Modal.success({
                            title: "批量退出用户"+namesStr+"成功"
                        })
                        forceLogout(tokensStr.split(','));
                    }
                }).catch(err => {
                    console.error(err);
                })

            }
        });
    }

    //检测在线用户---获取不符合要求的用户tokens集合
    violationClient = () =>{
        const { history, showBtnLoading, forceLogout} = this.props;
        const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
        //按钮loading 打开
        let opts = {
            isLoading: true,
            name: "violationClient"
        }
        showBtnLoading(opts);
        //请求接口
        axios.get(violationClientUrl,{
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
                const tokens = json.tokens || [];
                if(tokens.length > 0 ){
                    const tokens = json.tokens || [];
                    const tokensStr = tokens.join(',');
                    const username = json.username || [];
                    const namesStr = username.join(',');
                    //弹出提示框
                    this.multiLogoutModal( tokensStr, namesStr )
                }else {
                    Modal.warn({
                        title: '未检测到不符合要求的用户'
                    });
                }
            }
            //按钮loading 关闭
            opts.isLoading = false;
            showBtnLoading(opts);
        }).catch(err => {
            console.error(err);
        })
    }

    onClickMultiLogout = (e) => {
        const { forceLogout, userList, showBtnLoading } = this.props;

        let tokens = [];
        let names = [];
        let subObj = {};
        userList.map( user => {
            if(user.isActived){
                tokens.push(user.token);
                names.push(user.user.username);
                subObj[user.token] = user.user.username
            }
        })
        const tokensStr = tokens.join(',');
        const namesStr = names.join(',');
        if(tokensStr.length > 0){

            this.multiLogoutModal( tokensStr, namesStr )
            // Modal.confirm({
            //     title: '确定批量退出用户'+namesStr+'?',
            //     onOk(){
            //         const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
            //         axios.request({
            //             url : sendLogoutUrl,
            //             method: 'post',
            //             params: { tokens : tokensStr },
            //             headers: {
            //                 Authorization: UUMAToken,
            //                 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            //             },
            //             withCredentials: true
            //         }).then( response => {
            //             const json = response.data;
            //             const status = json.status*1 || 0;
            //             if(json.hasOwnProperty("error")){
            //                 //错误消息
            //                 const msg = json.error.message || "";
            //                 let offOnlineList = json .offOnlineList || [];
            //                 let offStr = "失败用户：";
            //                 offOnlineList.map( item => {
            //                     if( subObj[item] ){
            //                         offStr += subObj[item] + "，";
            //                     }
            //                 })
            //                 offStr = offStr.substring( 0, offStr.length -1);
            //
            //                 let onlineList = json .onlineList || [];
            //                 let onlineStr = "成功用户：";
            //                 onlineList.map( item => {
            //                     if( subObj[item] ){
            //                         onlineStr += subObj[item] + "，";
            //                     }
            //                 })
            //                 onlineStr = onlineStr.substring( 0, onlineStr.length -1);
            //                 Modal.warn({
            //                     title: "批量退出",
            //                     content:  onlineStr + ". " + offStr + ". "
            //                 })
            //             }else if( status == 200 ){
            //                 Modal.success({
            //                     title: "批量退出用户"+namesStr+"成功"
            //                 })
            //                 forceLogout(tokens);
            //             }
            //         }).catch(err => {
            //             console.error(err);
            //         })
            //
            //         // $.ajax({
            //         //     url: sendLogoutUrl,
            //         //     data: "tokens=" + tokensStr,
            //         //     type: 'post',
            //         //     dataType: 'json',
            //         //     beforeSend: function(request) {
            //         //         request.setRequestHeader("Authorization", UUMAToken);
            //         //     },
            //         //     success: function(json){
            //         //         const status = json.status*1 || 0;
            //         //         if(json.hasOwnProperty("error")){
            //         //             if( status == 500 ){
            //         //                 let msg = json.error.message || "";
            //         //                 const tokenArr = msg.split(",");
            //         //                 let invalidNames = [];
            //         //                 for(let i=0,len=tokenArr.length; i<len; i++){
            //         //                     const token = tokenArr[i];
            //         //                     const index = tokens.indexOf(token);
            //         //                     if(index > -1){
            //         //                         invalidNames.push(names[index]);
            //         //                     }
            //         //                 }
            //         //                 const invalidNamesStr = invalidNames.join(",");
            //         //                 Modal.warn({
            //         //                     title: "批量退出用户"+invalidNamesStr+"失败，因用户不存在。其余用户刷新成功！"
            //         //                 })
            //         //             }else if( status == 400 ){
            //         //                 Modal.error({
            //         //                     title: "登录失效，请重新登录!",
            //         //                     onOk(){
            //         //                         history.push('/');
            //         //                     }
            //         //                 })
            //         //             }
            //         //         }else if( status == 200 ){
            //         //             Modal.success({
            //         //                 title: "批量退出用户"+namesStr+"成功"
            //         //             })
            //         //             forceLogout(tokens);
            //         //         }
            //         //     },
            //         //     error: function(err){
            //         //         console.error(err);
            //         //     }
            //         // })
            //
            //     }
            // });
        }else{
            Modal.warn({
                title: '请选择要退出的用户?'
            });
        }
        e.stopPropagation();
        e.preventDefault();
    }

    render(){
        const { totalNum, filterList, filterKey, optsAuths} = this.props;
        let fKey = "自定义查询";
        if(filterKey && filterKey != "" && filterKey != "all"){
            fKey = filterKey;
        }
        return(
            <Row className="filter_container">
                {
                    (optsAuths.indexOf('31010102') == -1) ? ''
                        : <Col lg={4} md={4} sm={10} xs={24}>
                            <Search
                                className="us_search"
                                placeholder={fKey}
                                size="large"
                                onSearch={(inputVal) => {
                                    filterList(inputVal);
                                }}
                                onKeyUp={() => {
                                    const inputVal = $(".us_search>input").val();
                                    filterList(inputVal);
                                }}
                            />
                        </Col>
                }
                <Col lg={14} md={14} sm={24} xs={24} className="opt_btns">
                    {
                        (optsAuths.indexOf('31010105') == -1) ? ''
                            : <BtnContainer type="primary" onClick={this.onClickMultiLogout} name="multiLogout" text="批量退出" />

                    }
                    {
                        (optsAuths.indexOf('31010103') == -1) ? ''
                            : <BtnContainer type="primary" onClick={this.retrieveUserList} name="refreshList"  text="刷新列表" />

                    }
                    {
                        (optsAuths.indexOf('31010101') == -1) ? ''
                            : <MultiFilter {...this.props} />
                    }
                    {
                        (optsAuths.indexOf('31010106') == -1) ? ''
                            : <BtnContainer type="primary" onClick={this.violationClient} name="violationClient"  text="检测在线用户" />

                    }
                </Col>
                <Col lg={5} md={5} sm={24} xs={24} className="opt_user_num">
                    <span className="subtitle">总计</span>
                    <span className="number">{totalNum}</span>
                    <span className="subtitle">用户</span>
                </Col>
            </Row>
        )
    }
}

export default FilterContent;
