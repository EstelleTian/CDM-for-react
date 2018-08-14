import axios from 'axios';
/*axios  get 请求
 * @param params 请求参数对象 Object
 * @param resFunc 成功后的回调函数
 */
const requestGet = ( url, params, resFunc ) => {
    axios.get( url, {
            params
        }).then( response => {
            const data = response.data;
            resFunc( data );
        }).catch( err => {
            console.error(err);
        })
};

/*axios  get 请求
 * @param url 请求url
 * @param type 请求类型  POST PUT DELETE
 * @param params 请求参数对象 Object
 * @param resFunc 成功后的回调函数
 *
 */
const request = ( url, type, params, resFunc, errFunc ) => {
    axios({
        method: type,
        url,
        data: params,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    }).then( response => {
        const data = response.data;
        resFunc( data );
    }).catch( err => {
        if( typeof errFunc == 'function'){
            errFunc( err );
        }
        console.error(err);
    })
};


export { requestGet, request };
