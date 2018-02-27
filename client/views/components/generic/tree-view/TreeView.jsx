import './treeView.scss';
import React, { Component } from 'react';
import { object, array, func } from 'prop-types';
import { IconSmall } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';
import { Fade, Slide, Scale } from 'views/utils/animations';

class TreeView extends Component {

  static propTypes = {
    style: object,
    items: array,
    data: object,
    onClick: func,
    onExpand: func
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

  renderList = (items, levelIndex) => {

    return items.map( item => {

      const hasChildren = ( item.children && Array.isArray( item.children ) && item.children.length > 0 );
      const canOpen = ( hasChildren && item.open );

      let icon = BaseEntityQuery.getBaseEntityAttribute(item.code, 'PRI_IMAGE_URL' );
      icon = icon && icon.value;

      let childNumber = null;
      
      if ( levelIndex == 0 ) {
        childNumber = item.childCount || false; 
      }
      else if ( levelIndex > 0 ) {
        childNumber = item.children && item.children.length || false;
      }

      return (

        <li key={item.id} className='tree-view-item'>
          <div className='tree-view-item-content'>
            <span className={canOpen ? 'clickable' : ''} onClick={this.onClick(item)}>
              { icon ? <IconSmall className='tree-view-icon main' name={icon} /> : null }
              <span className='tree-view-text'>{item.name}</span>
              { childNumber && (
                <span className='tree-view-item-count'>({childNumber})</span>
              )}
            </span>

            {( item.children && item.children.length > 0 ) && (
              <IconSmall
                className={`tree-view-icon arrow clickable ${canOpen ? 'open' : 'close'} `}
                size={32}
                style={canOpen ? { transition: 'all 0.1s', transform: 'rotate(0deg)' } : { transition: 'all 0.1s', transform: 'rotate(-90deg)' }}
                onClick={this.onExpand(item)}
                name='arrow_drop_down'
              />
            )}

          </div>

          <ul className="tree-view-child">
            {/* {canOpen ? this.renderList(item.children, levelIndex + 1) : []} */}
            <Scale inProp={canOpen}>
              {this.renderList(item.children, levelIndex + 1)}
            </Scale>
          </ul>
        </li>
      );
    });
  }

  render() {

    const { items } = this.props;

    return (
      <div className="treeview">
        <ul className="parent">
          {this.renderList(items, 0)}
        </ul>
      </div>
    );
  }
}

export default TreeView;
