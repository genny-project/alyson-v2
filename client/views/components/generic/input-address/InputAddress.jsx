import './inputAddress.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { Label, SubmitStatusIcon } from '../';
import PlacesAutocomplete from 'react-places-autocomplete'
import { geocodeByAddress, geocodeByPlaceId } from 'react-places-autocomplete'

class InputAddress extends Component {

    static defaultProps = {
        className: '',
    }

    static propTypes = {
        className: string,
        style: object,
    }

    state = {
        address: '',
        hasChanges: false
    }

    onChange = (newAddress) => {

        this.setState({
            address: newAddress,
            hasChanges: true
        });
    }

    onBlur = () => {

        // validation value
        const { validationList } = this.props;
        const value = this.state.address;

        if (validationList.length > 0) {

          const valResult = validationList.every( validation => new RegExp(validation.regex).test( value ));
          this.validateValue(valResult, value);

        } else {
          const valResult = new RegExp(/.*/).test( value );
          this.validateValue(valResult, value);
        }

    }

    validateValue = (valResult, value) => {

      if (valResult) {
        if(this.state.hasChanges) {

          if(this.props.onValidation) this.props.onValidation(value, this.props.identifier);
          this.setState({
              hasChanges: false
          });
        }
      }
    }

    render() {

        const { style, name, optional } = this.props;
        const { validationStatus } = this.state;
        const componentStyle = { ...style, };

        const inputProps = {
            value: this.state.address,
            onChange: this.onChange,
            onBlur: this.onBlur,
            placeholder: this.props.placeholder
        };

        const classes = {
            root: "input-text input-address",
        };

        return (
            <div>
                <div className="input-header">
                  {name ? <Label text={name} /> : null }
                  {optional ? <Label text="(optional)" /> : null}
                  <SubmitStatusIcon status={validationStatus} />
                </div>
                {window.google ? <PlacesAutocomplete inputProps={inputProps} classNames={classes}/> : <p>Loading...</p>}
            </div>
        )
    }
}

export default InputAddress;
