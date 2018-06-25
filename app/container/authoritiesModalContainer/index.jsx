import { connect } from 'react-redux'
import { updateAuths, closeAuthModal } from '../../actions'
import AuthoritiesModal from '../../components/authorities/authoritiesModal'

const mapStateToProps = (state) => ({
    authoritiesModal: state.authoritiesModal
});

const mapDispatchToProps = {
    updateAuths,
    closeAuthModal
}

const AuthoritiesModalContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthoritiesModal);

export default  AuthoritiesModalContainer