import { connect } from 'react-redux'
import { updateLoginVersion, closeLoginVersionModal } from '../../actions'
import loginVersionModal from '../../components/loginVersion/loginVersionModal'

const mapStateToProps = (state) => ({
    loginVersionModal: state.loginVersionModal
});

const mapDispatchToProps = {
    updateLoginVersion,
    closeLoginVersionModal,
}

const LoginVersionModalContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(loginVersionModal);

export default  LoginVersionModalContainer