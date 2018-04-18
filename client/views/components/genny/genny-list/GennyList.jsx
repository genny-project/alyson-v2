import './gennyList.scss';
import React, { Component } from 'react';
import { string, number, bool, object, array } from 'prop-types';
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
        hideNav: false,
        numberOfItems: 1,
    }

    static propTypes = {
        root: string,
        itemHeight: number,
        itemWidth: number,
        itemGap: number,
        listGap: number,
        rowsVisible: number,
        showLinks: array,
        hideLinks: array,
        showEmpty: bool,
        hideHeader: bool,
        sublayout: object,
        headerRoot: string,
        showTitle: bool,
        showSearchBar: bool,
        gennyListStyle: object,
        numberOfItems: number,
    };

    state = {
    }

    handleClick = (listItemProps) => {
        let btnValue = {
            hint: listItemProps.rootCode,
            itemCode: listItemProps.code,
            userCode: GennyBridge.getUser()
        };
        btnValue = JSON.stringify(btnValue);

        GennyBridge.sendBtnClick('BTN_CLICK', {
            code: 'BTN_SEE_CONVERSATION',
            value: btnValue
        });

        this.setState({
            selectedItem: listItemProps.code,
        });
    }

    generateListItems(data) {

        const { localAliases, selectedItem, root, numberOfItems } = this.props;

        let newData = [];
        if(data.length == 0) return [];
        newData = data.map((item, index) => {

            if(item) {

                let linkToParent = BaseEntityQuery.getLinkToParent(root, item.code);
                if(linkToParent) {

                    //console.log(item);

                    const isSelected = selectedItem == item.code ? true : false;
                    //TODO: alias prop should have a value that matches the item code to match them correctly
                    const aliasProp = localAliases != null && localAliases.constructor == Array ? localAliases[index] : localAliases;
                    let layout_code = linkToParent.linkValue != null && linkToParent.linkValue != 'LINK' ? linkToParent.linkValue : 'list_item';
                    let sublayout = this.props.sublayout[layout_code];
                    item['layout'] = <LayoutLoader layout={sublayout} aliases={{BE: item.code, ROOT: root, ITEMCODE: item.code, ...aliasProp}}/>;
                    item['rootCode'] = root;
                    item['isSelected'] = isSelected;
                    return item;
                }
            }

            return false;

        });
        //console.log( newData );
        return newData;
    }

    render() {

        const { root, showLinks, headerRoot, hideHeader, hideNav, hideLinks, showTitle, showEmpty, gennyListStyle, ...rest } = this.props;
        const componentStyle = { ...gennyListStyle};

        let data = [];

        if(showLinks === true) {
            data = BaseEntityQuery.getBaseEntitiesForLinkCode(root, 'hide', hideLinks);
        }
        else if(showLinks.constructor == Array) {
            data = BaseEntityQuery.getBaseEntitiesForLinkCode(root, 'show', showLinks);       
        }
        else if(showLinks == null || showLinks == false) {
            data = BaseEntityQuery.getEntityChildren(root);
        }

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
                        hideNav={hideNav}
                        data={ this.generateListItems(data) }
                        showEmpty={showEmpty}
                        onItemClick={this.handleClick}
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
