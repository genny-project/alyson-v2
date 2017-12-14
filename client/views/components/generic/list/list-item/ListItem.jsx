import './listItem.scss';
import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { } from '../';

class ListItem extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string
  }

  state = {
  }

  render() {
 	  const { className, style, } = this.props;
    const componentStyle = { ...style, };
    
    console.log(this.props);
    
    return (
      <div className={`list-item ${className}`}>
        { this.props.layout || null }
      </div>
    );
  }
}

export default ListItem;
