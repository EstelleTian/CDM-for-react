
export const sliderMenu = (state = ["1"], action) => {
    switch (action.type){
        case "SELECT_MENU_KEYS": {
            const selectKey = action.key + "";
            return [selectKey]

        }
        default: return state;
    }
}