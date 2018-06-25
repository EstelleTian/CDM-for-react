import {connect} from 'react-redux'
import { userLogin, updateUserAuths } from "../../actions"
import Home from '../../components/home'

const mapStateToProps = (state) => ({
    login: state.login
});

const mapDispatchToProps = {
    userLogin,
    updateUserAuths
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
