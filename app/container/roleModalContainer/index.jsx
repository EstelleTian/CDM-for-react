import { connect } from 'react-redux'
import { updateRoles, closeRoleModal, resetChooseData } from '../../actions'
import roleModal from '../../components/roles/roleModal'

const mapStateToProps = (state) => ({
    roleModal: state.roleModal,
    authoritiesList: state.authoritiesList,
    authCbChooseStr: state.authCbArr.chooseStr
});

const mapDispatchToProps = {
    updateRoles,
    closeRoleModal,
    resetChooseData
}

const RoleModalContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(roleModal);

export default  RoleModalContainer