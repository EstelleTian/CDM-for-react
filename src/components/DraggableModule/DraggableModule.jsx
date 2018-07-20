import React from 'react';
import Draggable from 'react-draggable';
import './DraggableModule.less'

class DraggableModal extends React.Component {
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
        const { x, y } = this.props;
        // console.log( x, y );
        return (
            <Draggable
                defaultPosition={{ x, y }}
                bounds=".root"
                handle=".drag-target"
                {...dragHandlers}
            >
                { this.props.children }
            </Draggable>
        );
    }
}

export default DraggableModal;