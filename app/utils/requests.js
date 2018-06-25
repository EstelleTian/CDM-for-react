import axios from 'axios'
import {Modal} from 'antd'

//用户、角色、权限、组 获取列表请求
export const sendGetListReq = ( url, resFunc, dataKey, history ) => {
    //取用户token
    const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
    axios.get(url,{
        headers: {
            Authorization: UUMAToken
        },
        withCredentials: true
    }).then( response => {
        const json = response.data;
        const status = json.status*1 || 0;
        if(200 == status && json.hasOwnProperty(dataKey)){
            const data = json[dataKey] || [];
            const params = {
                data: data,
                loading: false
            }
            resFunc(params);
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
        }
    }).catch(err => {
        console.error(err);
    })
}

//用户、角色、权限、组 删除请求
export const sendDeleteOneReq = ( url, resFunc, id ) => {
    //取用户token
    const UUMAToken = sessionStorage.getItem("UUMAToken") || "";
    axios.delete(url + id, {
        headers: {
            Authorization: UUMAToken
        },
        withCredentials: true
    }).then( response => {
        const json = response.data;
        const status = json.status*1 || 0;
        if(200 == status){
            resFunc(id);
        }else if( 500 == status && json.hasOwnProperty("error")  ){
            const error = json.error.message ? json.error.message : "";
            Modal.error({
                title: "失败",
                content: error,
                okText: "确定"
            })
        }else{
            console.error("received data is invalida.");
            console.error(json);
        }
    }).catch(err => {
        console.error(err);
    })
}