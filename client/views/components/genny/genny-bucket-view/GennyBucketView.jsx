import './gennyBucketView.scss';
import React, { Component } from 'react';
import BaseEntityQuery from './../../../../utils/genny/BaseEntityQuery';
import { IconSmall, BucketView, Card } from '../../';
import { Draggable } from 'react-beautiful-dnd';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { GennyBridge } from 'utils/genny';

class GennyBucketView extends Component {

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

        if(item.draggableId) {

            let query = new BaseEntityQuery(this.props);
            let begs = query.getEntityChildren(source.droppableId);
            if(begs.length > 0) {

                let movedBeg = begs.filter(x => x.code == item.draggableId)[0];
                let loads = movedBeg.children;
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

    generateBucket(query, group) {

        let groupCode = group.code;
        let children = [];

        let bes = query.getEntityChildren(groupCode);

        bes.forEach(be => {

            // we get the sublayout code from the BE
            let layout_code = "SUBLAY_1";
            let sublayout = this.props.sublayout[layout_code];

            children.push(
                {
                content: (
                    <Card title={be.name} description={be.code}>
                        {
                            sublayout ? <LayoutLoader layout={sublayout} /> : null
                        }
                    </Card>
                ),
                id: be.code
                }
            );
        });

        return children;
    }

    generateBuckets(root) {

        let buckets = [];
        let query = new BaseEntityQuery(this.props);
        let rootGroups = query.getEntityChildren(root);
        rootGroups.forEach(group => {

            buckets.push({
                title: group.name,
                id: group.code,
                children: this.generateBucket(query, group)
            });
        });

        return buckets;
    }

    render() {

        const { root } = this.props;
        let buckets = this.generateBuckets(root);

        return (
            <div className="genny-bucket-view">
                <BucketView buckets={buckets} didMoveItem={this.didMoveItem} />
            </div>
        );
    }
}

export default GennyBucketView;
