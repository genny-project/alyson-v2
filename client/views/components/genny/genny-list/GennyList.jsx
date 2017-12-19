import './gennyList.scss';
import React, { Component } from 'react';
import { object, string, number } from 'prop-types';
import { List, GennyForm } from '../../';
import { BaseEntityQuery } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyList extends Component {

    static defaultProps = {
        root: '',
    }

    static propTypes = {
        root: string,
        itemHeight: number,
        itemWidth: number,
        itemGap: number,
        listGap: number,
        rowsVisible: number
    };

    state = {
    }

    generateListItems(data) {

        return data.map(item => {

            //TODO : get layout code from BE

            //let layout_code = BaseEntityQuery.getBaseEntityAttribute(be, "PRI_LAYOUT");
            //layout_code = layout_code ? layout_code.value : null;

            let layout_code = 'listLayout';
            let sublayout = this.props.sublayout[layout_code]; 

            item['layout'] = <LayoutLoader layout={sublayout} />;
            
            return item;
        });
    }  

    render() {

        const { root, ...rest } = this.props;
        let data = BaseEntityQuery.getEntityChildren(root);
        console.log({...rest});
        return (
            <div className="genny-list">
                <List 
                    header={ <GennyForm isHorizontal /> }
                    data={ this.generateListItems(data) }
                    {...rest}
                />
            </div>
        );
    }
}

export default GennyList;
