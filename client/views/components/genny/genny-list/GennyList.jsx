import './gennyList.scss';
import React, { Component } from 'react';
import { object, string } from 'prop-types';
import { List, GennyForm } from '../../';
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

    generateListItems(data) {

        return data.map(item => {

            let layout_code = 'listLayout';
            let sublayout = this.props.sublayout[layout_code]; 

            item['layout'] = <LayoutLoader layout={sublayout} />;
            
            return item;
        });
    }  

    render() {

        const { root } = this.props;
        let data = BaseEntityQuery.getEntityChildren(root);
        
        return (
            <div className="genny-list">
                <List 
                    header={ <GennyForm isHorizontal /> }
                    data={ this.generateListItems(data) }
                />
            </div>
        );
    }
}

export default GennyList;
