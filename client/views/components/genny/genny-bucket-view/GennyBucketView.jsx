import './gennyBucketView.scss';
import React, { Component } from 'react';
import { object, array } from 'prop-types';
import BaseEntityQuery from './../../../../utils/genny/BaseEntityQuery';
import { IconSmall, BucketView } from '../../';
import { GennyBridge } from 'utils/genny';

class GennyBucketView extends Component {

    static propTypes = {
    };

    state = {
    }

    render() {

        const { root, showBaseEntity } = this.props;

        let query = new BaseEntityQuery(this.props);
        //let children = query.getEntityChildren(root);

        return (
            <div className="genny-bucket-view">
                <BucketView {...this.props} />
            </div>
        );
    }
}

export default GennyBucketView;
