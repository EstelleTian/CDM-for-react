import { connect } from 'react-redux'
import { updateUsers, closeUserModal, resetRoleChooseData, resetGroupChooseData } from '../../actions'
import userModal from '../../components/users/userModal'

const mapStateToProps = (state) => ({
    userModal: state.userModal,
    roleList: state.roleList,
    groupList: state.groupList,
    roleCbChooseStr: state.roleCbArr.chooseStr,
    groupCbChooseStr: state.groupCbArr.chooseStr
});

const mapDispatchToProps = {
    updateUsers,
    closeUserModal,
    resetRoleChooseData,
    resetGroupChooseData
}

const UserModalContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(userModal);

export default  UserModalContainer