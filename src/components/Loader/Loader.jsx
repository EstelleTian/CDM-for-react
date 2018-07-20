import React from 'react';
import {Spin, Icon} from 'antd'
import './Loader.less'

class Loader extends React.Component{

    constructor( props ){
        super(props);
    }

    render(){

        return (
            <div className="page-loader">
                <Spin size="large" >

                </Spin>
            </div>
        )
    }

}

export default Loader;
