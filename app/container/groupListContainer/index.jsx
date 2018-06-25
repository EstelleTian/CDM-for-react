import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { refreshGroups, updateGroups, delOneGroup, openGroupModal, updateGroupSearch } from "../../actions"
import groupsList from '../../components/groups/groupsList'


const mapStateToProps = (state) => {
    const searchVal = state.groupSearchValue.toLowerCase() || "";
    //若搜索值是空，不变
    if("" == searchVal){
        return {
            groupList: state.groupList,
            optsAuths: state.login.optsAuths,
            searchVal: state.groupSearchValue
        }
    }else{
        //过滤组列数据
        const listData = state.groupList.data || [];
        let newDataArr = [];
        listData.map( item => {
            let flag = false;
            //遍历每个值的具体值
            for(let key in item){
                //中
                const lowerCaseVal = (item[key]+"").toLowerCase();
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
            groupList: {
                ...state.groupList,
                data: newDataArr
            },
            optsAuths: state.login.optsAuths,
            searchVal: state.groupSearchValue
        }
    }
};

const mapDispatchToProps = {
    refreshGroups,
    updateGroups,
    delOneGroup,
    openGroupModal,
    updateGroupSearch
}

const GroupListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(groupsList);

export default withRouter(GroupListContainer)