import { connect } from 'react-redux'
import { chooseRoleCheckbox } from "../../actions"
import checkboxItem from '../../components/users/checkboxItem'

const mapStateToProps = (state, ownProps) => {
    //若id在范围中，则选中，否则不选中
    const id = ownProps.id+"";
    const chooseStr = state.roleCbArr.chooseStr || "";
    const chooseArr = chooseStr.split(",");
    if( chooseArr.length == 0 ){
        return { active: false}
    }else{
        let flag = (chooseArr.indexOf(id) > -1) ? true : false;
        return { active : flag }
    }
}

const mapDispatchToProps = {
    onChoose: chooseRoleCheckbox
}

const UserModalForRoleCbContainer = connect(mapStateToProps, mapDispatchToProps)(checkboxItem);

export default UserModalForRoleCbContainer