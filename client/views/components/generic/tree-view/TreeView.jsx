import './treeView.scss';
import React, { Component } from 'react';
import { GennyComponent } from '../genny-component';
import store from 'views/store';
// import BaseEntity from '../../../utils/genny/BaseEntity';

import { object, array, func } from 'prop-types';


class TreeView extends Component {

  static propTypes = {
    style: object,
    items: array,
    data: object,
    onClick: () => { },
  };

  didReceiveDataFromStore = (data) => {
    log('=================================================');
    console.log('yo', data.baseEntity);
  }

  handleClick = (item) => {

    this.sendData('TV_EXPAND', {
      code: 'TV1',
      value: item.code
    }, item.code);
  }


  renderList = (items) => {
    var layout = [];
    items.map(item => {

      if (item.items) {

        layout.push(
          <li>
            <span>{item.name} <i className="material-icons" style={{ fontSize: 16 }} > add</i></span>
            <ul className="child" style={{ display: 'none', marginLeft: 10 }}>
              {this.renderList(item.items)}
            </ul>
          </li>);
      }
      else {
        layout.push(<li onClick={this.props.onClick} >{item.name}</li>);
      }
    });

    return layout;
  }


  render() {
    const { items, onClick, baseEntity } = this.props;
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
