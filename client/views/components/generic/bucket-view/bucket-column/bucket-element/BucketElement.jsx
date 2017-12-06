import './bucketElement.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import ReactDOM from 'react-dom';

const gridPadding = 5;
const getItemStyle = (draggableStyle, isDragging) => ({

    userSelect: 'none',
    padding: gridPadding,
    // marginBottom: gridPadding,

    // styles we need to apply on draggables. This is mandatory.
    ...draggableStyle,
});

class BucketElement extends Component {

    static defaultProps = {
        className: '',
    }

    static propTypes = {
        className: string,
        children: any,
    }

    state = {
    }

    componentDidUpdate() {
        this.onDragging();
    }

    getCurrentPosition = () => {

        let cardNode = ReactDOM.findDOMNode(this);
        if(cardNode) {

            let card = cardNode.firstChild;
            if(card) {

                let cardCss = window.getComputedStyle(card);
                var transformMatrix = cardCss.getPropertyValue("transform") ||
                cardCss.getPropertyValue("-moz-transform")    ||
                cardCss.getPropertyValue("-ms-transform")     ||
                cardCss.getPropertyValue("-o-transform")      ||
                cardCss.getPropertyValue("-webkit-transform");
                var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
                var x = matrix[12] || matrix[4];//translate x
                return x; // y ?
            }
        }
    }

    getCurrentState = () => {

        let cardNode = ReactDOM.findDOMNode(this);
        let width = cardNode.getBoundingClientRect().width;
        let currentX = this.getCurrentPosition();
        if(currentX < 0) {
            return "previous";
        }
        else if(currentX > width / 4.0) {
            return "next";
        }

        return null;
    }

    onDragging = () => {

        //TODO: not working as
        // let currentState = this.getCurrentState();
        // if(currentState != this.state.currentState) {
        //     this.state.currentState = currentState;
        //     this.notifyBucket(currentState);
        // }
    }

    notifyBucket = (currentState) => {

        if(currentState) {
            clearTimeout(this.state.timer);
            this.state.timer = setTimeout(() => {
                if(this.props.moveBucket) {
                    this.props.moveBucket(currentState);
                }
            }, 500);
        }
    }

    render() {

        const { className, item, style } = this.props;

        return (

            <Draggable key={item.id} draggableId={item.id} isDragDisabled={window.getScreenSize() == "sm"} >
                {
                    (provided, snapshot) => (
                            <div>
                                <div
                                    ref={provided.innerRef}
                                    style={{
                                        ...style,
                                        ...getItemStyle(
                                            provided.draggableStyle,
                                            snapshot.isDragging
                                        )
                                    }}
                                    {...provided.dragHandleProps}
                                    className="bucket-contents"
                                    >
                                        {
                                            React.cloneElement(item.content, {...item.content.props, showMovingOptions: this.props.showMovingOptions})
                                        }
                                    </div>
                                    {provided.placeholder}
                                </div>
                            )
                }
                </Draggable>
            );
        }
    }

    export default BucketElement;
