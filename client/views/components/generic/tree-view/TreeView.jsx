import './treeView.scss';
import React, { Component } from 'react';
import { GennyComponent } from '../genny-component';
import { object, array, func } from 'prop-types';
import store from 'views/store';
import { GennyBridge } from 'utils/genny';

class TreeView extends Component {

  static propTypes = {
    style: object,
    items: array,
    data: object,
  };

  handleClick = (item) => {
      this.sendData("TV_EXPAND", {
          code: "TV1",
          value: item.code
      }, item.code);
   }

  sendData(event, data) {
      console.log("send", data);
      GennyBridge.sendTVExpand(event, data);
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
        layout.push(<li key={i} onClick={()=>{this.handleClick(item)}} >{item.name}</li>);
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
