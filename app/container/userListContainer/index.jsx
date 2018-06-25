import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { refreshUsers, updateUsers, refreshRoles, refreshGroups, delOneUser, openUserModal, setRoleDefaultData, setGroupDefaultData, updateUserSearch } from "../../actions"
import usersList from '../../components/users/usersList'


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
    const searchVal = state.userSearchValue.toLowerCase() || "";
    //若搜索值是空，不变
    if("" == searchVal){
        return {
            userList: state.userList,
            roleList: state.roleList,
            groupList: state.groupList,
            optsAuths: state.login.optsAuths,
            searchVal: state.userSearchValue
        }
    }else{
        //过滤组列数据
        const listData = state.userList.data || [];
        let newDataArr = [];
        listData.map( item => {
            let flag = filterList(item, searchVal);
            if(flag){
                newDataArr.push(item);
            }
        });
        return {
            userList: {
                ...state.userList,
                data: newDataArr
            },
            roleList: state.roleList,
            groupList: state.groupList,
            optsAuths: state.login.optsAuths,
            searchVal: state.userSearchValue
        }
    }
};

const mapDispatchToProps = {
    refreshUsers,
    refreshRoles,
    refreshGroups,
    updateUsers,
    delOneUser,
    openUserModal,
    setRoleDefaultData,
    setGroupDefaultData,
    updateUserSearch
}

const UserListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(usersList);

export default withRouter(UserListContainer)