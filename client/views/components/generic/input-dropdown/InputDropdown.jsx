import './inputDropdown.scss';
import React, { Component } from 'react';
import { string, object, func, any } from 'prop-types';
import Downshift from 'downshift'
import { Label, IconSmall } from 'views/components';

class InputDropdown extends Component {

  static defaultProps = {
    className: '',
    hint: '',
    identifier: null,
    validationStatus: null
  }

  static propTypes = {
    className: string,
    style: object,
    hint: string,
    validation: func,
    identifier: any,
    validationStatus: string
  }

  state = {
    ask: this.props.ask ? this.props.ask : false,
    value: this.props.default_value,
  }

  handleClick = (selectedItem) => {

    let code = this.props.items.filter(x => x.name == selectedItem)[0].code;
    const { validationList, validation, identifier,  } = this.props;
    const value = code;
    this.setState({ focused: false });
    if(validation) validation(value, identifier, validationList);
  }

  render() {

    const { className, style, name, hint, validationStatus, ...rest } = this.props;
    let { items } = this.props;
    const { value } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`input input-dropdown ${className} ${validationStatus}` }>
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
