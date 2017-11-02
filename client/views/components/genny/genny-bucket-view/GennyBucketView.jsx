import './gennyBucketView.scss';
import React, { Component } from 'react';
import BaseEntityQuery from './../../../../utils/genny/BaseEntityQuery';
import { IconSmall, BucketView, Card } from '../../';
import { Draggable } from 'react-beautiful-dnd';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyBucketView extends Component {

    static defaultProps = {
    }

    static propTypes = {
    };

    state = {

    }

    didMoveItem = (item, source, destination) => {

        console.log(source);
        console.log(item);
        console.log(destination);
    }

    generateBucket(query, group) {

        let groupCode = group.code;
        let children = [];

        let bes = query.getEntityChildren(groupCode);

        bes.forEach(be => {

            // we get the sublayout code from the BE
            let layout_code = "SUBLAY_1";
            let sublayout = this.props.sublayout[layout_code] ? this.props.sublayout[layout_code].value : null;

            if(sublayout) {
                console.log("PUSHING SUBLAYOUT");
                console.log(sublayout);
            }
            else {
                console.log(this.props.sublayout);
            }

            children.push(
                {
                content: (
                    <Card title={be.name} description={be.code}>
                        {
                            // sublayout ? <LayoutLoader layout={sublayout} /> : null
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
