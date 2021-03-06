import './gennyBucketView.scss';
import React, { PureComponent } from 'react';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';

import { bool, string } from 'prop-types';
import { IconSmall, BucketView, Card } from 'views/components';
import { Draggable } from 'react-beautiful-dnd';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyBucketView extends PureComponent {

    static defaultProps = {
        allowItemClick: false,
        useLinkValueForLayout: false,
        selectedColor: '#333',
    }

    static propTypes = {
        allowItemClick: bool,
        useLinkValueForLayout: bool,
        itemLayout: string,
        selectedColor: string,
        hideSelectedStyle: bool,
    };

    state = {
        selectedItemState: null,
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

                let itemValue = group.attributes['ADD_ITEM'].value;
                let data = {
                    code: group.code,
                    value: itemValue,
                };
                GennyBridge.sendBtnClick('BTN_CLICK', data);
                break;
            }
        }
    }

    handleClick = (bucketItemProps) => {
        if (this.props.allowItemClick) {
            const isSelected = this.state.selectedItemState === bucketItemProps.code;

            let btnValue = {
                hint: bucketItemProps.rootCode,
                itemCode: bucketItemProps.description,
                userCode: GennyBridge.getUser()
            };

            btnValue = JSON.stringify(btnValue);
            GennyBridge.sendBtnClick('BTN_CLICK', {
                code: `${isSelected ? 'DE' : ''}SELECT_EVENT`,
                value: btnValue
            });

            this.setState({
                selectedItemState: isSelected ? null : bucketItemProps.code,
            }, () => {
                if (this.props.onClick) this.props.onClick();
            });
        }
    }

    generateBucket(group) {

        let groupCode = group.code;
        let children = [];

        let bes = BaseEntityQuery.getEntityChildren(groupCode);

        // console.log(bes);
        
        bes.forEach((be, index)  => {

            const { itemLayout, useLinkValueForLayout, selectedColor, hideSelectedStyle } = this.props;

            let linkToParent = BaseEntityQuery.getLinkToParent(groupCode, be.code);

            let layout_code = itemLayout || 'card';
            let linkLinkValue = null;
            let linkValue = null;

            if ( useLinkValueForLayout ) {
                if(linkToParent != null && linkToParent.link != null && linkToParent.link.linkValue != null) {
                    linkLinkValue = linkToParent.link.linkValue;
                }

                if(linkToParent != null && linkToParent.linkValue != null) {
                    linkValue = linkToParent.linkValue;
                }

                if(linkLinkValue != null && linkValue != null) {
                    if(linkLinkValue == 'LINK') {
                        layout_code = linkValue;
                    }
                    else {
                        layout_code = linkLinkValue;
                    }
                }

                if ( itemLayout != null && typeof itemLayout === 'string' && itemLayout.length > 0 ) {
                    layout_code = itemLayout;
                }
            }

            let sublayout = this.props.sublayout[layout_code];

            const isSelected = this.state.selectedItemState === be.code;

            let global_status = 'orange';
            let user_status = null;

            let attributes = be.attributes;
            if( attributes != null ) {

                const userCode = GennyBridge.getUser();

                const attributeKeys = Object.keys(attributes);
                for (var i = 0; i < attributeKeys.length; i++) {

                  let attribute_key = attributeKeys[i];

                  /* we check for a specific user status */
                  if(attribute_key.startsWith('STA') && attribute_key.indexOf(userCode) > -1) {
                      user_status = attributes[attribute_key].value;
                  }

                  /* we check for a global status */
                  if(attribute_key == 'STA_STATUS') {
                      global_status = attributes[attribute_key].value || global_status;
                  }
                }
            }
    
            const statusColor =  user_status || global_status;
            let statusNumber = 1;

            switch (statusColor) {

                case "red":
                case "warning":
                    statusNumber = 1
                break;

                case "orange":
                case "warning":
                    statusNumber = 2
                break;

                default: statusNumber = 3;
            };


            children.push(
                {
                content: {
                    title: be.name,
                    description: be.code,
                    code: be.code,
                    isSelected: isSelected,
                    selectedColor: hideSelectedStyle ? null : selectedColor,
                    screenSize: this.props.screenSize,
                    onClick: this.onClick,
                    layout: <LayoutLoader layout={sublayout} aliases={{BE: be.code, ROOT: group.code}}/>,
                    created: be.created,
                    rootCode: group.code,
                    status: statusNumber,
                    // todo get weight
                    weight: index,
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
        // console.log(rootGroups);
        rootGroups.forEach(group => {

            let canAddItem = false;
            if(group.attributes) {
                canAddItem = Object.keys(group.attributes).filter(x => x == 'ADD_ITEM').length > 0;
            }

            //get legend text
            let legendValues = {};
            if (group.attributes) {
                if (group.attributes.PRI_LEGEND_GREEN) {
                    legendValues['green'] = group.attributes.PRI_LEGEND_GREEN.value;
                }
                if (group.attributes.PRI_LEGEND_ORANGE) {
                    legendValues['orange'] = group.attributes.PRI_LEGEND_ORANGE.value;
                }
                if (group.attributes.PRI_LEGEND_RED) {
                    legendValues['red'] = group.attributes.PRI_LEGEND_RED.value;
                }
            }

            buckets.push({
                title: group.name,
                id: group.code,
                children: this.generateBucket(group),
                weight: group.weight,
                canAddItem: canAddItem,
                legend: legendValues,
            });
        });
        // console.log(buckets);

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
                    addNewItem={this.addNewItem}
                    onItemClick={this.handleClick}
                />
            </div>
        );
    }
}

export default GennyBucketView;
