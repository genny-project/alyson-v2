import './gennyBreadcrumbs.scss';
import React, { Component } from 'react';
import { object, array } from 'prop-types';
import BaseEntityQuery from './../../../../utils/genny/BaseEntityQuery';
import { Breadcrumbs, } from '../../';
import { GennyBridge } from 'utils/genny';
import store from 'views/store';

class GennyBreadcrumbs extends Component {

    static propTypes = {
    };

    state = {
        items: {}
    }

    onClick = (clickedItem) => {

        let item = this.state.items[clickedItem];

        // update the current path within the store.
        let parentCode = item.parentCode;
        let bes = store.getState().baseEntity.data;

        let path = "/" + item.code;
        let currentPath = item.name;

        // we lookup for the Be corresponding to the parentCode and check if it has a parent.
        // for each parent we find we keep looping through the parent codes.
        // effectively, we are building the current path starting from the end.
        while(parentCode != null) {

            if(bes[parentCode]) {

                path = "/" + bes[parentCode].code + path;
                parentCode = bes[parentCode].parentCode;
            }
            else {

                parentCode = null; // force exit as parent was not found.
            }
        }

        // update the current path
        store.getState().app.currentPath = path;

        GennyBridge.sendTVEvent('TV_SELECT', {
            code: 'TV1',
            value: item.code
        }, item.code);

    }

    generatePath = (baseEntityPath) => {

        if(!baseEntityPath) return "";

        let finalPath = "";
        let besCode = baseEntityPath.split('/');
        besCode.forEach((be_code) => {

            if(be_code && be_code.length > 0) {

                let be = this.props.baseEntity.data[be_code];
                finalPath += "/" + be.name;
                this.state.items[be.name] = be;
            }
        });

        return finalPath;
    }

    render() {

        const { root, showBaseEntity, currentPath } = this.props;
        let query = new BaseEntityQuery(this.props);
        let path = this.generatePath(currentPath);

        return (
            <Breadcrumbs {...this.props} currentPath={ path } onClick={ this.onClick } />
        );
    }
}

export default GennyBreadcrumbs;
