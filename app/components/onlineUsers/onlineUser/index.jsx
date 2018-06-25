import React from 'react'
import { Icon, Row, Col, Modal, Checkbox} from 'antd'
import { sendLogoutUrl, getOnlineUserByTokenUrl, parseHalfFullTime } from '../../../utils/requestUrls'
import $ from 'jquery'
import axios from 'axios'
import "./onlineUser.less"

const OnlineUser = ({ userobj, forceLogout, selectedUser, toggleSlider, history, optsAuths}) => {
    history = history;
    const onClickLogout = (e) => {
        const token = userobj.token;
        const username = userobj.user.username;
        Modal.confirm({
            title: '确定强制退出用户'+username+'?',
            onOk(){
                sendLogout(token, username);
            }
        });
        e.stopPropagation();
        e.preventDefault();
    }

    const sendLogout = (token, username) => {
        const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
        axios.request({
            url : sendLogoutUrl,
            method: 'post',
            params: { tokens:token },
            headers: {
                Authorization: UUMAToken
            },
            withCredentials: true
        }).then( response => {
            const json = response.data;
            const status = json.status*1 || 0;
            if(json.hasOwnProperty("error")){
                const err = json.error.message ? json.error.message : "";
                Modal.error({
                    title: "退出失败，" + err
                })
            }else if( status == 200 ){
                Modal.success({
                    title: "用户"+username+"退出成功!"
                })
                forceLogout(token);
            }
        }).catch(err => {
            console.error(err);
        })

        // $.ajax({
        //     url: sendLogoutUrl,
        //     data: "tokens=" + token,
        //     type: 'post',
        //     dataType: 'json',
        //     beforeSend: function(request) {
        //         request.setRequestHeader("Authorization", UUMAToken);
        //     },
        //     success: function(json){
        //         const status = json.status*1 || 0;
        //         if(json.hasOwnProperty("error")){
        //             if( status == 500 ){
        //                 Modal.error({
        //                     title: "退出失败，用户"+username+"不存在!"
        //                 })
        //             }else if( status == 400 ){
        //                 Modal.error({
        //                     title: "登录失效，请重新登录!",
        //                     onOk(){
        //                         history.push('/');
        //                     }
        //                 })
        //             }
        //         }else if( status == 200 ){
        //             Modal.success({
        //                 title: "用户"+username+"退出成功!"
        //             })
        //             forceLogout(token);
        //         }
        //
        //     },
        //     error: function(err){
        //         console.error(err);
        //     }
        // })

    }

    const toggleUserInfo = (token) => {
        const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
        let url = getOnlineUserByTokenUrl;
        axios.get(url,{
            headers: {
                Authorization: UUMAToken
            },
            params: {token: token},
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
                Modal.error({
                    title: "获取用户信息失败，用户不存在!"
                })
            }else{
                toggleSlider(json);
            }
        }).catch(err => {
            console.error(err);
        })

        // $.ajax({
        //     url: url,
        //     type: 'get',
        //     data: "token="+token,
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
        //             Modal.error({
        //                 title: "获取用户信息失败，用户不存在!"
        //             })
        //         }else{
        //             toggleSlider(json);
        //         }
        //     },
        //     error: function(err){
        //         console.error(err);
        //     }
        // })

    }

    const ipAddress = userobj.ipAddress || "N/A";
    const loginTime = parseHalfFullTime(userobj.loginTime || "") || "N/A";
    const finalRefreshTime = parseHalfFullTime(userobj.finalRefreshTime || "") || "N/A";
    const clientVersion = (userobj.clientVersion && userobj.clientVersion != "null") ? userobj.clientVersion  : "N/A";

    return(
        <Row className="us_user" onClick={e=>{
            toggleUserInfo(userobj.token);
            e.preventDefault();
            e.stopPropagation();
        }}>
            <Col span={24}>
                <Col span={6} offset={2}>
                    <Icon className={userobj.online ? "us_user_icon online" : "us_user_icon offline"} type='user' />
                </Col>
                <Col span={13}>
                    <div className="us_user_name" title={userobj.user.username || "N/A"}>{userobj.user.username || "N/A"}</div>
                </Col>
                {
                    (optsAuths.indexOf('31010105') == -1) ? ''
                        : <Col span={1}>
                            <Checkbox
                                className="user_checkbox"
                                checked = { userobj.isActived }
                                onClick = {e => {
                                    selectedUser(userobj.token);
                                    e.stopPropagation()
                                }}
                            />

                        </Col>
                }

            </Col>
            <Col span={24}>
                <Col span={11} offset={2}>
                    IP地址：
                </Col>
                <Col span={11} className="text_ellipsis" title={ipAddress}>
                    {ipAddress}
                </Col>
            </Col>
            <Col span={24}>
                <Col span={11} offset={2}>
                    客户端版本：
                </Col>
                <Col span={11} title={clientVersion}>
                    {clientVersion}
                </Col>
            </Col>
            <Col span={24}>
                <Col span={11} offset={2}>
                    登录时间：
                </Col>
                <Col span={11} title={loginTime}>
                    <span className="us_user_loginTime">{loginTime}</span>
                </Col>
            </Col>
            <Col span={24}>
                <Col span={11} offset={2}>
                    最后刷新时间：
                </Col>
                <Col span={11} title={finalRefreshTime}>
                    <span className="us_user_loginTime">{finalRefreshTime}</span>
                </Col>
            </Col>
            {
                (optsAuths.indexOf('31010104') == -1) ? ''
                    : <Col span={24}>
                        <div className="us_user_options">
                <span onClick = {onClickLogout} >
                    <Icon type="logout" />
                    退出
                </span>
                        </div>
                    </Col>
            }


        </Row>
    )
}


export default OnlineUser;