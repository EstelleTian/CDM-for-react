//侧边栏组件
import React from 'react';
import FlowcontrolModule from '../FlowcontrolModule/List/FlowcontrolModule';
import NoticeModule from '../NoticeModule/List/NoticeModule';
import RestrictionModule from '../RestrictionModule/List/RestrictionModule';

class Sidebar extends React.Component{
    constructor( props ){
        super(props);
    }
    render(){
        const { sidebarConfig } = this.props;
        const { key = '' } = sidebarConfig;

        return (
            <div className="card sidebar bc-1">
                    {
                        ( key == 'flowcontrol-info' ) ?
                            <FlowcontrolModule
                                key = "flowcontrol-info"
                            /> : ''
                    }
                    {
                        ( key == 'notice-info' ) ?
                            <NoticeModule
                                key = "notice-info"
                            /> : ''
                    }
                    {
                        ( key == 'restriction-info' ) ?
                            <RestrictionModule
                                key = "restriction-info"
                            /> : ''
                    }
            </div>
        )
    }
};

export default Sidebar;