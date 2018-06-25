import React from 'react'
import { connect } from 'react-redux'
import { selectedMenuKeys } from '../../actions'
import SliderMenu from '../../components/home/sliderMenu'

const mapStateToProps = ( state ) => ({
    sliderMenu : state.sliderMenu
})

const mapDispatchToProps =  {
    selectedMenuKeys
}

const SliderMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SliderMenu);

export default SliderMenuContainer;