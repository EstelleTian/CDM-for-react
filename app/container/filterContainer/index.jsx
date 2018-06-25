import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { forceLogout, filterList, updateOnlineUserList, updateMultiFilter, toggleFilterPopover, closeFilterPopover, showBtnLoading } from '../../actions/index'
import FilterContent from '../../components/onlineUsers/filterContent/index'

const mapStateToProps = (state) => ({
    userList: state.onlineUserList,
    filterKey: state.filterKey,
    multiFilterKey: state.multiFilterKey,
    filterPopover: state.filterPopover,
    optsAuths: state.login.optsAuths
})

const mapDispatchToProps = {
    forceLogout,
    filterList,
    updateOnlineUserList,
    updateMultiFilter,
    toggleFilterPopover,
    closeFilterPopover,
    showBtnLoading
}

const FilterContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(FilterContent)

export default withRouter(FilterContainer)