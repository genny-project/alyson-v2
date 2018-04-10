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

        const tempValue = value.replace(/,/g, '');
        let newValue = value != null ? parseFloat(tempValue, 10) : null;

        if(newValue != null && fromUnit != null && toUnit != null) {

            let measurement = mf.measure(newValue, `${fromUnit}`);
            if(measurement != null) {
                let convertMeasurement = measurement.as(toUnit);
                
                if (showDecimal && Number.isInteger(showDecimal) && showDecimal > 0 ) {
                    convertMeasurement = convertMeasurement.value.toFixed( showDecimal );
                }
                else if (hideDecimal == true) {
                    convertMeasurement = convertMeasurement.value.toFixed(0);
                }

                if(convertMeasurement != null) {
                    return `${convertMeasurement}${toUnit}`;
                }
            }
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
