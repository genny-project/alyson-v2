import './gennyTreeView.scss';
import React, { Component } from 'react';
import { TreeView, Breadcrumbs } from '../../';
import { object, array, bool } from 'prop-types';
import store from 'views/store';
import { GennyBridge } from 'utils/genny';
import { BaseEntity } from '../../../../utils/genny/';

class GennyTreeView extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    items: array,
    baseEntity: object,
    isHorizontal: bool,
  };

  state = {
    tree: {},
    horizontalItems: {}
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

  onClick = (clickedItem) => {

      let item = null;
      if(this.props.isHorizontal) {
          item = this.state.horizontalItems[clickedItem];
      }
      else {
          item = clickedItem;
      }

      // update the current path within the store.
      let parentCode = item.parentCode;
      let bes = store.getState().baseEntity.data;

      let path = "/" + item.code;
      let currentPath = item.name;

      // we lookup for the Be corresponding to the parentCode and check if it has a parent.
      // for each parent we find we keep looping through the parent codes.
      // effectively, we are building the current path starting from the end.
      while(parentCode != null) {

          if(bes[parentCode]) {

              path = "/" + bes[parentCode].code + path;
              parentCode = bes[parentCode].parentCode;
          }
          else {

              parentCode = null; // force exit as parent was not found.
          }
      }

      // update the current path
      store.getState().app.currentPath = path;

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
      item.parentCode = code;
      return item;
    });

    return items;
  }

  generatePath = (baseEntityPath) => {

      if(!baseEntityPath) return "";

      let finalPath = "";
      let besCode = baseEntityPath.split('/');
      besCode.forEach((be_code) => {

          if(be_code && be_code.length > 0) {

              let be = this.props.baseEntity.data[be_code];
              finalPath += "/" + be.name;
              this.state.horizontalItems[be.name] = be;
          }
      });

      return finalPath;
  }

  render() {

    const { root, baseEntity, isHorizontal } = this.props;
    const relationships = baseEntity.relationships[root];
    const items = this.getEntityChildren(root);

    if(isHorizontal) {

        let bePath = this.generatePath(this.props.currentPath);
        return (
            <Breadcrumbs {...this.props} currentPath={ bePath } onClick={ this.onClick } />
        );
    }
    else {

        return (
          <div className="genny-tree-view">
            <TreeView root={root} {...this.props} items={items} onExpand={this.onExpand} onClick={this.onClick} />
          </div>
        );
    }
  }
}

export default GennyTreeView;
