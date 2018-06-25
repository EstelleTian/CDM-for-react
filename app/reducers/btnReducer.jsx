const initBtn = {
    isLoading: false,
    name:""
}
export const btnObject = (state = initBtn, action) => {
    switch (action.type){
        case "SHOW_BTN_LOADING" : {
            return {
                isLoading: action.isLoading || false,
                name: action.name || ""
            }
        }
        default : return state;
    }
}