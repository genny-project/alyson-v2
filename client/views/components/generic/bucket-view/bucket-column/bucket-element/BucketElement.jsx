import './bucketElement.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

const gridPadding = 5;
const getItemStyle = (draggableStyle, isDragging) => ({

    userSelect: 'none',
    padding: gridPadding,
    marginBottom: gridPadding,

    // styles we need to apply on draggables. This is mandatory.
    ...draggableStyle,
});

class BucketElement extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
  }

  state = {
  }

  render() {

    const { className, item, style } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };

    return (
        <Draggable key={item.id} draggableId={item.id}>
            {
                (provided, snapshot) => (
                <div>
                    <div
                        ref={provided.innerRef}
                        style={getItemStyle(
                            provided.draggableStyle,
                            snapshot.isDragging
                        )}
                        {...provided.dragHandleProps}
                        className="bucket-contents"
                        >
                            {item.content}
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
