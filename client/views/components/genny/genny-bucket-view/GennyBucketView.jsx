import './gennyBucketView.scss';
import React, { Component } from 'react';
import BaseEntityQuery from './../../../../utils/genny/BaseEntityQuery';
import { IconSmall, BucketView, Card } from '../../';
import { Draggable } from 'react-beautiful-dnd';

class GennyBucketView extends Component {

    static propTypes = {
    };

    state = {

    }

    generateBucket(query, group) {

        let groupCode = group.code;
        let children = [];

        let bes = query.getEntityChildren(groupCode);
        bes.forEach(be => {

            children.push(
                <Draggable key={be.id} draggableId={be.id}>
                    {(provided, snapshot) => (

                        <Card title={be.name} description={be.code} ref={provided.innerRef} {...provided.dragHandleProps}>
                            {provided.placeholder}
                            <p>Ho hello Adam</p>
                        </Card>

                  )}

                </Draggable>
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
                <BucketView buckets={buckets} />
            </div>
        );
    }
}

export default GennyBucketView;
