import React, {Component} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';

const ItemSource = {
    beginDrag(props) {
        return {id: props.item.id,
        index: props.index};
    }
};

const ItemTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        props.moveItem(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    }
};

function collect(connect, monitor) {
    return {connectDragSource: connect.dragSource(), isDragging: monitor.isDragging()}
}

function connect(connect, monitor) {
    return {connectDropTarget: connect.dropTarget()}
}

class Item extends Component {

    render() {
        let self = this;
        const {connectDragSource, isDragging, connectDropTarget, style} = self.props;

        const opacity = isDragging
            ? 0
            : 1;

        return connectDragSource(connectDropTarget(
            <div key={self.props.key} style={{...style, opacity}} className="Item">
                <div className="row">
                    <div className="col-md-10">{self.props.item.text}</div>

                </div>
            </div>
        ));
    }
}

//TODO constant for this first string
export default _.flow([
    DragSource('item', ItemSource, collect),
    DropTarget('item', ItemTarget, connect)
])(Item);
