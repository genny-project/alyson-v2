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
    isMulti: true,
  }

  static propTypes = {
    className: string,
    style: object,
    hint: string,
    validation: func,
    identifier: any,
    validationStatus: string,
    isMulti: bool
  }

  state = {
    ask: this.props.ask ? this.props.ask : false,
    value: this.props.default_value,
    selectedItems: [],
  }

  handleClick = (selectedItem) => {

    console.log('onclick');
    console.log(this.state.selectedItems);

    if (this.state.selectedItems.includes(selectedItem)) {
      console.log('remove');
      this.removeItem(selectedItem);
    } else {
      console.log('add');
      this.addSelectedItem(selectedItem);
    }

    // let code = this.props.items.filter(x => x.name == selectedItem)[0].code;
    // const { validationList, validation, identifier,  } = this.props;
    // const value = code;
    // this.setState({ focused: false });
    //if(validation) validation(value, identifier, validationList);
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

  render() {

    const { className, style, name, hint, validationStatus, isMulti, ...rest } = this.props;
    let { items } = this.props;
    const { value } = this.state;
    const componentStyle = { ...style, };

    console.log(this.state.selectedItems);

    return (
      <div className={`input input-dropdown ${className} ${validationStatus}` }>
        {name ? <Label className="dropdown-label" text={name} /> : null }
        <Downshift {...rest} onSelect={this.handleClick}>
          {({

            getItemProps,
            isOpen,
            toggleMenu,
            clearSelection,
            selectedItem,
            inputValue,
            highlightedIndex,

          }) => (
            <div className="dropdown-container">
              <div
                type="button"
                className={`input-dropdown-button ${isOpen ? "selected" : ""}`}
                onClick={ toggleMenu}
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                <span className="">{selectedItem ? selectedItem : value }</span>
                <IconSmall name={ isOpen ? 'expand_more' : 'chevron_right'} />
              </div>
              {isOpen ? (
                <ul style={{display: 'block'}} className="dropdown-menu">
                  {items.map(item => (
                    <li
                      {...getItemProps({item: item.name})}
                      key={item.name}
                      className="dropdown-item"
                      style={{cursor: 'pointer'}}
                    >
                      <span>{item.name}</span>
                    </li>
                  ))}
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
