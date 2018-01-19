import './mapDirectionsButton.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { Button } from 'views/components';

class MapDirectionsButton extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: object,
    children: any,
  }

  createMapURL = (addressPickup, addressDropoff) => {

    const pickupURL = encodeURI(addressPickup)
    const dropoffURL = encodeURI(addressDropoff)

    const url = "https://www.google.com/maps/dir/?api=1&origin=" + pickupURL + "&destination=" + dropoffURL;

    console.log(url);
    return url;
  }
  
  render() {
 	  const { className, children, style, buttonComponentStyle, buttonStyle, addressPickup, addressDropoff, ...rest } = this.props;
    const componentStyle = { ...style, };

    return (
      <div className={`map-directions-button ${className}`} style={componentStyle}>
        <Button
          {...rest} href={this.createMapURL(addressPickup, addressDropoff)} style={{...buttonComponentStyle, height: componentStyle.height }} buttonStyle={buttonStyle}>{children}</Button>
      </div>
    );
  }
}

export default MapDirectionsButton;
