import './treeView.scss';
import React, { Component } from 'react';
import { object, array, func } from 'prop-types';
import { IconSmall } from '../';

class TreeView extends Component {

  static propTypes = {
    style: object,
    items: array,
    data: object,
  };

  onClick = (item) => (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.onClick(item);
    return false;
  }

  renderList = (items) => {
    var layout = [];
    items.map((item, i) => {

      if (item.children && item.open) {

        layout.push(
          <li key={i} onClick={this.onClick(item)}>
            <span>{item.name}<IconSmall name="expand_more"/></span>
            <ul className="child" style={{ marginLeft: 10 }}>
              {this.renderList(item.children)}
            </ul>
          </li>);
      }
      else { 
        layout.push(<li key={i} onClick={this.onClick(item)} >{item.name}<IconSmall name="chevron_right"/> </li>);
      }
    });

    return layout;
  }


  render() {
    const { items, baseEntity } = this.props;
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
