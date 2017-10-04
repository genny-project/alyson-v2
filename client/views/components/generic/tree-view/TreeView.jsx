import './treeView.scss';
import React, { Component } from 'react';
import { object, array } from 'prop-types';
import store from 'views/store';

class TreeView extends Component {

  static propTypes = {
    style: object,
    items: array
  };

  // handleClick = (item) => {

  //     this.sendData("TV_EXPAND", {
  //         code: "TV1",
  //         value: item.code
  //     }, item.code);
  // }

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
        //layout.push(<li onClick={() => this.handleClick(item)}>{item.name}</li>);
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
