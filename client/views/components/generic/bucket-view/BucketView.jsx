import './bucketView.scss';
import React, { Component } from 'react';
import { array, object, any } from 'prop-types';

class BucketView extends Component {

    static propTypes = {
        buckets: array,
        style: object,
        children: any,
    };

    renderBucket(bucket) {

        return (
            <div key={bucket.title} className="bucket-contents">
                {bucket.children}
            </div>
        );
    }

    render() {

        const { buckets, style } = this.props;

        return (
            <div className="bucket-view" style={style}>
                {
                    buckets.map(( bucket, i ) => (

                        <div className="bucket" key={bucket.title}>
                            <div className="bucket-title sticky">
                                {bucket.title}
                            </div>
                            <div className="bucket-content">
                                {this.renderBucket(bucket)}
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default BucketView;
