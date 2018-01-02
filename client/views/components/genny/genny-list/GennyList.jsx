import './gennyList.scss';
import React, { Component } from 'react';
import { object, string, number, bool } from 'prop-types';
import { List, GennyForm } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyList extends Component {

    static defaultProps = {
        root: '',
        showLinks: false,
        hideHeader: false,
    }

    static propTypes = {
        root: string,
        itemHeight: number,
        itemWidth: number,
        itemGap: number,
        listGap: number,
        rowsVisible: number,
        showLinks: bool,
        hideHeader: bool,
    };

    state = {
    }

    generateListItems(data) {

        return data.map(item => {

            let linkToParent = BaseEntityQuery.getLinkToParent(this.props.root, item);
            if(linkToParent) {

                let layout_code = linkToParent.linkValue || "listLayout";
                let sublayout = this.props.sublayout[layout_code];
                item['layout'] = <LayoutLoader layout={sublayout} aliases={{BE: item.code, ROOT: this.props.root, ITEMCODE: item.code}}/>;
                return item;
            }
            
            return false;
        });
    }  

    render() {

        const { root, showLinks, hideHeader, ...rest } = this.props;
        
        let data = showLinks ? BaseEntityQuery.getBaseEntitiesForLinkCode(root) : BaseEntityQuery.getEntityChildren(root);
    
        return (
            <div className="genny-list">
                <List 
                    header={ hideHeader ? null : <GennyForm root='' isHorizontal /> }
                    data={ this.generateListItems(data) }
                    {...rest}
                />
            </div>
        );
    }
}

export default GennyList;
