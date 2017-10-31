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

  handleClick = selectedItem => {

    const { validationList } = this.props;
    const value = selectedItem;

    console.log(validationList);

    if ( validationList.length > 0 ) {
      const valResult = validationList.every( validation => new RegExp(validation.regex).test( value ));
      console.log(valResult)
      this.validateValue(valResult, value);
    } else {
      //window.alert("No regex supplied");
      //this.sendAnswer(event.target.value);
      const valResult = new RegExp(/.*/).test( value );
      console.log(valResult);
      this.validateValue(valResult, value);
    }
  }

  validateValue = ( valResult, value ) => {
    
    if ( valResult ){
      this.props.noValidation ? null : this.validationStyle('success');
      
      if(this.props.onValidation) {
        this.props.onValidation(value, this.props.identifier);
      }

    } else {
      this.props.noValidation ? null : this.validationStyle('error');
    }
  }

  validationStyle = (resultString) => {
    this.setState({
      validationStatus: resultString,
    });
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
