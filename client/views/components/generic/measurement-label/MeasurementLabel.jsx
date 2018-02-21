import './measurementLabel.scss';
import React, { Component } from 'react';
import { string, any, object, bool } from 'prop-types';

class MeasurementLabel extends Component {

  static defaultProps = {
    children: '',
    format: '',
    fromNow: false,
    includeUnits: true
  }

  static propTypes = {
    className: string,
    format: string,
    children: any,
    style: object,
    includeUnits: bool
  }

  convert = (value, fromUnit, toUnit) => {
    const { includeUnits } = this.props;
    let newValue = value;
    let units = false;

    if (fromUnit == 'm') {
      if (toUnit == 'km') {
        newValue = newValue / 1000;
        units = 'km';
      }
    }

    if (includeUnits) {
      newValue = newValue + ' ' + units;
    }
    return newValue;
  }

  render() {

    const { className, children, style } = this.props;
    const componentStyle = { ...style, };

    return (
      <div className={`measurement-label ${className || ''}`} style={componentStyle}>
        <span className="measurement-label-text">
            {this.convert(children, 'm', 'km')}
        </span>
      </div>
    );
  }
}

export default MeasurementLabel;
