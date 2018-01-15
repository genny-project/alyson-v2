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
  }

  static propTypes = {
    className: string,
    style: object,
    hint: string,
    validation: func,
    identifier: any,
    validationStatus: string,
  }

  state = {
    ask: this.props.ask ? this.props.ask : false,
    value: this.props.default_value,
    selectedItems: [],
    isOpen: false,
    currentValue: ''
  }

  handleBlur = () => {
    console.log('blur');
    let code = this.props.items.filter(x => x.name == this.selectedItems);
    const { validationList, validation, identifier,  } = this.props;
    const value = code;
    console.log(code);
    //if(validation) validation(value, identifier, validationList);
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
      selectedItems: [...selectedItems, item],
    }))
  }
  removeItem = item => {
    this.setState(({selectedItems}) => {
      return {
        selectedItems: selectedItems.filter(i => i !== item),
      }
    })
  }

  getDisplayText = () => {
    const { selectedItems } = this.state;
    console.log(selectedItems);
    if ( selectedItems && selectedItems.length > 0) {
      if (selectedItems.length == 1) {
        return '1 item selected';
      } else if (selectedItems.length > 1) {
        return `${selectedItems.length} items selected`; 
      }
    }
    return 'Select an item';
  }

  onToggleMenu = () => {
    this.setState(({isOpen}) => ({
      isOpen: !isOpen,
    }))
  }

  handleStateChange = changes => {

    const {isOpen, type} = changes;

    console.log(type);
    

    if (type === Downshift.stateChangeTypes.mouseUp) {
      this.setState({isOpen})
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
    else {
    }
  }

  handleClearInput = () => {
    this.setState({
      currentValue: ''
    })
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
              isActive: highlightedIndex === index,
              isSelected: selectedItem.indexOf(item.name) > -1,
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
