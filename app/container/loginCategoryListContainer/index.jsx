import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { refreshLoginCategory, updateLoginCategory, openLoginCategoryModal, refreshLoginVersion } from "../../actions"

import loginCategoryList from '../../components/loginCategory/loginCategoryList'
const filterList = (item, searchVal) => {
    let flag = false;
    //遍历每个值的具体值
    for(let key in item){
        //命中
        const value= item[key];
        //若是对象，重复
        if(typeof value == 'object'){
            flag = filterList(value, searchVal)
        }
        if(flag){
            break;
        }
        const lowerCaseVal = (value + "").toLowerCase();
        if( lowerCaseVal.indexOf(searchVal) > -1){
            flag = true;
            break;
        }
    }
    return flag;
}

const mapStateToProps = (state) => {
    const searchVal = state.loginCategorySearchValue.toLowerCase() || "";
    //若搜索值是空，不变
    if("" == searchVal){
        return {
            loginCategoryList: state.loginCategoryList,

            optsAuths: state.login.optsAuths,
            viewLayer: state.viewLayer,
        }
    }else{
        //过滤组列数据
        const listData = state.loginCategoryList.data || [];
        let newDataArr = [];
        listData.map( item => {
            let flag = filterList(item, searchVal);
            if(flag){
                newDataArr.push(item);
            }
        });
        return {
            loginCategoryList: {
                ...state.loginCategoryList,
                data: newDataArr
            },
            optsAuths: state.login.optsAuths
        }
    }
};

const mapDispatchToProps = {
    refreshLoginCategory,
    updateLoginCategory,
    openLoginCategoryModal,
    refreshLoginVersion

}

const LoginCategoryListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(loginCategoryList);

export default withRouter(LoginCategoryListContainer)