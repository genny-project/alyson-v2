import './gennyTreeView.scss';
import React, { Component } from 'react';
import { TreeView } from '../../';
import { object, array } from 'prop-types';
import store from 'views/store';
import { GennyBridge } from 'utils/genny';

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

  sendData(event, data) {
      console.log("send", data);
      const token = store.getState().keycloak.token;
      GennyBridge.sendTVExpand(event, data, token);
  }

  render() {
  	const { root, baseEntity } = this.props;
  	const relationships = baseEntity.relationships[root];
    console.log(baseEntity);
  	const items = relationships ? Object.keys( relationships ).filter( key => relationships[key] ).map( code => baseEntity.data[code].data ) : [];

    console.log(Object.keys( baseEntity.relationships ));

    return (
      <div className="genny-tree-view">
      	<TreeView root={root} {...this.props} items={items} onClick={this.handleClick.bind(this)}/>
      </div>
    );
  }
}

export default GennyTreeView;
