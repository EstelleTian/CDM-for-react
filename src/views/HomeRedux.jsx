//action-type
import {isValidVariable} from "../utils/basic-verify";

const UPDATE_SCOPE_FILTER = 'filterMatches/update/scopeFilter';
const UPDATE_STATUS_FILTER = 'filterMatches/update/statusFilter';

//action-creator
//修改时间范围
const updateScopeFilter = ( value ) => ({
    type: UPDATE_SCOPE_FILTER,
    value
});

//修改屏蔽条件
const updateStatusFilter = ( value ) => ({
    type: UPDATE_STATUS_FILTER,
    value
});

//reducer filter-group
const initFilterMatches = {
    scopeFilter: 'all', //时间范围
    statusFilter: [], //屏蔽

};
//过滤条件
const filterMatches = (state = initFilterMatches, action) => {
        switch (action.type){
            //更新时间范围
            case UPDATE_SCOPE_FILTER: {
                const newValue = action.value;
                if(isValidVariable(newValue)){
                    return {
                        ...state,
                        scopeFilter: newValue
                    }
                }else{
                    return state;
                }

            }
            //更新屏蔽
            case UPDATE_STATUS_FILTER: {
                const newValue = action.value;
                if( typeof newValue == 'object' && newValue.length > 0 ){
                    return {
                        ...state,
                        statusFilter: newValue
                    }
                }else{
                    return state;
                }

            }
            default:
                return state;
        }
};

export {
    updateScopeFilter, updateStatusFilter,
    filterMatches
}

