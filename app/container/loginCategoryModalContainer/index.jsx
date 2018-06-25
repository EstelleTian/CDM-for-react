import { connect } from 'react-redux'
import { updateLoginCategory, closeLoginCategoryModal } from '../../actions'
import loginCategoryModal from '../../components/loginCategory/loginCategoryModal'

const mapStateToProps = (state) => ({
    loginCategoryModal: state.loginCategoryModal
});

const mapDispatchToProps = {
    updateLoginCategory,
    closeLoginCategoryModal,
}

const LoginCategoryModalContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(loginCategoryModal);

export default  LoginCategoryModalContainer