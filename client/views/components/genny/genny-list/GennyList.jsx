import './gennyList.scss';
import React, { Component } from 'react';
import { object, string } from 'prop-types';
import { List, GennyForm, } from '../../';
import { BaseEntityQuery } from 'utils/genny';

class GennyList extends Component {

    static defaultProps = {
        root: '',
    }


    static propTypes = {
        root: string
    };

    state = {
    }

    render() {

        const { root } = this.props;
        let items = BaseEntityQuery.getEntityChildren(root);

        return (
            <div className="genny-list">
                <List header={ <GennyForm isHorizontal /> }>
                    {items}
                </List>
            </div>
        );
    }
}

export default GennyList;
