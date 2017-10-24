import './inputDropdown2.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import Downshift from 'downshift'
import { Label, IconSmall } from '../';

class InputDropdown2 extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
  }

  state = {
    ask: this.props.ask ? this.props.ask : false,
  }

  render() {
 	  const { className, style, items, ...rest } = this.props;
    const { ask,  } = this.state;
    const componentStyle = { ...style, };
    return (
      <div className={`input-dropdown2 ${className}`}>
        {ask.name ? <Label className="dropdown-label" text={ask.name} /> : null }
        <Downshift {...rest}>
          {({
            getLabelProps,
            getInputProps,
            getButtonProps,
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
                id="my-select"
                type="button"
                className={`${isOpen ? "selected" : ""}`}
                onClick={toggleMenu}
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                <span className="">{selectedItem ? selectedItem : 'Select a fruit'}</span>
                <IconSmall name={ isOpen ? 'expand_more' : 'expand_less'} />
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

export default InputDropdown2;
