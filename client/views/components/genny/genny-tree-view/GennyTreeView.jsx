import './gennyTreeView.scss';
import React, { Component } from 'react';
import { TreeView } from '../../';
import { object, array } from 'prop-types';
import store from 'views/store';

class GennyTreeView extends Component {

	static propTypes = {
		items: array,
		baseEntity: object
	};

    handleClick = (item) => {

      this.sendData("TV_EXPAND", {
          code: "TV1",
          value: item.code
      }, item.code);
 	 }


  render() {
  	const { root, baseEntity } = this.props;
  	const relationships = baseEntity.relationships[root];

  	const items = relationships ? Object.keys( relationships ).filter( key => relationships[key] ).map( code => baseEntity.data[code].data ) : [];

    return (
      <div className="genny-tree-view">
     	{ /*JSON.stringify( items ) */}
      	<TreeView root={root} {...this.props} items={items} onClick={this.handleClick} />
      </div>
    );
  }
}

export default GennyTreeView;
