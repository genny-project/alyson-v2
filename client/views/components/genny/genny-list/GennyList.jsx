import './gennyList.scss';
import React, { Component } from 'react';
import { object, array } from 'prop-types';
import { List, GennyForm, } from '../../';

class GennyList extends Component {

    static defaultProps = {
        items: [
            <div>one</div>,
            <div>two</div>,
            <div>three</div>,
            <div>four</div>,
            <div>five</div>,
            <div>six</div>,
            <div>seven</div>,
            <div>eight</div>,
            <div>nine</div>,
            <div>ten</div>,
            <div>eleven</div>,
            <div>twelve</div>,
        ],
    }

      
    static propTypes = {
        items: array
    };

    state = {
    }

    render() {

        const { root, items } = this.props;

        return (
            <div className="genny-list">
                <List header={
                    <GennyForm isHorizontal />
                }>
                    {items}
                </List>
            </div>
        );
    }
}

export default GennyList;
