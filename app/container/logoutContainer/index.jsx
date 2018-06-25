import React from 'react'
import $ from 'jquery'
import { Icon, Modal } from 'antd'
import { browserHistory, hashHistory } from 'react-router'
import { connect } from 'react-redux'
import { userLogin } from '../../actions/index'
import { logoutUrl } from '../../utils/requestUrls'

const Logout = ( props ) => {
    const clickLogout = () => {
        const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
        $.ajax({
            url: logoutUrl,
            data: "token=" + UUMAToken,
            type: 'get',
            dataType: 'json',
            success: function(json){
                const status = json.status;
                if( 200 == status ){
                    this.props.userLogin();
                    browserHistory.push('/');
                }else if( 500 == status && json.hasOwnProperty("error")  ){
                    const error = json.error.message ? json.error.message : "";
                    if(error.indexOf("USER IS NOT EXIST") > -1){
                        Modal.error({
                            title: '登出失败：用户名不存在'
                        });
                    }
                    switch(error){
                        case "USER IS NOT EXIST":
                            errmsg = "用户名不存在";

                            break;
                    }

                }
            },
            error: function(err){
                console.error(err);
            }
        })
    }
    return(
        <div onClick={clickLogout}><Icon type="logout" />登出</div>
    )
}

const mapStateToProps = ( state ) => ({
    login : state.login
})

const mapDispatchToProps =  {
    userLogin
}

const LogoutContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Logout);

export default LogoutContainer;