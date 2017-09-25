import './treeView.scss';
import React, { Component } from 'react';
import { object, array } from 'prop-types';

class TreeView extends Component {
  static propTypes = {
    style: object,
    items: array,
  };

  renderItem(item) {
    return (
      <li>{item}</li>
    );
  }

  render() {
    const { style, items } = this.props;

    return (
      <ul style={style} className="treeview">
        {items.map((item, i) => {
          return (
            <div key={i}>
              <li>
                {item}
              </li>
              <i className="material-icons">chevron_right</i>
            </div>
          );
        })}
      </ul>
    );
  }

}

export default TreeView;
