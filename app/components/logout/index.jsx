import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Icon, Modal } from 'antd'
import { logoutUrl } from '../../utils/requestUrls'

const Logout = ( props ) => {
    const clickLogout = () => {
        Modal.confirm({
            title: '确定退出登录?',
            onOk(){
                const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
                axios.get(logoutUrl, {
                    headers: {
                        Authorization: UUMAToken
                    },
                    params: {
                        token: UUMAToken
                    },
                    withCredentials: true
                }).then( response => {
                    const json = response.data;
                    const status = json.status;
                    if( 200 == status ){
                        //清缓存
                        sessionStorage.clear()
                        //路由跳转
                        props.history.push('/')
                    }else if( 500 == status && json.hasOwnProperty("error")  ){
                        const error = json.error.message ? json.error.message : "";
                        Modal.error({
                            title: error
                        });
                    }
                }).catch(err => {
                    console.error(err);
                })
            }
        });
    }
    return(
        <div onClick={clickLogout}><Icon type="logout" />登出</div>
    )
}
export default withRouter(Logout)