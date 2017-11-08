import './listItem.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { } from '../';

class ListItem extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string,
    children: any
  }

  state = {
  }

  render() {
 	  const { children, className, style, } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };
    return (
      <div className={`list-item ${className}`}>
        {children}
      </div>
    );
  }
}

export default ListItem;
