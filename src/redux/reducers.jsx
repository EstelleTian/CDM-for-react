import { combineReducers } from 'redux';
import { filterMatches } from "../views/HomeRedux"
import { loginUserInfo, systemConfig } from "../views/LoginRedux"
import { tableDatas, tableCondition,  generateInfo, generateTime} from "../components/FlightsSortModule/Redux"

const reducer = combineReducers({
    loginUserInfo, systemConfig,
    tableDatas, tableCondition, generateInfo, generateTime,
    filterMatches,
});

export default reducer;