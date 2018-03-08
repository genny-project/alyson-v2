import './measurementLabel.scss';
import React, { Component } from 'react';
import { string, any, object, bool, number } from 'prop-types';
const measurement = require('measurement');
const mf = new measurement.Factory();

class MeasurementLabel extends Component {

  static defaultProps = {
    value: '',
    fromUnit: 'm',
    toUnit: 'km',
    hideDecimal: false,
  }

  static propTypes = {
    className: string,
    value: any,
    style: object,
    fromUnit: string.isRequired,
    toUnit: string.isRequired,
    hideDecimal: bool,
    showDecimal: number
  }

  convert = (value, fromUnit, toUnit) => {
    const { hideDecimal, showDecimal } = this.props;
    const newValue = parseFloat(value.replace(',', ''));

    if(newValue != null && fromUnit != null && toUnit != null) {

        let measurement = mf.measure(newValue, `${fromUnit}`);

        let convertMeasurement = measurement.as(toUnit);

        if (showDecimal && Number.isInteger(showDecimal) && showDecimal.length > 0 ) {
          convertMeasurement.value = convertMeasurement.value.toFixed( showDecimal );
        }
        if (hideDecimal == true) {
          convertMeasurement.value = convertMeasurement.value.toFixed(0);
        }
        return `${convertMeasurement.as(toUnit)}`;
    }

    return null;
  }

  render() {

    const { className, children, value, style, fromUnit, toUnit } = this.props;
    const componentStyle = { ...style, };

    return (
      <div className={`measurement-label ${className || ''}`} style={componentStyle}>
        <span className="measurement-label-text">
            {this.convert(value || children, fromUnit, toUnit)}
        </span>
      </div>
    );
  }
}

export default MeasurementLabel;
