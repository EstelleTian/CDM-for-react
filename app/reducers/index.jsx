import { combineReducers } from 'redux';
import { login } from './loginReducer';
import { onlineUserList, sliderBar, filterKey, multiFilterKey, filterPopover } from './onlineUserListReducer';
import { roleList, roleModal, authCbArr, roleSearchValue } from './roleListReducer';
import { authoritiesList, authoritiesModal, authSearchValue } from './authoritiesListReducer';
import { groupList, groupModal, groupSearchValue } from './groupListReducer';
import { userList, userModal, roleCbArr, groupCbArr, userSearchValue } from './userListReducer';
import { loginCategoryList, loginCategorySearchValue, loginCategoryModal } from './loginCategoryListReducer';
import { loginVersionList, loginVersionSearchValue, loginVersionModal } from './loginVersionListReducer';
import { btnObject } from './btnReducer';

const reducer = combineReducers({
    login,
    onlineUserList, filterKey, sliderBar, multiFilterKey, filterPopover,
    roleList, roleModal, authCbArr, roleSearchValue,
    authoritiesList, authoritiesModal, authSearchValue,
    groupList, groupModal, groupSearchValue,
    userList, userModal, roleCbArr, groupCbArr, userSearchValue,
    loginCategoryList,loginCategorySearchValue,loginCategoryModal,
    loginVersionList,loginVersionModal,loginVersionSearchValue,
    btnObject
});

export default reducer;
