import axios from 'axios';
/*axios  get 请求
 * @param params 请求参数对象 Object
 * @param resFunc 成功后的回调函数
 */
const requestGet = ( url, params, resFunc ) => {
    axios.get( url, {
            params
        })
        .then( response => {
            const data = response.data;
            resFunc( data );
        })
        .catch( err => {
            console.error(err);
        })
};

const request = ( url, type, params, resFunc ) => {
    axios({
        method: type,
        url,
        params
    })
        .then( response => {
            const data = response.data;
            resFunc( data );
        })
        .catch( err => {
            console.error(err);
        })
};


export { requestGet, request };
