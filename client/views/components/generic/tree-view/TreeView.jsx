import './treeView.scss';
import React, { Component } from 'react';
import { object, array, number } from 'prop-types';

class TreeView extends Component {
  static propTypes = {
    style: object,
    items: array
  };

  renderList = (items) => {
    var layout = [];
    items.map(item => {

      if (item.items) {
        layout.push(<ul className="child">{this.renderList(item.items)} </ul>);
      }
      else {
        layout.push(<li>{item.name}</li>);
      }
    });
    return layout;
  }

  render() {
    const { items } = this.props;
    return (
      <div className="treeview">
        <ul className="parent">
          {this.renderList(items)}
        </ul>
      </div>
    );
  }
}

export default TreeView;
