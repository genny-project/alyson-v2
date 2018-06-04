import './gennyList.scss';
import React, { Component } from 'react';
import { string, number, bool, object, array, func } from 'prop-types';
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
        numberOfItems: 4,
        emptyMessage: 'No data to display.'
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
        onClick: func,
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
            code: 'SELECT_EVENT',
            value: btnValue
        });

        this.setState({
            selectedItemState: listItemProps.code,
        });

        if (this.props.onClick) this.props.onClick();
    }

    generateListItems(data) {

        const { localAliases, selectedItem, root, numberOfItems, hideSelectedStyle } = this.props;
        const { selectedItemState } = this.state;

        let newData = [];
        console.log( data );

        if(data.length == 0) return [];

        newData = data.map((item, index) => {

            if(item) {

                console.log( item );
                let linkToParent = BaseEntityQuery.getLinkToParent(root, item.code);
                console.log('link between: ', root, ' and: ', item.code);

                if(linkToParent) {

                    const isSelected = selectedItemState == item.code || selectedItem == item.code ? true : false;

                    //TODO: alias prop should have a value that matches the item code to match them correctly
                    const aliasProp = localAliases != null && (localAliases.constructor == Array ? localAliases[index] : localAliases);

                    let layout_code = null;
                    let linkLinkValue = null;
                    let linkValue = null;

                    if(linkToParent != null && linkToParent.link != null && linkToParent.link.linkValue != null) {
                        linkLinkValue = linkToParent.link.linkValue;
                    }
                    
                    if(linkToParent != null && linkToParent.linkValue != null) {
                        linkValue = linkToParent.linkValue;
                    }
                    else {
                        layout_code = 'list_item';
                    }

                    if(linkLinkValue != null && linkValue != null) {
                        if(linkLinkValue == "LINK") {
                            layout_code = linkValue;
                        }
                        else {
                            layout_code = linkLinkValue;
                        }
                    }
                    else {
                        layout_code = linkLinkValue || linkValue;
                    }

                    let sublayout = this.props.sublayout[layout_code];
                    item['layout'] = <LayoutLoader layout={sublayout} aliases={{BE: item.code, ROOT: root, ITEMCODE: item.code, ...aliasProp}}/>;
                    item['rootCode'] = root;
                    item['isSelected'] = isSelected && !hideSelectedStyle;

                    return item;
                }
            }

            return false;

        });
        //console.log( newData );
        return newData;
    }

    render() {

        const { root, showLinks, headerRoot, hideHeader, hideNav, hideLinks, showTitle, showEmpty, gennyListStyle, emptyMessage, ...rest } = this.props;
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

        data = [...new Set(data)];

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
                        emptyMessage={emptyMessage}
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
