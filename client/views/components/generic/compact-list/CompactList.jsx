import './compactList.scss';
import React, { Component } from 'react';
import { List } from '../';
import { string, array,} from 'prop-types';

class CompactList extends Component {

  static defaultProps = {
    className: '',
    items: [
      <div><span>one</span><span>one</span></div>,
      <div><span>two</span><span>two</span></div>,
      <div><span>three</span><span>three</span></div>,
    ],
  }

  static propTypes = {
    className: string,
    items: array,
  }
 
  state = {

  }

  render() {

    const { className, style, items } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`compact-list ${className}`}>
        <List hidenav>
          {items}
        </List>
      </div>
    );
  }
}

export default CompactList;
