import './treeView.scss';
import React, { Component } from 'react';
import { GennyComponent } from '../genny-component';
import { object, array } from 'prop-types';

class TreeView extends GennyComponent {

  static propTypes = {
    style: object,
    items: array
  };


  handleClick = (clickedItem) => {
    console.log('send code here!');
  }

  showList = () => {
    // var elm = document.getElementsByClassName('child')[0].children[0];
    // console.log('******************************************************element', elm);
    // elm.style.display = 'block';


    var elm = document.getElementsByClassName('child')[0];
    console.log(elm, '****************************************');
    elm.style.display = 'inline';
  }

  renderList = (items) => {
    var layout = [];
    items.map(item => {

      if (item.items) {
        layout.push(<li>  <span onClick={this.showList}>{item.name} <i className="material-icons" style={{ fontSize: 16 }} > add</i></span> <ul className="child" style={{ display: 'none', marginLeft: 10 }}>   {this.renderList(item.items)} </ul> </li>);
      }
      else {
        layout.push(<li onClick={this.handleClick}>{item.name}</li>);
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
