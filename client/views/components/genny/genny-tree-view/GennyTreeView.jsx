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
  }

  static propTypes = {
    items: array,
    baseEntity: object
  };

  state = {
    tree: {}
  }

  componentDidUpdate() {
      let identifier = this.props.key || this.props.root;
      store.storeState(identifier, this.state);
  }

  componentDidMount() {

      let identifier = this.props.key || this.props.root;
      if(identifier && this.props.componentState) {

        if(this.props.componentState[identifier]) {

            // ask for all the bes
            this.getNeededDataFor(this.props.componentState[identifier]);

            // update state
            this.setState(this.props.componentState[identifier]);
        }
      }
  }

  getNeededDataFor(state) {

      Object.keys(state.tree).forEach(be_key => {
          this.getNeededItems(state, be_key);
      });
  }

  getNeededItems(state, itemCode) {

      // get be
      this.onExpand({code: itemCode});

      // get children codes if exist
      if(state[itemCode] instanceof Object) {
          this.getNeededDataFor(state[itemCode]);
      }
  }

  onExpand = (item) => {    /* Determine whether we need to open or close, first get the state of the tree */

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

  clickEvent = (item) => {

      this.sendData('TV_SELECT', {
          code: 'TV1',
          value: item.code
      }, item.code);
  }

  sendData(event, data) {
    GennyBridge.sendTVEvent(event, data);
  }

  getEntityChildren(code) {

    const { baseEntity } = this.props;
    const relationships = baseEntity.relationships[code];
    let items = relationships ? Object.keys(relationships).filter(key => relationships[key]).map(code => baseEntity.data[code]) : [];

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
    const items = this.getEntityChildren(root);

    return (
      <div className="genny-tree-view">
        <TreeView root={root} {...this.props} items={items} onExpand={this.onExpand} onClick={this.clickEvent} />
      </div>
    );
  }
}

export default GennyTreeView;
