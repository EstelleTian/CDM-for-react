import { combineReducers } from 'redux';
import { loginUserInfo } from "../views/LoginRedux"
import { tableConfig, tableDatas } from "../views/AirTableRedux"

const reducer = combineReducers({
    loginUserInfo,
    tableConfig, tableDatas
});

export default reducer;