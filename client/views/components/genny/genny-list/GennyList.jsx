import './gennyList.scss';
import React, { Component } from 'react';
import { string, number, bool, object } from 'prop-types';
import { List, GennyForm } from 'views/components';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyList extends Component {

    static defaultProps = {
        root: '',
        showLinks: false,
        hideHeader: false,
        showEmpty: true,
        showTitle: false,
        showSearchBar: true,
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
        headerRoot: string,
        showTitle: bool,
        showSearchBar: bool,
        gennyListStyle: object
    };

    state = {
    }

    generateListItems(data) {

        const {localAliases, selectedItem, root} = this.props;

        let newData = [];

        data.map((item, index) => {

            let linkToParent = BaseEntityQuery.getLinkToParent(root, item.code);
            if(linkToParent) {

                const isSelected = selectedItem == item.code ? true : false;
                const aliasProp = localAliases != null && localAliases.constructor == Array ? localAliases[index] : localAliases;
                let layout_code = linkToParent.linkValue != null && linkToParent.linkValue != "LINK" ? linkToParent.linkValue : 'list_item';
                let sublayout = this.props.sublayout[layout_code];
                item['layout'] = <LayoutLoader layout={sublayout} aliases={{BE: item.code, ROOT: root, ITEMCODE: item.code, ...aliasProp}}/>;
                item['rootCode'] = root;
                item['isSelected'] = isSelected;
                newData.push(
                    item
                );
            }
            return false;
        });

        console.log( newData )
        return newData;
    }

    render() {

        const { root, showLinks, headerRoot, hideHeader, hideLinks, showTitle, showEmpty, gennyListStyle, ...rest } = this.props;
        const componentStyle = { ...gennyListStyle};

        const data = showLinks ? BaseEntityQuery.getBaseEntitiesForLinkCode(root, hideLinks) : BaseEntityQuery.getEntityChildren(root);

        const rootEntity = BaseEntityQuery.getBaseEntity(root);
        const projectCode = GennyBridge.getProject();
        let projectColor = BaseEntityQuery.getBaseEntityAttribute(projectCode, 'PRI_COLOR');
        projectColor = projectColor ? projectColor.value : null;

        if (showEmpty || !showEmpty && data && data.length > 0 ) {
            return (
                <div className='genny-list' style={componentStyle}>
                    { showTitle ?
                        <div style={{ backgroundColor: projectColor}} className='genny-list-title'>
                            <h2>{rootEntity && rootEntity.name} ( {data && data.length} )</h2>
                        </div>
                    : null }
                    <List
                        header={ headerRoot && !hideHeader ? <GennyForm root={headerRoot} isHorizontal /> : null }
                        hideCount
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
