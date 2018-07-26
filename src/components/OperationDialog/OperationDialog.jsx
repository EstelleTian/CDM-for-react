//航班表格上右键协调对话框
import React from 'react';
import { Button } from 'antd';
import './OperationDialog.less';

class OperationDialog extends React.Component{
    constructor( props ){
        super( props );
    }

    render(){
        const { showName, x, y } = this.props.operationDatas;
        const dialogStyle = {
          left: x,
          top: y
        };
        return (
            <div className="collaborate-canvas">
                {
                    (showName == "flightid") ?
                        <div className="collaborate-dialog" style={ dialogStyle }>
                            <div className="content flightid">
                                <span>航班号右键协调</span>
                                <Button type="primary">移入等待池</Button>
                                <Button type="primary">移入等待池</Button>
                                <Button type="primary">移入等待池</Button>
                                <Button type="primary">移入等待池</Button>
                                <Button type="primary">移入等待池</Button>
                            </div>
                        </div>
                        : ""
                }
            </div>
        )
    }

};

export default OperationDialog;