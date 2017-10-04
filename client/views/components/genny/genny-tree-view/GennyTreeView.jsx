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
      GennyBridge.sendTVEvent(event, data, token);
  }

  getEntityChildren( code ) {
    const { baseEntity } = this.props;
    const relationships = baseEntity.relationships[code];
    let items = relationships ? Object.keys( relationships ).filter( key => relationships[key] ).map( code => baseEntity.data[code].data ) : [];
    
    items = items.map( item => {
      /* Get the children for this item */
      const children = this.getEntityChildren( item.code );
      item.children = children;
      return item;
    });

    return items;
  }

  render() {
  	const { root, baseEntity } = this.props;
  	const relationships = baseEntity.relationships[root];
    console.log(baseEntity);

    const items = this.getEntityChildren( root );

    console.log( items );

    // items = items.map( item => {
    //    Get the children for this item 
    //   const children = this.getEntityChildren( item.code );
    // });

  	// const items = relationships ? Object.keys( relationships ).filter( key => relationships[key] ).map( code => baseEntity.data[code].data ) : [];
    // console.log(items);

    // const children2 = (Object.keys( baseEntity.relationships ).filter( key => relationships[key] ).map( code => baseEntity.relationships[code] ));
    // console.log(children2);
    
    return (
      <div className="genny-tree-view">
      	<TreeView root={root} {...this.props} items={items} onClick={this.handleClick.bind(this)}/>
      </div>
    );
  }
}

export default GennyTreeView;
