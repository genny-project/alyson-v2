import './gennyTreeView.scss';
import React, { Component } from 'react';
import { TreeView } from '../generic';

class GennyTreeView extends Component {
  render() {
    return (
      <div className="genny-tree-view">
      	<TreeView {...this.props}/>
      </div>
    );
  }
}

export default GennyTreeView;
