import './gennyList.scss';
import React, { Component } from 'react';
import { object, string, number, bool } from 'prop-types';
import { List, GennyForm } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyList extends Component {

    static defaultProps = {
        root: '',
        showLinks: false
    }

    static propTypes = {
        root: string,
        itemHeight: number,
        itemWidth: number,
        itemGap: number,
        listGap: number,
        rowsVisible: number,
        showLinks: bool
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
            item['layout'] = <LayoutLoader layout={sublayout} aliases={{BE: item.code, ROOT: this.props.root, ITEMCODE: item.code}}/>;
        
            return item;
        });
    }  

    render() {

        const { root, showLinks, ...rest } = this.props;
        
        let data = showLinks ? BaseEntityQuery.getBaseEntitiesForLinkCode(root) : BaseEntityQuery.getEntityChildren(root);
    
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
