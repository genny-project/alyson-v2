import './gennyList.scss';
import React, { Component } from 'react';
import { string, number, bool, object } from 'prop-types';
import { List, GennyForm } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyList extends Component {

    static defaultProps = {
        root: '',
        showLinks: false,
        hideHeader: false,
        showEmpty: false,
    }

    static propTypes = {
        root: string,
        itemHeight: number,
        itemWidth: number,
        itemGap: number,
        listGap: number,
        rowsVisible: number,
        showLinks: bool,
        showEmpty: bool,
        hideHeader: bool,
        sublayout: object,
        headerRoot: string
    };

    state = {
    }

    generateListItems(data) {

        return data.map(item => {

            let linkToParent = BaseEntityQuery.getLinkToParent(this.props.root, item.code);
            if(linkToParent) {

                const isSelected = this.props.selectedItem == item.code ? true : false;
                let layout_code = linkToParent.linkValue || 'list_item';
                let sublayout = this.props.sublayout[layout_code];
                item['layout'] = <LayoutLoader layout={sublayout} aliases={{BE: item.code, ROOT: this.props.root, ITEMCODE: item.code, ...this.props.localAliases}}/>;
                item['rootCode'] = this.props.root;
                item['isSelected'] = isSelected;
                return item;
            }

            return false;
        });
    }

    render() {

        const { root, showLinks, headerRoot, hideHeader, hideLinks, showEmpty, ...rest } = this.props;

        let data = showLinks ? BaseEntityQuery.getBaseEntitiesForLinkCode(root, hideLinks) : BaseEntityQuery.getEntityChildren(root);

        if (showEmpty || !showEmpty && data.length > 0 ) {
            return (
                <div className="genny-list">
                    <List
                        header={ headerRoot && !hideHeader ? <GennyForm root={headerRoot} isHorizontal /> : null }
                        data={ this.generateListItems(data) }
                        {...rest}
                    />
                </div>
            );
        }
        else {
            return null;
        }
    }
}

export default GennyList;
