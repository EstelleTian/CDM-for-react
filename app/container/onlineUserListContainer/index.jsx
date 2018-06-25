import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { forceLogout, updateOnlineUserList, selectedUser, toggleSlider, closeSlider, filterList,
    updateMultiFilter, closeInconformityModal, updateInconformityModal } from '../../actions/index'
import onlineUserList from '../../components/onlineUsers/onlineUserList'
const groupUserList = ( userArr ) => {
    if(userArr.length <=0) return[];
    //地区:用户数组
    let newUserList = {};
    userArr.map(item => {
        const user = item.user || {};
        //分组从region直接取值，不再截取了
        const region = user.region || "";
        //截取前四位为地区
        if( region != "" ){
            const groupName = region;
            if( newUserList[groupName] ){
                newUserList[groupName].push(item);
            }else{
                newUserList[groupName] = [];
                newUserList[groupName].push(item);
            }
        }
    })
    return newUserList;
}

const mapStateToProps = (state) => {
    const userList = state.onlineUserList;
    const filterKey = state.filterKey;
    let list = [];
    //用户是否包含查询关键字
    const mapUserList = (userObj, filterkey) => {
        let isShow = false;
        for(let item in userObj){
            if(item == "token"){
                continue;
            }
            let key = userObj[item];
            if(typeof key == 'object'){
                isShow = mapUserList(key ,filterkey);
            }else if(typeof key == 'string'){
                if(key.toLowerCase().indexOf(filterkey) > -1){
                    isShow = true;
                    break;
                }
            }
        }
        return isShow;
    }
    //若自定义查询不是'all',根据查询字查询
    if(filterKey != "all"){
        for(let index in userList){
            const userObj = userList[index];
            let isShow = mapUserList(userObj, filterKey.toLowerCase()+"");
            if(isShow){
                list.push(userObj);
            }
        }
    }else{
        //若自定义查询是'all' 显示全部
        list = userList
    }
    //在线用户总数
    const totalNum = list.length;
    //根据地区分组，转为{ZBBB:[]}格式
    const usersObj = groupUserList( list );
    return {
        usersObj: usersObj,
        totalNum: totalNum,
        sliderBar: state.sliderBar,
        multiFilterKey: state.multiFilterKey,
        optsAuths: state.login.optsAuths
    }
}

const mapDispatchToProps = {
    forceLogout,
    updateOnlineUserList,
    selectedUser,
    toggleSlider,
    closeSlider,
    filterList,
    updateMultiFilter
}

const OnlineUserListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(onlineUserList)

export default withRouter(OnlineUserListContainer)