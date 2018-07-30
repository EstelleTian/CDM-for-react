import { combineReducers } from 'redux';
import { filterMatches } from "../layouts/NavMenuRedux"
import { loginUserInfo, systemConfig, flowcontrolParams } from "../views/LoginRedux"

import { tableDatas, tableCondition,  generateInfo, generateTime } from "components/FlightsSortModule/Redux"
import { flowcontrolDatas, flowcontrolCondition, flowGenerateTime } from "components/FlowcontrolModule/Redux"
import { noticeDatas, noticeGenerateTime } from "components/NoticeModule/Redux"
import { subTableDatas } from "components/SubTable/Redux"
import { operationDatas } from "components/OperationDialog/Redux"
import { sidebarConfig } from "components/Sidebar/Redux"
import { detailModalDatas } from "components/DetailModule/Redux"
const appReducer = combineReducers({
    loginUserInfo, systemConfig, flowcontrolParams,
    tableDatas, tableCondition, generateInfo, generateTime,
    filterMatches,
    subTableDatas,
    flowcontrolDatas, flowcontrolCondition, flowGenerateTime,
    noticeDatas, noticeGenerateTime,
    sidebarConfig,
    operationDatas,
    detailModalDatas
});


const reducer = (state, action) => {

    if (action.type === 'userLogout') { // 拦截用户登出
        state = undefined //并没有在这里改变状态, 只是重新分配一个局部变量state的引用,
                          // 然后再传递给另一个函数。
    }
    return appReducer(state, action)
}

export default reducer;