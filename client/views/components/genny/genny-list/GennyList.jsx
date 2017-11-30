import './gennyList.scss';
import React, { Component } from 'react';
import { object, string } from 'prop-types';
import { List, GennyForm, ListItem } from '../../';
import { BaseEntityQuery } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyList extends Component {

    static defaultProps = {
        root: '',
    }


    static propTypes = {
        root: string
    };

    state = {
    }

    generateListItems(items) {

        let children = [];
        
        items.map(item => {

            console.log('item', item);

            //let layout_code = (item.attributes["PRI_LAYOUT"] ? item.attributes["PRI_LAYOUT"].value : null);
            let layout_code = 'listLayout';
            let sublayout = this.props.sublayout[layout_code]; 

            children.push(
                <ListItem>
                    {
                        sublayout ? <LayoutLoader layout={sublayout} /> : null
                    }
                </ListItem>
            );
        });
        return children
    }  

    render() {

        const { root } = this.props;
        let items = BaseEntityQuery.getEntityChildren(root);

        let children = this.generateListItems(items);

        return (
            <div className="genny-list">
                <List header={ <GennyForm isHorizontal /> }>
                    {children}
                </List>
            </div>
        );
    }
}

export default GennyList;
