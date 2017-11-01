import './bucketView.scss';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const grid = 5;
const getItemStyle = (draggableStyle, isDragging) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  marginBottom: grid,

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
});

class BucketView extends Component {
  constructor(props) {
    super(props);

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    console.log(result);
  }

  render() {

     const { buckets, style } = this.props;

     return (

         <div className="bucket-view" style={style}>
             {
                 buckets.map((bucket) => (
                 <DragDropContext onDragEnd={this.onDragEnd}>
                   <Droppable droppableId="droppable">
                     {(provided, snapshot) => (
                       <div
                         ref={provided.innerRef}
                         style={getListStyle(snapshot.isDraggingOver)}
                         className="bucket"
                         key={bucket.title}
                       >
                            <div className="bucket-title sticky">
                               {bucket.title}
                            </div>
                            <div className="bucket-content">
                                {(bucket ? bucket.children : []).map(item => (
                                  <Draggable key={item.id} draggableId={item.id}>
                                    {(provided, snapshot) => (
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
                                          {item}
                                        </div>
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                            </div>
                         {provided.placeholder}
                       </div>
                     )}
                   </Droppable>
                 </DragDropContext>
             ))
         }
         </div>
     );
  }
}

// import React, { Component } from 'react';
// import { array, object, any } from 'prop-types';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
//
// class BucketView extends Component {
//
//     static propTypes = {
//         buckets: array,
//         style: object,
//         children: any,
//     };
//
//     onDragEnd(result) {
//
//         if (!result.destination) {
//             return;
//         }
//
//         console.log(result);
//     }
//
//     renderBucket(bucket) {
//
//         return (
//             <div key={bucket.title} className="bucket-contents">
//                 {bucket.children}
//             </div>
//         );
//     }
//
//     render() {
//
//         const { buckets, style } = this.props;
//
//         return (
//             <div className="bucket-view" style={style}>
//                 {
//                     buckets.map(( bucket, i ) => (
//
//                         <div className="bucket" key={bucket.title}>
//                             <div className="bucket-title sticky">
//                                 {bucket.title}
//                             </div>
//                             <div className="bucket-content">
//
//                                 {
//                                     bucket.children.map(item => (
//                                         <div>
//                                             <div key={item.title} className="bucket-contents" style={{backgroundColor: "green"}}>
//                                                 {item}
//                                             </div>
//                                         </div>
//                                     ))
//                                 }
//                             </div>
//                         </div>
//                     ))
//                 }
//             </div>
//         );
//     }
// }

export default BucketView;
