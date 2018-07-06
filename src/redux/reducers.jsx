import { combineReducers } from 'redux';
import { filterMatches } from "../views/HomeRedux"
import { loginUserInfo, systemConfig } from "../views/LoginRedux"
import { tableDatas, tableCondition, totalInfo } from "../components/FlightsSortModule/Redux"

const reducer = combineReducers({
    loginUserInfo, systemConfig,
    tableDatas, tableCondition, totalInfo,
    filterMatches,
});

export default reducer;