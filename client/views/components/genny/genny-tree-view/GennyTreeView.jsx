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

  render() {
  	const { root, baseEntity } = this.props;
  	const relationships = baseEntity.relationships[root];

    console.log(baseEntity);
  	const items = relationships ? Object.keys( relationships ).filter( key => relationships[key] ).map( code => baseEntity.data[code].data ) : [];

    return (
      <div className="genny-tree-view">
      	<TreeView root={root} {...this.props} items={items} />
      </div>
    );
  }
}

export default GennyTreeView;
