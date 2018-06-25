import { connect } from 'react-redux'
import { chooseGroupCheckbox } from "../../actions"
import checkboxItem from '../../components/users/checkboxItem'

const mapStateToProps = (state, ownProps) => {
    //若id在范围中，则选中，否则不选中
    const id = ownProps.id+"";
    const chooseStr = state.groupCbArr.chooseStr || "";
    const chooseArr = chooseStr.split(",");
    if( chooseArr.length == 0 ){
        return { active: false}
    }else{
        let flag = (chooseArr.indexOf(id) > -1) ? true : false;
        return { active : flag }
    }
}

const mapDispatchToProps = {
    onChoose: chooseGroupCheckbox
}

const UserModalForGroupCbContainer = connect(mapStateToProps, mapDispatchToProps)(checkboxItem);

export default UserModalForGroupCbContainer