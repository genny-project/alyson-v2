import './gennyTreeView.scss';
import React, { PureComponent } from 'react';
import { TreeView, Breadcrumbs } from 'views/components';
import { object, array, bool } from 'prop-types';
import store from 'views/store';
import { GennyBridge, BaseEntityQuery } from 'utils/genny';

class GennyTreeView extends PureComponent {

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
      //let identifier = this.props.key || this.props.root;
      //store.storeState(identifier, this.state);
  }

  componentDidMount() {

      // let identifier = this.props.key || this.props.root;
      // if(identifier && this.props.componentState) {
      //
      //   if(this.props.componentState[identifier]) {
      //
      //       // ask for all the bes
      //       // this.getNeededDataFor(this.props.componentState[identifier]);
      //
      //       // update state
      //       this.setState(this.props.componentState[identifier]);
      //   }
      // }
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

    const relationships = store.getState().baseEntity.relationships;
    const grp = relationships[code];

    let items = grp ? Object.keys(grp).filter(x => x != "DUMMY").map(code => store.getState().baseEntity.data[code]) : [];

    let rootEntity = BaseEntityQuery.getBaseEntity(code);

    items = items.map(item => {

        if(item) {

            // order by weight if found in links
            let weight = 0;
            if(rootEntity && rootEntity.originalLinks) {

                let currentLinks = rootEntity.originalLinks.filter(x => {
                    return x.link.targetCode == item.code
                });

                weight = currentLinks.length > 0 ? currentLinks[0].weight : weight;
            }

            const children = this.getEntityChildren(item.code);
            item.children = children;
            item.open = !!this.state.tree[item.code];
            item.parentCode = code;
            return item;
        }

        return false;

    });

    return items.sort((x, y) => x.weight > y.weight).filter(x => x.hidden !== true);
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
