//用于创建在root之外的DOM 层，和body同级

/**
 *  <CreateLayer
 *      id={`id`} //tring，可以不设置
 *      className={`classnameA classnameB`} //String，可以不设置
 *      style={{width: '100px'}} //Object，可以不设置
 *  >
 *      此处插入div或者react组件
 *  </CreateLayer>
 *
 * */

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './CreateLayer.less';

function CreateLayer() {
    class Layer extends React.Component{
        //实现props，包括id、className、style
        constructor(props) {
            super(props)
            this.el = document.createElement('div');
            this.el.className = 'portal-layer ' // 默认设有 portal-layer
            if (!!props) {
                if(props.id){
                    this.el.id = props.id;
                }
                if (props.className) {
                    this.el.className += props.className;
                }
                if (props.style) {
                    Object.keys(props.style).map((v) => {
                        this.el.style[v] = props.style[v]
                    })
                }
                document.body.appendChild(this.el)
            }
        }
        //将dom添加到body下面
        componentDidMount() {
            document.body.appendChild(this.el);
        }
        //清除DOM结构
        componentWillUnmount() {
            document.body.removeChild(this.el)
        }
        // 用createPortal创建Layer
        render() {
            return ReactDOM.createPortal(
                this.props.children,
                this.el
            )
        }
    }
    Layer.propTypes = {
        style: PropTypes.object
    }
    return Layer
}
export default CreateLayer()