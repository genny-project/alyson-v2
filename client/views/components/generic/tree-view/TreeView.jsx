import './treeView.scss';
import React, { Component } from 'react';
import { object, array, func } from 'prop-types';
import { IconSmall, SubmitStatusIcon } from '../';
import { BaseEntity } from '../../../../utils/genny/';

import store from 'views/store';

import { GennyBridge } from 'utils/genny';


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

  sendSelectMsg = () => {
    this.sendData('TV_EXPAND', {
      code: 'TV1',
      value: 'GRP_LIVE_VIEW'
    }, 'TV1');
  }



  sendData = (event, data) => {
    console.log('send', data);
    const token = store.getState().keycloak.token;
    GennyBridge.sendTVEvent(event, data, token);
  }

  renderList = (items) => {
    var layout = [];
    items.map((item, i) => {

      if (item.children && item.open) {

        layout.push(
          <li key={i}>
            <span>  {item.name}     <IconSmall onClick={this.onClick(item)} name="expand_more" />  </span>
            <ul className="child" style={{ marginLeft: 10 }}>
              {item.children.length ? this.renderList(item.children) : <SubmitStatusIcon status="sending" />}
            </ul>
          </li>);
      }
      else {
        layout.push(< li key={i} onClick={this.sendSelectMsg}> <span>{item && item.name}  {console.log(item, 'item.sendSelectMsg from chevron right')}   {<IconSmall onClick={this.onClick(item)} name="chevron_right" />} </span></li >);
      }
    });

    return layout;
  }


  render() {
    const { items, baseEntity } = this.props;
    console.log(this.props, 'Logging props from treeview');
    return (
      <div className="treeview">
        <BaseEntity>
          {
            (query) => {
              return <span>{query.getRelationships(items)}</span>;
            }
          }
        </BaseEntity>
        <ul className="parent">
          {this.renderList(items)}
        </ul>

      </div>
    );
  }
}

export default TreeView;
