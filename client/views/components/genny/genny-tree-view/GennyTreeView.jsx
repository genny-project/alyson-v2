import './gennyTreeView.scss';
import React, { Component } from 'react';
import { TreeView, Breadcrumbs } from 'views/components';
import { object, array, bool } from 'prop-types';
import store from 'views/store';
import { GennyBridge, BaseEntityQuery } from 'utils/genny';

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
        //let identifier = this.props.key || this.props.root;
        //store.storeState(identifier, this.state);
    }

    componentDidMount() {

        if (this.props.onMount) this.props.onMount();

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
            code: item.parentCode,
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

        let path = '/' + item.code;
        let currentPath = item.name;

        // we lookup for the Be corresponding to the parentCode and check if it has a parent.
        // for each parent we find we keep looping through the parent codes.
        // effectively, we are building the current path starting from the end.
        while(parentCode != null) {

            if(bes[parentCode]) {

                path = '/' + bes[parentCode].code + path;
                parentCode = bes[parentCode].parentCode;
            }
            else {

                parentCode = null; // force exit as parent was not found.
            }
        }

        // update the current path
        store.getState().app.currentPath = path;

        this.sendData('TV_SELECT', {
            code: item.parentCode,
            value: item.code
        }, item.code);

        if (this.props.onClick) this.props.onClick();
    }

    sendData(event, data) {
        GennyBridge.sendTVEvent(event, data);
    }

    generatePath = (baseEntityPath) => {

        if(!baseEntityPath) return '';

        let finalPath = '';
        let besCode = baseEntityPath.split('/');
        besCode.forEach((be_code) => {

            if(be_code && be_code.length > 0) {

                let be = this.props.baseEntity.data[be_code];
                if (be && be.name) {
                    finalPath += '/' + be.name;
                    this.state.horizontalItems[be.name] = be;
                }
            }
        });

        return finalPath;
    }

    render() {

        const { root, isHorizontal } = this.props;

        const getIcon = (item) => {

            if(item.code != null) {
                const imageAttribute = BaseEntityQuery.getBaseEntityAttribute(item.code, 'PRI_IMAGE_URL');
                if(imageAttribute != null) {
                    return imageAttribute.value;
                }
            }

            return null;
        }

        const getItems = (item) => {

            let childCount = 0;
            if (item && item.children != null && item.children.length > 0) {
                item.children.forEach(child => {
                    childCount = childCount + (child != null && child.children != null ? child.children.length : 0);
                    child.icon = getIcon(child);
                });
            }

            let icon = getIcon(item);

            return {
                ...item,
                icon: icon,
                open: !!this.state.tree[item.code],
                childCount: childCount,
            };
        }

        let items = root ?
            BaseEntityQuery.getEntityChildren(root).map(item => {

                let childCount = 0;
                let countedChildren = {};
                if (item && item.children != null && item.children.length > 0) {

                    item.children.forEach(child => {

                        let counter = 0;
                        let childArray = (child != null && child.children != null ? child.children : []);
                        childArray.forEach((c => {

                            if(countedChildren[c.code] == null) {
                                countedChildren[c.code] = true;
                                counter++;
                            }
                        }));

                        childCount = childCount + counter;
                        child.icon = getIcon(child);
                    });
                }

                let icon = getIcon(item);

                return {
                    ...item,
                    icon: icon,
                    open: !!this.state.tree[item.code],
                    childCount: childCount,
                };
            }) :
            [];

        items = items.filter(x => x.name != null);

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
