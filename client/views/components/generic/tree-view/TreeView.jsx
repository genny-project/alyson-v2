import './treeView.scss';
import React, { Component } from 'react';
import { object, array, func } from 'prop-types';
import { IconSmall, SubmitStatusIcon } from 'views/components';
import { BaseEntity, GennyBridge } from 'utils/genny/';

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

  onExpand = (item) => (event) => {

      event.stopPropagation();
      event.preventDefault();

      this.props.onExpand(item);
      return false;
  }

  renderList = (items) => {
    return items.map( item => {
      const hasChildren = ( item.children && Array.isArray( item.children ) && item.children.length > 0 );
      const canOpen = ( hasChildren && item.open );

      return (
        <li key={item.id}>
          <div>
            <span className={canOpen ? 'clickable' : ''} onClick={this.onClick(item)}>
              { item.icon ? <IconSmall name={item.icon} onClick={this.onExpand(item)} /> : null }
              {item.name}
            </span>

            {( item.children && item.children.length > 0 ) && (
              <IconSmall className='clickable' onClick={this.onExpand(item)} name={canOpen ? "expand_more" : 'chevron_right'} />
            )}
          </div>

          <ul className="child">
            {canOpen ? this.renderList(item.children) : []}
          </ul>
        </li>
      );
    });
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
