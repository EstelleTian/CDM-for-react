import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import './Drag.less'

class DragDom extends React.Component {
    constructor( props ){
        super( props );
        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);

    }
    onStart() {

    };
    onStop() {

    };
    eventLogger = (e, data) => {
        console.log('Event: ', e);
        console.log('Data: ', data);
    };

    render() {
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
        return (
            <Draggable handle="strong" {...dragHandlers}>
                <div className="box no-cursor">
                    <strong className="cursor"><div>可拖拽标题</div></strong>
                    <div>内容</div>
                    <div>内容</div>
                    <div>内容</div>
                </div>
            </Draggable>
        );
    }
}

export default DragDom;