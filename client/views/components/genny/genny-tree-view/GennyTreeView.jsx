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
                parentCode = bes[parentCode].code != parentCode ? bes[parentCode].parentCode : null;
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
    
    countVisibleChildren = ( item ) => {
        let numberOfVisibleChildren = 0;
        if ( item.children && !!this.state.tree[item.code] ) {
            numberOfVisibleChildren = numberOfVisibleChildren + item.children.length;
            item.children.forEach(child => {
                numberOfVisibleChildren = numberOfVisibleChildren + this.countVisibleChildren(child);
            });
        }

        return numberOfVisibleChildren;
    }

    countChildren = ( item ) => {
        let numberOfChildren = 0;
        if ( item.children ) {
            numberOfChildren = numberOfChildren + item.children.filter(x => {
                const isGRP = x.code && x.code.startsWith('GRP');
                return !isGRP;
            }).length;
            item.children.forEach(child => {
                numberOfChildren = numberOfChildren + this.countChildren(child);
            });
        }

        return numberOfChildren;
    }

    render() {

        const { root, isHorizontal } = this.props;

        const getChildren = (parentCode) => {

            /* we get the kids of the parent */
            const children = BaseEntityQuery.getLinkedBaseEntities(parentCode, "LNK_CORE");
            if(children && children.length > 0) {

                /* we get the kids of the kids */
                children.forEach(child => {
                    child.children = getChildren(child.code);
                    const imageAttribute = BaseEntityQuery.getBaseEntityAttribute(child.code, 'PRI_IMAGE_URL');
                    if(imageAttribute != null && child.code && child.code.startsWith('GRP_')) {
                        child.icon = imageAttribute.value;
                    }
                    child.visibleChildren = this.countVisibleChildren(child);
                    child.childCount = this.countChildren(child);
                    //child.childCount = child.links ? child.links.length : null;
                    child.open = !!this.state.tree[child.code];
                    //console.log(child.childCounts, child.childCount);
                    return child;
                });
            }

            /* we set up the kids */

            return children;
        };

        let items = root
            ? getChildren(root)
            : [];

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
