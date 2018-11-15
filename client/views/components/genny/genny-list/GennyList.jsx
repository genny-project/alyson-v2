import './gennyList.scss';
import React, { Component } from 'react';
import { string, number, bool, object, array, func } from 'prop-types';
import { List, GennyForm, IconSmall } from 'views/components';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';
import dlv from 'dlv';
import moment from 'moment';

class GennyList extends Component {

    static defaultProps = {
        root: '',
        showLinks: false,
        hideHeader: false,
        showEmpty: true,
        showTitle: true,
        showSearchBar: true,
        hideNav: false,
        numberOfItems: 4,
        emptyMessage: 'No data to display.',
        selectedColor: '#333',
        sortField: 'created',
        hideFilters: false,
        filterField: 'name',
        placeholder: 'Search ',
        shouldSelectFirstItemOnMount: true,
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
        hideSelectedStyle: bool,
        selectedColor: string,
        selectedItem: string,
        title: string,
        itemLayout: string,
        sortField: string,
        reverseSortDirection: bool,
        filterField: string,
        placeholder: string, 
        shouldSelectFirstItemOnMount: bool,
    };

    state = {
        isFirstItemSelected: false,
    }

    handleClick = (listItemProps) => {
        if (listItemProps) {
            const isSelected = listItemProps.code === this.state.selectedItemState;

            let btnValue = {
                hint: listItemProps.rootCode,
                itemCode: listItemProps.code,
                userCode: GennyBridge.getUser()
            };

            btnValue = JSON.stringify(btnValue);

            GennyBridge.sendBtnClick('BTN_CLICK', {
                code: `${isSelected ? 'DESELECT_EVENT' : 'SELECT_EVENT'}`,
                value: btnValue
            });

            this.setState({
                selectedItemState: isSelected ? null : listItemProps.code,
            });

            if (this.props.onClick) this.props.onClick();
        }
    }

    handleDeselect = () => {
        const rootEntity = BaseEntityQuery.getBaseEntity(this.props.root);

        let btnValue = {
            hint: rootEntity && rootEntity.parentCode || '',
            itemCode: this.props.root,
            userCode: GennyBridge.getUser()
        };

        btnValue = JSON.stringify(btnValue);

        GennyBridge.sendBtnClick('BTN_CLICK', {
            code: 'DESELECT_EVENT',
            value: btnValue
        });

        this.setState({
            selectedItemState: null,
        });

        if (this.props.onClick) this.props.onClick();
    }

    handleFilterText = (event) => {
        const text = event.target.value;
        
        this.setState({
            filterText:  text,
        });
    }

    generateListItems(data) {

        const {
            localAliases,
            selectedItem,
            root,
            numberOfItems,
            hideSelectedStyle,
            itemLayout,
            sortField,
            reverseSortDirection,
            hideFilters,
            filterField,
            shouldSelectFirstItemOnMount
        } = this.props;

        const { selectedItemState, filterText, isFirstItemSelected } = this.state;

        let newData = [];

        if(data.length == 0) return [];

        newData = data.map((item, index) => {

            if(item) {

                // console.log( item );
                let linkToParent = BaseEntityQuery.getLinkToParent(root, item.code);
                // console.log('link between: ', root, ' and: ', item.code);

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
                        if(linkLinkValue == 'LINK') {
                            layout_code = linkValue;
                        }
                        else {
                            layout_code = linkLinkValue;
                        }
                    }
                    else {
                        layout_code = linkLinkValue || linkValue;
                    }

                    if ( itemLayout != null && typeof itemLayout === 'string' && itemLayout.length > 0 ) {
                        layout_code = itemLayout;
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

        newData.sort((a, b) => {
            let valueA = dlv(a, sortField);
            let valueB = dlv(b, sortField);

            const validate = (value) => {
                return moment(value).isValid();
            };

            const order = (result) => {
                return result
                    ? reverseSortDirection
                        ? -1
                        : 1
                    : reverseSortDirection
                        ? 1
                        :-1;
            };

            if ( !validate(valueA) ) return order ( false );
            if ( !validate(valueB) ) return order ( true );

            return order( moment(valueA).format('YYYY-MM-DD HH:mm:sss') < moment(valueB).format('YYYY-MM-DD HH:mm:sss') );
        });

        if (
            !hideFilters &&
            filterText !== null &&
            typeof filterText === 'string' &&
            filterText.length > 0
        ) {
            newData = newData.filter(item => {
                const itemField = dlv(item, filterField);
                
                if ( itemField === null || itemField == undefined ) return false;
                
                const match = itemField.toLowerCase().includes(filterText.toLowerCase());
                
                return match;
            });
        }

        /* we select the first item by default on mount of the component */
        if(shouldSelectFirstItemOnMount && !isFirstItemSelected && newData.length > 0) {
            
            const firstItem = newData[0];
            this.setState({
                isFirstItemSelected: true,
                selectedItemState: firstItem.code,
            });
        }

        return newData;
    }

    render() {

        const { root, showLinks, headerRoot, hideHeader, hideNav, hideLinks, hideFilters, showTitle, showEmpty, gennyListStyle, emptyMessage, placeholder, title, ...rest } = this.props;
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

            const listItems = this.generateListItems(data);
            return (
                <div className='genny-list' style={componentStyle}>
                    { showTitle ?
                        <div style={{ backgroundColor: projectColor}} className='genny-list-title'>
                            <span className='clickable' onClick={this.handleDeselect} >{ title ? title : rootEntity && rootEntity.name} ( {data && data.length} )</span>
                            { !hideFilters
                                ? (
                                    <div
                                        className='list-filter-wrapper'
                                    >
                                        <IconSmall
                                            className='list-filter-icon'
                                            name='search'
                                        />
                                        <input
                                            type='text'
                                            className='list-filter-input'
                                            onChange={this.handleFilterText}
                                            placeholder={`${placeholder}${title ? title : rootEntity && rootEntity.name}`}
                                        />
                                    </div>
                                ) : null 
                            }
                        </div>
                    : null }
                    <List
                        header={ headerRoot && !hideHeader ? <GennyForm root={headerRoot} isHorizontal /> : null }
                        hideCount
                        hideNav={hideNav}
                        emptyMessage={emptyMessage}
                        data={ listItems }
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
