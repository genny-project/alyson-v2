import './treeView.scss';
import React, { Component } from 'react';
import { object, array, func } from 'prop-types';
import { IconSmall, SubmitStatusIcon } from '../';

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
    let layout = [];
    items.map((item, i) => {

      if (item.children && item.open) {

        layout.push(
          <li key={i}>
            <span>{item.name}<IconSmall onClick={this.onClick(item)} name="expand_more"/></span>
            <ul className="child" style={{ marginLeft: 10 }}>
              { item.children.length ? this.renderList(item.children) : <SubmitStatusIcon status="sending" />}
            </ul>
          </li>);
      }
      else { 
        layout.push(<li key={i} > <span>{item.name}<IconSmall onClick={this.onClick(item)} name="chevron_right"/></span></li>);
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
