import { combineReducers } from 'redux';
import { loginUserInfo } from "../views/LoginRedux"
import { filterMatches } from "../views/HomeRedux"
import { tableConfig, tableDatas } from "../views/AirTableRedux"

const reducer = combineReducers({
    loginUserInfo,
    tableConfig, tableDatas,
    filterMatches
});

export default reducer;