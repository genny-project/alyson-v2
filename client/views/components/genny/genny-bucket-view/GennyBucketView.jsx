import './gennyBucketView.scss';
import React, { PureComponent } from 'react';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { IconSmall, BucketView, Card } from 'views/components';
import { Draggable } from 'react-beautiful-dnd';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyBucketView extends PureComponent {

    static defaultProps = {

    }

    static propTypes = {

    };

    state = {
    }

    constructor(props) {
        super(props);
    }

    didMoveItem = (item, source, destination) => {

        if(item.draggableId && source.droppableId) {

            let begs = BaseEntityQuery.getEntityChildren(source.droppableId);
            if(begs.length > 0) {

                let movedBeg = begs.filter(x => x.code == item.draggableId)[0];
                let loads = movedBeg ? movedBeg.children : null;
                if(loads && loads.length > 0) {

                    let movedLoad = loads[0];
                    let loadCode = movedLoad.code;
                    let linkCode = movedBeg.linkCode;
                    let data_event = {
                        sourceBaseEntityCode: source.droppableId,
                        targetBaseEntityCode: destination.droppableId,
                        linkCode: linkCode,
                        data: {
                            code: item.draggableId,
                            value: loadCode,
                        }
                    };

                    GennyBridge.sendBucketDropEvent(data_event);
                }
            }
        }
    }

    addNewItem = (selectedColumn) => {

        let { root } = this.props;
        let rootGroups = BaseEntityQuery.getEntityChildren(root);
        for (var i = 0; i < rootGroups.length; i++) {
            let group = rootGroups[i];
            if(group.code == selectedColumn) {

                let itemValue = group.attributes["ADD_ITEM"].value;
                let data = {
                    code: group.code,
                    value: itemValue,
                }
                GennyBridge.sendBtnClick("BTN_CLICK", data);
                break;
            }
        }
    }

    onClick = (item) => {

        //TODO: to be changed.
        // let itemValue = item.props.description;
        // if(itemValue) {
        //     let data = {
        //         code: "LOAD_CLICK",
        //         value: itemValue,
        //     }
        //
        //     GennyBridge.sendBtnClick(data);
        // }
    }

    generateBucket(group) {

        let groupCode = group.code;
        let children = [];

        let bes = BaseEntityQuery.getEntityChildren(groupCode);

        bes.forEach(be => {

            // we get the sublayout code from the BE

            //TODO : get layout code from BE
            //let layout_code = BaseEntityQuery.getBaseEntityAttribute(be, "PRI_LAYOUT");
            //layout_code = layout_code ? layout_code.value : null;

            let linkToParent = BaseEntityQuery.getLinkToParent(group.code, be.code);

            let color = linkToParent ? this.getBaseEntityColor(linkToParent.link) : null;

            let layout_code = 'card';

            let sublayout = this.props.sublayout[layout_code];

            children.push(
                {
                content: {
                    title: be.name,
                    description: be.code,
                    screenSize: this.props.screenSize,
                    onClick: this.onClick,
                    layout: <LayoutLoader layout={sublayout} aliases={{BE: be.code, ROOT: group.code}}/>,
                    backgroundColor: color
                },
                id: be.code
                }
            );
        });

        return children;
    }

    generateBuckets(root) {

        let buckets = [];
        let rootGroups = BaseEntityQuery.getEntityChildren(root);
        rootGroups.forEach(group => {

            let canAddItem = false;
            if(group.attributes) {
                canAddItem = Object.keys(group.attributes).filter(x => x == "ADD_ITEM").length > 0;
            }

            buckets.push({
                title: group.name,
                id: group.code,
                children: this.generateBucket(group),
                weight: group.weight,
                canAddItem: canAddItem
            });
        });

        return buckets;
    }

    getBaseEntityColor = (link) => {

        if(!link) return;

        if( link.rule == 'override:parent' || !link.rule ) {
            return link.parentColor;
        } else if ( link.rule == 'override:child' ) {
            return link.childColor;
        }
    }

    render() {

        const { root } = this.props;

        let buckets = this.generateBuckets(root);

        return (
            <div className="genny-bucket-view">
                <BucketView
                    screenSize={window.getScreenSize()}
                    buckets={buckets}
                    didMoveItem={this.didMoveItem}
                    addNewItem={this.addNewItem} />
            </div>
        );
    }
}

export default GennyBucketView;
