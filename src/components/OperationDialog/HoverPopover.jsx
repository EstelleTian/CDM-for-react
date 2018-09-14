import React from 'react';
import { Popover } from 'antd';

class HoverPopover extends React.Component{
    constructor(props){
        super(props);
    };

    render(){
        const { rowData } = this.props;
        const { ID = "", FLIGHTID = "" } = rowData;
        const text = (<span>{FLIGHTID} ID:{ID}</span>);
        const content = (
            <div>
                <p>Content</p>
                <p>Content</p>
            </div>
        );
        return (
            <Popover placement="left" title={text} content={content}>
                { this.props.children }
            </Popover>
        )
    }
};

export default HoverPopover;