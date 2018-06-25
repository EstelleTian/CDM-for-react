import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { refreshRoles, updateRoles, delOneRole, openRoleModal, refreshAuths, setDefaultData, updateRoleSearch } from "../../actions"
import rolesList from '../../components/roles/rolesList'


const mapStateToProps = (state) => {
    const searchVal = state.roleSearchValue.toLowerCase() || "";
    //若搜索值是空，不变
    if("" == searchVal){
        return {
            roleList: state.roleList,
            authoritiesList: state.authoritiesList,
            optsAuths: state.login.optsAuths,
            searchVal: state.roleSearchValue
        }
    }else{
        //过滤组列数据
        const listData = state.roleList.data || [];
        let newDataArr = [];
        listData.map( item => {
            let flag = false;
            //遍历每个值的具体值
            for(let key in item){
                //命中
                const value= item[key];
                const lowerCaseVal = (value + "").toLowerCase();
                if( lowerCaseVal.indexOf(searchVal) > -1){
                    flag = true;
                    break;
                }
            }
            if(flag){
                newDataArr.push(item);
            }
        });
        return {
            roleList: {
                ...state.roleList,
                data: newDataArr
            },
            authoritiesList: state.authoritiesList,
            optsAuths: state.login.optsAuths,
            searchVal: state.roleSearchValue
        }
    }
};

const mapDispatchToProps = {
    refreshRoles,
    updateRoles,
    delOneRole,
    openRoleModal,
    refreshAuths,
    setDefaultData,
    updateRoleSearch
}

const RoleListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(rolesList);

export default withRouter(RoleListContainer)