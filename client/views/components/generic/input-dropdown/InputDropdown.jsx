import './inputDropdown.scss';
import React, { Component } from 'react';
import { string, object, func, any, bool, array } from 'prop-types';
import Downshift from 'downshift';
import { Label, IconSmall, SubmitStatusIcon, InputCheckbox, Spinner } from 'views/components';

class InputDropdown extends Component {

    static defaultProps = {
        className: '',
        hint: '',
        identifier: null,
        validationStatus: null,
        isSingleSelect: false
    }

    static propTypes = {
        className: string,
        style: object,
        hint: string,
        validation: func,
        identifier: any,
        validationStatus: string,
        isSingleSelect: bool,
        ask: array,
        validationList: array,
        items: array,
        name: string,
        value: any,
        isHorizontal: bool,
        hideHeader: bool,
        mandatory: bool,
    }

    state = {
        ask: this.props.ask ? this.props.ask : false,
        selectedItems: [],
        isOpen: false,
        currentValue: '',
        lastSentValue: null,
        isLoadingData: true,
    }

    componentDidMount() {
        //set state is being called while component is unmounted.
        this.dropdown = true;
        this.updateValueFromProps(this.props, true);
    }

    componentWillUnmount() {
        //set state is being called while component is unmounted.
        this.dropdown = false;
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.value != this.props.value ||
            nextProps.items != this.props.items
        ) {
            this.updateValueFromProps(nextProps, true);
        }
    }

    updateValueFromProps(props, validatePropValue) {

        if (this.props.isSingleSelect) {

            const filter = props.items.filter(item => item.code == props.value)[0];

            this.setState({
                selectedItems: filter && filter.name ? [filter.name] : [],
                isLoadingData: true,
            }, () => {
                // console.log('value from props:', this.state.selectedItems);
                this.handleValidation(validatePropValue);
            });
        }
        else {
            // the value coming in could be a stringified array.
            try {

                if (props && props.value != null) {

                    const newValue = JSON.parse(props.value);
                    // console.log(newValue);
                    const selectedItems = props.items.map(item => {

                        for (var i = 0; i < newValue.length; i++) {
                            const newItem = newValue[i];
                            if (newItem == item.code) {
                                return item.name;
                            }
                        }

                        return false;
                    });
                    // console.log(selectedItems);
                    this.setState({
                        selectedItems: selectedItems ? selectedItems : [],
                        isLoadingData: true,
                    }, () => {
                        // console.log('value from props:', this.state.selectedItems);
                        this.handleValidation(validatePropValue);
                    });
                }
            }
            catch (e) {

            }
        }

        setTimeout(() => {
            //set state is being called while component is unmounted.
            if (this.dropdown) {
                this.setState({
                    isLoadingData: false,
                });
            }

        }, 30000);

    }

    handleChange = selectedItem => {

        if (this.state.selectedItems.includes(selectedItem)) {
            this.removeItem(selectedItem);
        } else {
            this.addSelectedItem(selectedItem);
        }
    }
    
    addSelectedItem(item) {
        this.setState(({ selectedItems, currentValue }) => ({
            selectedItems: this.props.isSingleSelect ? [item] : [...selectedItems, item],
            currentValue: this.props.isSingleSelect ? '' : currentValue,
            isOpen: this.props.isSingleSelect ? false : this.state.isOpen,
        }), () => {

            if (this.props.isSingleSelect || this.props.checkboxes) {
                this.handleValidation();
                this.inputRef ? this.inputRef.blur() : null;
            }
        });
    }

    removeItem = item => {
        this.setState(({ selectedItems }) => {
            return {
                selectedItems: selectedItems.filter(i => i !== item),
                isOpen: this.props.isSingleSelect ? false : this.state.isOpen,
            };
        }, () => {
            if (this.props.isSingleSelect || this.props.checkboxes) {
                this.handleValidation();
                this.inputRef ? this.inputRef.blur() : null;
            }
        });
    }

    getDisplayText = () => {

        const { isSingleSelect } = this.props;
        const { selectedItems } = this.state;
        const numberOfSelectedItems = selectedItems.filter(x => x !== null && x !== false && x.length > 0);
        if (numberOfSelectedItems) {
            if (numberOfSelectedItems.length == 1) {
                return numberOfSelectedItems[0];
            }
            // else if (numberOfSelectedItems.length == 1 && !this.props.isSingleSelect) {
            //     return numberOfSelectedItems[0];
            // }
            else if (numberOfSelectedItems.length > 1) {
                return `${numberOfSelectedItems.length} items selected`;
            }

            if (isSingleSelect)
                return 'Select an item';

            return 'Select multiple items';
        }
    }

    onToggleMenu = () => {

        if (this.state.isOpen) {
            if (this.props.onBlur) {
                this.props.onBlur();
            }
        }
        else {
            if (this.props.onFocus) {
                this.props.onFocus();
            }
        }

        this.setState(({ isOpen }) => ({
            isOpen: !isOpen,
        }), () => {
            if (!this.state.isOpen) {
                this.handleValidation();
            }
        });
    }

    handleStateChange = changes => {

        const { isOpen, type } = changes;

        if (type === Downshift.stateChangeTypes.mouseUp) {

            this.setState({ isOpen }, () => {
                if (!this.state.isOpen) {
                    this.handleValidation();
                }
            });
        }
        else if (type === Downshift.stateChangeTypes.keyDownSpaceButton) {
            this.setState({
                isOpen: true,
                currentValue: this.state.currentValue + ' '
            });
        }
        else if (type === Downshift.stateChangeTypes.changeInput) {
            this.setState({
                isOpen: true,
                currentValue: changes.inputValue
            });
        }
    }

    handleClearInput = () => {
        this.setState({
            currentValue: ''
        });
        this.inputRef ? this.inputRef.blur() : null;
    }

    handleValidation = (validatePropValue) => {

        const { validationList, validation, identifier, isSingleSelect, mandatory } = this.props;
        const { selectedItems, lastSentValue } = this.state;
        let match = true;
        match = selectedItems.compare(lastSentValue);
        
        if (match == false || selectedItems && lastSentValue == null) {

            if ((selectedItems.length > 0 || (selectedItems.length == 0 && (selectedItems != lastSentValue && lastSentValue != null)))) {

                this.setState({
                    lastSentValue: selectedItems
                });

                // we now get the code of the item to send by comparing the value
                if (isSingleSelect && selectedItems.length == 1) {

                    let itemCode = this.props.items.filter(x => x.name == selectedItems[0])[0].code;
                    // console.log( itemCode );
                    if (validation) validation(itemCode, identifier, validationList, validatePropValue);
                }
                else {

                    let results = [];
                    this.props.items.forEach(item => {
                        selectedItems.forEach(selectedItem => {
                            if (selectedItem == item.name) results.push(item.code);
                        });
                    });

                    // console.log( results );

                    if ((results.length == 0 && mandatory == false) || results.length > 0) {

                        let resultsString = JSON.stringify(results);
                        
                        // console.log(resultsString);
                        if (validation) validation(resultsString, identifier, validationList, validatePropValue);
                    }
                    else {
                        if (validation) validation('', identifier, validationList, validatePropValue);
                    }
                }
            }
        }
    }

    getFilteredData(items, inputValue, highlightedIndex, selectedItem, getItemProps, ) {

        let list = items;

        list = list.filter(item => {
          if(item.name == null || item.name.length == 0 || item.code == null || item.code.length == 0) return false;
          return !inputValue || item.name.toUpperCase().includes(inputValue.toUpperCase());
        });

        list = list.sort((x, y) =>
            selectedItem.indexOf(x.name) == -1 && selectedItem.indexOf(y.name) > -1
        );

        list = list.sort((x, y) => {
            if (x.name > y.name) return 1;
            else return -1;
        });

        list = list.sort((x, y) => {
            if (x.weight > y.weight) return 1;
            return -1;
        });

        return list;
    }

    renderData(list, inputValue, highlightedIndex, selectedItem, getItemProps,) {

        if (list.length > 0) {

            list = list.map((item, index) => {
                return (
                    <li
                        key={index}
                        className="dropdown-item"
                        style={{ cursor: 'pointer' }}
                        {...getItemProps({
                            item: item.name,
                        })}
                    >
                        <span>{selectedItem.indexOf(item.name) > -1 ? `✓ ${item.name}` : item.name}</span>
                    </li>
                );
            });

        } else {

            list = (
                <li className="dropdown-item no-items-found" style={{ cursor: 'default' }}>
                    <i>No Matches Found</i>
                </li>
            );
        }

        return list;
    }

    renderCheckboxes = () => {

        let { items } = this.props;

        return items.map((item, index) => {
            const selected = this.state.selectedItems.indexOf(item.name) > -1;
            return (
                <div style={{display: 'flex'}}>
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => this.handleChange(item.name)}
                    />
                    <span>{item.name}</span>
                </div>
            );
        });
    }

    renderDownshift(displayText) {

        const { className, style, name, validationStatus, hideHeader, isHorizontal, mandatory, isSingleSelect, checkboxes } = this.props;
        let { items } = this.props;
        const { selectedItems, isLoadingData } = this.state;
        const componentStyle = { ...style, };

        return (
            <div>
                <Downshift
                    isOpen={this.state.isOpen}
                    selectedItem={selectedItems}
                    onChange={this.handleChange}
                    onStateChange={this.handleStateChange}
                    inputValue={this.state.currentValue}
                    onBlur={this.handleBlur}
                >
                    {({
                        getItemProps,
                        getButtonProps,
                        getInputProps,
                        isOpen,
                        selectedItem,
                        inputValue,
                        highlightedIndex,
                    }) => (
                            <div style={{ 'display': 'flex'}}>
                                <div className="dropdown-container" style={{ 'flex-grow': '20'}}>
                                    <div
                                        {
                                        ...(getButtonProps ? getButtonProps({ onClick: this.onToggleMenu }) : null)
                                        }

                                        type="button"
                                        className={`input-dropdown-field ${isOpen ? 'selected' : ''}`}
                                    >
                                        <input
                                            className='input-field'
                                            ref={(ref) => this.inputRef = ref}
                                            value={this.state.currentValue}
                                            placeholder={displayText}
                                            {...(getInputProps ? getInputProps({}) : null)}
                                        />
                                        {this.state.currentValue && this.state.currentValue.length > 0 ?
                                            <IconSmall className='input-dropdown-icon close' name='clear' onClick={this.handleClearInput} />
                                            : <IconSmall className='input-dropdown-icon' name={isOpen ? 'expand_more' : 'chevron_right'} />
                                        }
                                    </div>
                                    {isOpen ? (
                                        <ul style={{ display: 'block' }} className="dropdown-menu">
                                            {this.renderData(this.getFilteredData(items, inputValue, highlightedIndex, selectedItem, getItemProps), inputValue, highlightedIndex, selectedItem, getItemProps)}
                                        </ul>
                                    ) : null}
                                </div>
                                <div style={{ 'flex-grow': '1', 'maxWidth': '40px' }} className="dropdown-loader">
                                    {
                                        (this.getFilteredData(items, inputValue, highlightedIndex, selectedItem, getItemProps).length > 0 || isLoadingData == false) ? null : <Spinner loaderType={'bar'} width={'20'} style={{ 'margin': '5px' }} />
                                    }
                                </div>
                            </div>
                        )}
                </Downshift>
            </div>
        );
    }

    render() {

        const { className, style, name, validationStatus, hideHeader, isHorizontal, mandatory, isSingleSelect, checkboxes } = this.props;
        let { items } = this.props;
        const { selectedItems } = this.state;
        const componentStyle = { ...style, };

        let displayText = this.getDisplayText();

        return (
            <div className={`input input-dropdown ${className} ${validationStatus}`} style={componentStyle}>
                {
                    !isHorizontal && !hideHeader ?
                        <div className="input-header">
                            {name ? <Label text={name} /> : null}
                            {mandatory ? <Label className='input-label-required' textStyle={!validationStatus || validationStatus == 'error' ? { color: '#cc0000' } : null} text="*  required" /> : null}
                            <SubmitStatusIcon status={validationStatus} style={{ marginLeft: '5px' }} />
                        </div> :
                        null
                }
                {
                    checkboxes ? this.renderCheckboxes() : this.renderDownshift(displayText)
                }
            </div>
        );
    }
}

export default InputDropdown;
