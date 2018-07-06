import { combineReducers } from 'redux';
import { filterMatches } from "../views/HomeRedux"
import { loginUserInfo,systemConfig } from "../views/LoginRedux"
import { tableConfig, tableDatas,totalInfo } from "../views/AirTableRedux"

const reducer = combineReducers({
    loginUserInfo,
    systemConfig,
    tableConfig, tableDatas,
    filterMatches,
    totalInfo,
});

export default reducer;