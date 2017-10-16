import './gennyTreeView.scss';
import React, { Component } from 'react';
import { TreeView } from '../../';
import { object, array } from 'prop-types';
import store from 'views/store';
import { GennyBridge } from 'utils/genny';
import { BaseEntity } from '../../../../utils/genny/';


class GennyTreeView extends Component {
  constructor(props) {
    super(props);
    console.log(BaseEntity, 'base entity log from genny treeview');

  }

  state = {
    tree: {}
  }

  static propTypes = {
    items: array,
    baseEntity: object
  };




  handleClick = (item) => {

    /* Determine whether we need to open or close, first get the state of the tree */
    const { tree } = this.state;

    /* Now check whether this item is opened or closed in the tree */
    if (!tree[item.code]) {
      /* Item is closed */
      this.openItem(item);
    } else {
      /* Item is open */
      this.closeItem(item);
    }

  }

  openItem = (item) => {
    /* Send the Genny event */
    this.sendData('TV_EXPAND', {
      code: 'TV1',
      value: item.code
    }, item.code);

    /* Set this item to be open in the tree */
    this.setState({
      tree: {
        ...this.state.tree,
        [item.code]: true,
      }
    });
  }

  closeItem = (item) => {
    /* Close the item */
    this.setState({
      tree: {
        ...this.state.tree,
        [item.code]: false,
      }
    });
  }

  sendData(event, data) {
    console.log('send', data);
    const token = store.getState().keycloak.token;
    GennyBridge.sendTVEvent(event, data, token);
  }

  getEntityChildren(code) {
    const { baseEntity } = this.props;
    const relationships = baseEntity.relationships[code];
    let items = relationships ? Object.keys(relationships).filter(key => relationships[key]).map(code => baseEntity.data[code].data) : [];

    items = items.map(item => {
      /* Get the children for this item */
      const children = this.getEntityChildren(item.code);
      item.children = children;
      item.open = !!this.state.tree[item.code];
      return item;
    });

    return items;
  }


  render() {
    const { root, baseEntity } = this.props;
    const relationships = baseEntity.relationships[root];
    console.log(baseEntity);
    console.log(root, '****************************************');

    const items = this.getEntityChildren(root);

    console.log(items, 'items console log from genny tree view');

    return (


      <div className="genny-tree-view">
        <BaseEntity>
          {
            (query) => {
              return <span>{query.getRootChildren()}</span>;
            }
          }
        </BaseEntity>

        < TreeView root={root} {...this.props} items={items} onClick={this.handleClick.bind(this)} />
      </div>
    );
  }
}

export default GennyTreeView;
