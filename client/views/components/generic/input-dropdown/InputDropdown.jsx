import './inputDropdown.scss';
import React, { Component } from 'react';
import { string, object, func, any, bool } from 'prop-types';
import Downshift from 'downshift'
import { Label, IconSmall } from 'views/components';

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
    isSingleSelect: bool
  }

  state = {
    ask: this.props.ask ? this.props.ask : false,
    value: this.props.default_value,
    selectedItems: [],
    isOpen: false,
    currentValue: '',
    lastSentValue: null
  }

  handleChange = selectedItem => {

    if (this.state.selectedItems.includes(selectedItem)) {
      this.removeItem(selectedItem)
    } else {
      this.addSelectedItem(selectedItem)
    }
  }

  addSelectedItem(item) {
    this.setState(({selectedItems}) => ({
      selectedItems: this.props.isSingleSelect ? [item] : [...selectedItems, item],
      isOpen: this.props.isSingleSelect ? false : this.state.isOpen,
    }), () => {
      if (this.props.isSingleSelect){
        this.handleValidation();
      }
    })
  }

  removeItem = item => {
    this.setState(({selectedItems}) => {
      return {
        selectedItems: selectedItems.filter(i => i !== item),
        isOpen: this.props.isSingleSelect ? false : this.state.isOpen,
      }
    }, () => {
      if (this.props.isSingleSelect){
        this.handleValidation();
      }
    })
  }

  getDisplayText = () => {

    const { selectedItems } = this.state;
    if ( selectedItems) {
      if ( selectedItems.length == 1 && this.props.isSingleSelect ) {
        return selectedItems[0];
      }
      else if ( selectedItems.length == 1 && !this.props.isSingleSelect ) {
        return '1 item selected';
      } else if (selectedItems.length > 1) {
        return `${selectedItems.length} items selected`;
      }
      return 'Select an item';
    }
  }

  onToggleMenu = () => {

    this.setState(({isOpen}) => ({
      isOpen: !isOpen,
    }), () => {
      if (!this.state.isOpen) {
        this.handleValidation();
      }
    })
  }

  handleStateChange = changes => {

    const {isOpen, type} = changes;

    if (type === Downshift.stateChangeTypes.mouseUp) {

        this.setState({isOpen}, () => {
          if (!this.state.isOpen) {
            this.handleValidation();
          }
        })
    }
    else if (type === Downshift.stateChangeTypes.keyDownSpaceButton) {
      this.setState({
        isOpen: true,
        currentValue: this.state.currentValue + ' '
      })
    }
    else if (type === Downshift.stateChangeTypes.changeInput) {
      this.setState({
        isOpen: true,
        currentValue: changes.inputValue
      })
    }
  }

  handleClearInput = () => {
    this.setState({
      currentValue: ''
    })
  }

handleValidation = () => {

    const { validationList, validation, identifier, isSingleSelect } = this.props;
    const { selectedItems, lastSentValue } = this.state;

    let match = true;
    match = selectedItems.compare(lastSentValue);

    if( !match || selectedItems && lastSentValue == null){

      this.setState({
        lastSentValue: selectedItems
      })

      // we now get the code of the item to send by comparing the value
      if ( isSingleSelect && selectedItems.length == 1 ) {

        let itemCode = this.props.items.filter(x => x.name == selectedItems[0])[0].code;
        if(validation) validation(itemCode, identifier, validationList);

      } else {

        let answers = this.props.items.map((item, index) => {

            return selectedItems.map(selectedItem => {

                if(selectedItem == item.name) return item.code;
                return false;
            })

            return false;
        });

        console.log("---------------")
        console.log(answers);
        if(validation) validation(selectedItems, identifier, validationList);
      }
    }
  }

  getFilteredData(items, inputValue, highlightedIndex, selectedItem, getItemProps,) {

    let list = items;

    list = list.filter(item => !inputValue || item.name.toUpperCase().includes(inputValue.toUpperCase()))

    list = list.sort((x, y) =>
      selectedItem.indexOf(x.name) == -1 && selectedItem.indexOf(y.name) > -1
    )

    if (list.length > 0 ) {

      list = list.map((item, index) => {
        return (
          <li
            key={index}
            className="dropdown-item"
            style={{cursor: 'pointer'}}
            {...getItemProps({
              item: item.name,
            })}
          >
            <span>{selectedItem.indexOf(item.name) > -1 ? `✓ ${item.name}` : item.name}</span>
          </li>
        )
      })
    } else {
      list = (
        <li className="dropdown-item no-items-found" style={{cursor: 'default'}}>
          <i>No Matches Found</i>
        </li>
      )
    }

    return list;
  }

  render() {

    const { className, style, name, hint, validationStatus, ...rest } = this.props;
    let { items } = this.props;
    const { value, selectedItems } = this.state;
    const componentStyle = { ...style, };

    let displayText = this.getDisplayText();

    return (
      <div className={`input input-dropdown ${className} ${validationStatus}` }>
        {name ? <Label className="dropdown-label" text={name} /> : null }
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
            <div className="dropdown-container">
              <div
                {...getButtonProps({
                  onClick: this.onToggleMenu
                })}
                type="button"
                className={`input-dropdown-field ${isOpen ? "selected" : ""}`}
              >
                <input
                  value={this.state.currentValue}
                  placeholder={displayText}
                  {...getInputProps({})}
                />
                {/* <span className="">{displayText}</span> */}
                { this.state.currentValue && this.state.currentValue.length > 0 ?
                  <IconSmall className='input-dropdown-icon' name='clear' onClick={this.handleClearInput}/>
                  : <IconSmall className='input-dropdown-icon' name={ isOpen ? 'expand_more' : 'chevron_right'} />
                }
              </div>
              {isOpen ? (
                <ul style={{display: 'block'}} className="dropdown-menu">
                  {
                    this.getFilteredData(items, inputValue, highlightedIndex, selectedItem, getItemProps)
                  }
                </ul>
              ) : null}
            </div>
          )}
        </Downshift>
      </div>
    );
  }
}

export default InputDropdown;
