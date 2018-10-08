import './addressLabel.scss';
import React, { Component } from 'react';
import { string, object, bool } from 'prop-types';

class AddressLabel extends Component {

    static defaultProps = {
        addressData: {},
        hideStreetAddress: false,
        hideSuburb: false,
        hideState: false,
        hidePostcode: false,
        hideCountry: false,
    }

    static propTypes = {
        className: string,
        style: object,
        textStyle: object,
        addressData: object,
        hideStreetAddress: bool,
        hideSuburb: bool,
        hideState: bool,
        hidePostcode: bool,
        hideCountry: bool,
    }

    renderTextLayout = (data) => {

        const { textStyle } = this.props;

        return (
            <div className='address-label-text' style={textStyle}>
                {data}
            </div>
        );
    }

    renderAddress = (data) => {

        const { hideStreetAddress, hideSuburb, hideState, hidePostcode, hideCountry, unit } = this.props;

        let address = [];

        if(unit) {
            address.push(
                unit
            );
        }

        if ( hideStreetAddress != true && data && data.street_address) {
            let text = this.renderTextLayout(data.street_address);
            address.push(
                text
            );
        }

        if ( hideSuburb != true && data && data.suburb) {
            let text = this.renderTextLayout(data.suburb);
            address.push(
                text
            );
        }

        if ( hideState != true && data && data.state) {
            let text = this.renderTextLayout(data.state);
            address.push(
                text
            );
        }

        if ( hidePostcode != true && data && data.postal_code) {
            let text = this.renderTextLayout(data.postal_code);
            address.push(
                text
            );
        }

        if ( hideCountry != true && data && data.country) {
            let text = this.renderTextLayout(data.country);
            address.push(
                text
            );
        }

        return address;
    }

    render() {
        
        const { className, addressData, style } = this.props;
        const componentStyle = { ...style, };

        return (
            <div className={`address-label ${className || ''}`} style={componentStyle}>
                {this.renderAddress(addressData)}
            </div>
        );
    }
}

export default AddressLabel;
