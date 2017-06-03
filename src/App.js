import React, {Component} from 'react';
import './App.css';
import {List} from 'react-virtualized';
import {name} from 'faker';
import Item from './Item.js';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';

class App extends Component {
    constructor(props) {
        super(props);

        const items = [];

        for (let i = 0; i < 1000; i += 1) {
            const item = {
                id: i,
                text: name.findName()
            };
            items[i] = item;
        }

        this.state = {
            items: items
        }
        this.rowRenderer = this.rowRenderer.bind(this);
        this.moveItem = this.moveItem.bind(this);
    }

    moveItem(dragIndex, hoverIndex) {
        const {items} = this.state;
        const dragItem = items[dragIndex];
        this.setState(update(this.state, {
            items: {
                $splice: [
                    [
                        dragIndex, 1
                    ],
                    [hoverIndex, 0, dragItem]
                ]
            }
        }));
    }

    rowRenderer(row) {
        const {items} = this.state;
        const item = items[row.index]

        return (<Item index={row.index} key={row.key} style={row.style} item={item} moveItem={this.moveItem}/>);
    }

    render() {
        const {items} = this.state;
        return (
            <div className="App">
                <List className="list-group" width={800} items={items} height={1000} rowCount={items.length} rowHeight={55} rowRenderer={this.rowRenderer}/>
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(App);
