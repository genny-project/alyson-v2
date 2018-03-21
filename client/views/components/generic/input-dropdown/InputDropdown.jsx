import './inputDropdown.scss';
import React, { Component } from 'react';
import { string, object, func, any, bool, array } from 'prop-types';
import Downshift from 'downshift';
import { Label, IconSmall, SubmitStatusIcon } from 'views/components';

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
    lastSentValue: null
  }

  componentDidMount() {

    //TODO works only with singleselected
    this.updateValueFromProps(this.props);
  }

  componentWillReceiveProps( nextProps) {

    if (nextProps.value != this.props.value) {
        this.updateValueFromProps(nextProps);
    }
  }

  updateValueFromProps(props) {

      if(this.props.isSingleSelect) {

          const filter = this.props.items.filter(item => item.code == props.value)[0];

          //console.log(filter);
          this.setState({
            selectedItems: filter && filter.name ? [filter.name] : []
          });
      }
      else {

        // the value coming in could be a stringified array.
        try {

            if(value != null) {

                const newValue = JSON.parse(props.value);
                const selectedItems = this.props.items.map(item => {

                    for (var i = 0; i < newValue.length; i++) {
                        const newItem = newValue[i];
                        if(newItem == item.code) {
                            return item.code;
                        }
                    }

                    return false;
                });

                //console.log(filter);
                this.setState({
                  selectedItems: selectedItems ? selectedItems : []
                });
            }
        }
        catch(e) {

        }
      }
  }

  handleChange = selectedItem => {

    if (this.state.selectedItems.includes(selectedItem)) {
      this.removeItem(selectedItem);
    } else {
      this.addSelectedItem(selectedItem);
    }
  }

  addSelectedItem(item) {
    this.setState(({selectedItems}) => ({
      selectedItems: this.props.isSingleSelect ? [item] : [...selectedItems, item],
      isOpen: this.props.isSingleSelect ? false : this.state.isOpen,
    }), () => {

      if (this.props.isSingleSelect){
        this.handleValidation();
        this.inputRef ? this.inputRef.blur() : null;
      }

    });
  }

  removeItem = item => {
    this.setState(({selectedItems}) => {
      return {
        selectedItems: selectedItems.filter(i => i !== item),
        isOpen: this.props.isSingleSelect ? false : this.state.isOpen,
      };
    }, () => {
      if (this.props.isSingleSelect){
        this.handleValidation();
        this.inputRef ? this.inputRef.blur() : null;
      }
    });
  }

  getDisplayText = () => {

    const { isSingleSelect } = this.props;
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

      if(isSingleSelect)
        return 'Select an item';

      return 'Select multiple items';
    }
  }

  onToggleMenu = () => {

    if(this.state.isOpen) {
        if(this.props.onBlur) {
            this.props.onBlur()
        }
    }
    else {
        if(this.props.onFocus) {
            this.props.onFocus()
        }
    }

    this.setState(({isOpen}) => ({
      isOpen: !isOpen,
    }), () => {
      if (!this.state.isOpen) {
        this.handleValidation();
      }
    });
  }

  handleStateChange = changes => {

    const {isOpen, type} = changes;

    if (type === Downshift.stateChangeTypes.mouseUp) {

        this.setState({isOpen}, () => {
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

  handleValidation = () => {

    const { validationList, validation, identifier, isSingleSelect, mandatory } = this.props;
    const { selectedItems, lastSentValue } = this.state;

    let match = true;
    match = selectedItems.compare(lastSentValue);

    if( match == false || selectedItems && lastSentValue == null ) {

      if ( ( selectedItems.length > 0 || ( selectedItems.length == 0 && ( selectedItems != lastSentValue && lastSentValue != null ) ) ) ) {

        this.setState({
          lastSentValue: selectedItems
        });

        // we now get the code of the item to send by comparing the value
        if ( isSingleSelect && selectedItems.length == 1 ) {

          let itemCode = this.props.items.filter(x => x.name == selectedItems[0])[0].code;
          if(validation) validation(itemCode, identifier, validationList);

        } else {

          let results = [];
          this.props.items.forEach(item => {
              selectedItems.forEach(selectedItem => {
                  if(selectedItem == item.name) results.push(item.code);
              });
          });

          if((results.length == 0 && mandatory == false) || results.length > 0 ) {

            let resultsString = JSON.stringify(results);
            if(validation) validation( resultsString, identifier, validationList);
          }
          else {
            if(validation) validation( '', identifier, validationList);
          }
        }
      }
    }
  }

  getFilteredData(items, inputValue, highlightedIndex, selectedItem, getItemProps,) {

    let list = items;

    list = list.filter(item => !inputValue || item.name.toUpperCase().includes(inputValue.toUpperCase()));

    list = list.sort((x, y) =>
      selectedItem.indexOf(x.name) == -1 && selectedItem.indexOf(y.name) > -1
    );

    list = list.sort((x, y) => {
        if(x.name > y.name) return 1;
        else return -1;
    });

    list = list.sort((x, y) => {
        if(x.weight > y.weight) return 1;
        return -1;
    });

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
        );
      });
    } else {
      list = (
        <li className="dropdown-item no-items-found" style={{cursor: 'default'}}>
          <i>No Matches Found</i>
        </li>
      );
    }

    return list;
  }

  render() {

    const { className, style, name, validationStatus, hideHeader, isHorizontal, mandatory, isSingleSelect } = this.props;
    let { items } = this.props;
    const { selectedItems } = this.state;
    const componentStyle = { ...style, };

    let displayText = this.getDisplayText();

    return (
      <div className={`input input-dropdown ${className} ${validationStatus}` } style={componentStyle}>
        {
        !isHorizontal && !hideHeader ?
          <div className="input-header">
            { name ? <Label text={name} /> : null }
            { mandatory? <Label className='input-label-required' textStyle={ !validationStatus || validationStatus == 'error' ? {color: '#cc0000'} : null} text="*  required" /> : null}
            <SubmitStatusIcon status={validationStatus} style={{marginLeft: '5px'}}/>
          </div> :
        null
      }
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
                {
                    ...(getButtonProps ? getButtonProps({ onClick: this.onToggleMenu }) : null)
                }

                type="button"
                className={`input-dropdown-field ${isOpen ? 'selected' : ''}`}
              >
                <input
                  className='input-field'
                  ref={(ref) => this.inputRef = ref }
                  value={this.state.currentValue}
                  placeholder={displayText}
                  { ...(getInputProps ? getInputProps({}) : null) }
                />
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
