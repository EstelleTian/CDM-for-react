import { combineReducers } from 'redux';
import { filterMatches } from "../layouts/NavMenuRedux"
import { loginUserInfo, systemConfig, flowcontrolParams } from "../views/LoginRedux"
import { tableDatas, tableCondition,  generateInfo, generateTime } from "../components/FlightsSortModule/Redux"
import { flowcontrolDatas, flowcontrolCondition, flowGenerateTime } from "../components/FlowcontrolModule/Redux"
import { subTableDatas } from "../components/SubTable/Redux"

const reducer = combineReducers({
    loginUserInfo, systemConfig, flowcontrolParams,
    tableDatas, tableCondition, generateInfo, generateTime,
    filterMatches,
    subTableDatas,
    flowcontrolDatas, flowcontrolCondition, flowGenerateTime
});

export default reducer;