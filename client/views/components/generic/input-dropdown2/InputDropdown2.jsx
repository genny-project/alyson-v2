import './inputDropdown2.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import Downshift from 'downshift'
import {  } from '../';

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
  }

  render() {
 	  const { className, children, style, items, ...rest } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`input-dropdown2 ${className}`}>
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
            <div style={{width: 250, margin: 'auto'}}>
              {/* <label
                {...getLabelProps({
                  htmlFor: 'my-select',
                  style: {
                    fontWeight: 'bold',
                    display: 'block',
                    marginBottom: 10,
                  },
                })}
              > 
                Select a fruit
              </label> */}
              <div className="btn-group">
                <button
                  id="my-select"
                  type="button"
                  className="btn btn-primary dropdown-toggle dropdown-toggle-split"
                  onClick={toggleMenu}
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                >
                  <span className="sr-only">{selectedItem ? selectedItem : 'Select a fruit'}</span>
                </button>
                {isOpen ? (
                  <div style={{display: 'block'}} className="dropdown-menu">
                    {items.map(item => (
                      <button
                        {...getItemProps({item})}
                        key={item}
                        className="dropdown-item"
                        style={{cursor: 'pointer'}}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </Downshift>
      </div>
    );
  }
}

export default InputDropdown2;
