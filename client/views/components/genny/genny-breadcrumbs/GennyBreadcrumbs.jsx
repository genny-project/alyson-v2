import './gennyBreadcrumbs.scss';
import React, { Component } from 'react';
import { object, array } from 'prop-types';
import BaseEntityQuery from './../../../../utils/genny/BaseEntityQuery';
import { Breadcrumbs, } from '../../';
import { GennyBridge } from 'utils/genny';

class GennyBreadcrumbs extends Component {

    static propTypes = {
    };

    state = {
        pathItems: [],
    }

    onClick = (item) => {
        console.log(item);
    }

    render() {

        const { root, showBaseEntity } = this.props;
        const { pathItems } = this.state;
        let query = new BaseEntityQuery(this.props);

        return (
            <Breadcrumbs {...this.props} pathItems={pathItems} />
        );
    }
}

export default GennyBreadcrumbs;
