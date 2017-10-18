import './gennyDropdown.scss';
import React, { Component } from 'react';
import { Dropdown } from '../../';
import { string, any } from 'prop-types';

class GennyDropdown extends Component {

  static defaultProps = {
  }

  static propTypes = {
    style: string,
    children: any,
  }

  state = {
  }

  render() {
    const { className, children, style, visible, id, openedDropdown, sendTheAlert } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };
    // if (openedDropdown == id && visible) {
    // isVisible: false,
    //   let 
    // }

    return (
      <Dropdown className={className} visible={visible} style={componentStyle}>
        {children}
      </Dropdown>
    );
  }
}

export default GennyDropdown;
