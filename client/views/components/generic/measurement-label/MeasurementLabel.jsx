import './measurementLabel.scss';
import React, { Component } from 'react';
import { string, any, object, bool } from 'prop-types';
const measurement = require('measurement');
const mf = new measurement.Factory();

class MeasurementLabel extends Component {

  static defaultProps = {
    value: '',
    fromUnit: 'm',
    toUnit: 'km'
  }

  static propTypes = {
    className: string,
    value: any,
    style: object,
    fromUnit: string.isRequired,
    toUnit: string.isRequired,
  }

  convert = (value, fromUnit, toUnit) => {

    const newValue = parseFloat(value.replace(',', ''));

    if(newValue != null && fromUnit != null && toUnit != null) {

        const measurement = mf.measure(`${newValue}${fromUnit}`);
        return `${measurement.as(toUnit)}`;
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
