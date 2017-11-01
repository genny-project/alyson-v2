import './gennyBucketView.scss';
import React, { Component } from 'react';
import BaseEntityQuery from './../../../../utils/genny/BaseEntityQuery';
import { IconSmall, BucketView, Card } from '../../';

class GennyBucketView extends Component {

    static propTypes = {
    };

    state = {

    }

    generateBucket(query, group) {

        // group = {code: GRP_NO_QUOTES, name: "No quotes"}
        let groupCode = group.code;
        return [(
            <div>{groupCode}</div>
        )]
    }

    generateBuckets(query, groups) {

        // groups = [{code: GRP_NO_QUOTES, name: "No quotes"}, ....]
        return groups.map(group => {

            console.log("=========");
            console.log(group);
            return {
                title: group.name
            }
        });
    }

    generateBucketView = (root) => {

        let query = new BaseEntityQuery(this.props);
        let rootGroups = query.getEntityChildren(root);
        let buckets = rootGroups.map(groups => this.generateBucket(query, groups));

        console.log(rootGroups);
        console.log(buckets);
        return buckets;
    }

    render() {

        const { root } = this.props;
        let buckets = this.generateBucketView(root);

        return (
            <div className="genny-bucket-view">
                <BucketView buckets={buckets} />
            </div>
        );
    }
}

export default GennyBucketView;
