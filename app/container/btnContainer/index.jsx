import { connect } from "react-redux"
import aBtn from "../../components/aButton"

const mapStatuToProps = (state, ownProps) => {
    let isLoading = false;
    if(state.btnObject.name == ownProps.name){
        isLoading = state.btnObject.isLoading;
    }
    return {
        ...ownProps,
        isLoading
    }
}
const mapDispatchToProps = {

}

const BtnContainer = connect(mapStatuToProps, mapDispatchToProps)(aBtn);

export default BtnContainer
