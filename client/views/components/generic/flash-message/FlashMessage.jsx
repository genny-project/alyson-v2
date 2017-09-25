import React from 'react';
import { string } from 'prop-types';
import './flashmessage.scss';

FlashMessage.propType = {
  messageType: string,
  title: string,
  body: string
};

FlashMessage.defaultProps = {
  messageType: 'primary',
  title: 'Title Example',
  body: 'Body Example'
};

function FlashMessage() {
  return (
    <div className="flash-message">
      <div className={this.props.messageType} >
        <h4 className="title"> {this.props.title} </h4>
        <p>{this.props.body}</p>
      </div>
    </div>
  );
}

export default FlashMessage;

// Tree View Next => Select, 
// text => { }
// refusal
// expiry and timeout
// Hint and Help
// pre defined labels and data formats
// Treeview
// Searchable data in the table
