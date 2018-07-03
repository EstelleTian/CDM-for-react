import { combineReducers } from 'redux';
import { loginUserInfo,systemConfig } from "../views/LoginRedux"
import { tableConfig, tableDatas } from "../views/AirTableRedux"

const reducer = combineReducers({
    loginUserInfo,
    systemConfig,
    tableConfig, tableDatas
});

export default reducer;