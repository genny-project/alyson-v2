import './inputDropdown.scss';
import React, { Component } from 'react';
import { string, object, } from 'prop-types';
import Downshift from 'downshift'
import { Label, IconSmall } from '../';

class InputDropdown extends Component {

  static defaultProps = {
    className: '',
    hint: ''
  }

  static propTypes = {
    className: string,
    style: object,
    hint: string,
  }

  state = {
    ask: this.props.ask ? this.props.ask : false,
    validationStatus: this.props.validationStatus ? this.props.validationStatus : null,
  }

  handleClick = (selectedItem) => {
    const { validationList, validation, identifier } = this.props;
    const value = selectedItem;
    this.setState({ focused: false });
    if(validation) validation(value, identifier, validationList);
  }

  render() {
 	  const { className, style, items, name, hint, ...rest } = this.props;
    const { ask, validationStatus } = this.state;
    const componentStyle = { ...style, };
    return (
      <div className={`input-dropdown ${className} ${validationStatus}` }>
        {name ? <Label className="dropdown-label" text={name} /> : null }
        <Downshift {...rest} onChange={this.handleClick}>
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
                onClick={toggleMenu}
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                <span className="">{selectedItem ? selectedItem : hint }</span>
                <IconSmall name={ isOpen ? 'expand_more' : 'chevron_right'} />
              </div>
              {isOpen ? (
                <ul style={{display: 'block'}} className="dropdown-menu">
                  {items.map(item => (
                    <li
                      {...getItemProps({item})}
                      key={item}
                      className="dropdown-item"
                      style={{cursor: 'pointer'}}    
                    >
                      <span>{item}</span>
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
