import axios from 'axios';
//配置headers用于解决请求接口时不时failed情况
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.timeout = 30000;
/*axios  get 请求
 * @param params 请求参数对象 Object
 * @param resFunc 成功后的回调函数
 */
const requestGet = ( url, params, resFunc ) => {
    axios.get( url, {
            params,
            headers:{'Content-Type':'text/x-www-form-urlencoded'},
        })
        .then( response => {
            const data = response.data;
            resFunc( data );
        })
        .catch( err => {
            console.error(err);
        })
};


export { requestGet };
