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

  onClick = (item) => {
    this.props.onClick(item);
  }

  renderList = (items) => {
    var layout = [];
    items.map((item, i) => {

      if (item.items) {

        layout.push(
          <li key={i}>
            <span>{item.name} <i className="material-icons" style={{ fontSize: 16 }} > add</i></span>
            <ul className="child" style={{ display: 'none', marginLeft: 10 }}>
              {this.renderList(item.items)}
            </ul>
          </li>);
      }
      else { 
        layout.push(<li key={i} onClick={ ()=>{ this.onClick(item)} } >{item.name}<IconSmall name="expand_more"/></li>);
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
