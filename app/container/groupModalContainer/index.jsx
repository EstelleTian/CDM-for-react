import { connect } from 'react-redux'
import { updateGroups, closeGroupModal } from '../../actions'
import groupModal from '../../components/groups/groupModal'

const mapStateToProps = (state) => ({
    groupModal: state.groupModal
});

const mapDispatchToProps = {
    updateGroups,
    closeGroupModal
}

const GroupModalContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(groupModal);

export default  GroupModalContainer