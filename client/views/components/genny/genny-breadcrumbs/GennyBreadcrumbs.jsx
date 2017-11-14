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
    }

    onClick = (item) => {
        console.log(item);
    }

    render() {

        const { root, showBaseEntity, currentPath } = this.props;
        let query = new BaseEntityQuery(this.props);

        return (
            <Breadcrumbs {...this.props} currentPath={ currentPath } />
        );
    }
}

export default GennyBreadcrumbs;
