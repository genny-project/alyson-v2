import React, { Component } from 'react';
import { array, bool, any } from 'prop-types';

class Selector extends Component {
    static propTypes = {
        children: any,
        showIfNull: bool,
        showIfNotNull: bool,
        checkValues: array,
        showValues: array,
        hideValues: array,
        showOverride: bool
    }

    state = {
    }

    renderChildren() {

        const { children } = this.props;
        if(children.constructor === Array) {
            return <div>{children}</div>;
        }

        return children;
    }

    canBeShown(checkValue, showValues, hideValues) {

        let canShowValue = false;

        if(typeof(checkValue) === "boolean"){
          checkValue = checkValue.toString();
        }

        if(showValues != null && showValues != undefined) {

            let showValuesArray = [];
            // if showValues is an array
            if(showValues.constructor == Array) {

                for (var i = 0; i < showValues.length; i++) {

                    let showValue = showValues[i];
                    if(typeof(showValue) === "boolean"){
                      showValue = showValue.toString();
                    }

                    if(`${checkValue}` == `${showValue}`) {
                        showValuesArray.push(true);
                    } else {
                        showValuesArray.push(false);
                    }
                }
            }
            else {
                if(`${checkValue}` == `${showValues}`) showValuesArray.push(true);
            }

            if (showValuesArray.includes(true) ) canShowValue = true;
        }

        if(hideValues != null && hideValues != undefined) {

            canShowValue = true;
            let hideValuesArray = [];
            // if hide values is an array
            if(hideValues.constructor == Array) {

                for (var i = 0; i < hideValues.length; i++) {

                    let hideValue = hideValues[i];
                    if( typeof hideValue === 'boolean'){
                      hideValue = hideValue.toString();
                    }

                    if(`${checkValue}` == `${hideValue}`) {
                        hideValuesArray.push(true);
                    } else {
                        hideValuesArray.push(false);
                    }
                }
            }
            else {

                if(`${checkValue}` == `${hideValues}`) hideValuesArray.push(true);
            }
            if (hideValuesArray.includes(true) ) canShowValue = false;
        }

        return canShowValue;
    }

    render() {

        const { checkValues, showValues, hideValues, showOverride, showIfNull, showIfNotNull } = this.props;

        let shouldShow = false;

        /* if showIfNull is defined and checkValues does not exist, shouldShow matches showIfNull */
        if(showIfNull != null) {

            if(checkValues.constructor == Array) {

                let foundValue = false;
                for (var i = 0; i < checkValues.length; i++) {
                    if(checkValues[i] != null && checkValues[i].replace(" ", '').length > 0) foundValue = true;
                }

                if(foundValue === false) shouldShow = showIfNull;
            }
            else {
                if((checkValues == null || checkValues.length == 0)) shouldShow = showIfNull;
            }
        }

        /* if showIfNotNull is defined and checkValues exists, shouldShow matches showIfNotNull */
        if(showIfNotNull != null) {

            if(checkValues.constructor == Array) {

                let foundValue = false;
                for (var i = 0; i < checkValues.length; i++) {
                    if(checkValues[i] != null && checkValues[i].replace(" ", '').length > 0) foundValue = true;
                }

                if(foundValue === true) shouldShow = showIfNotNull;
            }
            else {
                if((checkValues != null && checkValues.replace(" ", "").length > 0)) shouldShow = showIfNotNull;
            }
        }

        if(showIfNull == null && showIfNotNull == null) {

            // if check values is an array
            if(checkValues.constructor == Array) {

                const resultArray = [];

                for (var i = 0; i < checkValues.length; i++) {

                    const checkValue = checkValues[i];
                    if(this.canBeShown(checkValue, showValues, hideValues) === true) {
                        resultArray.push(true);
                    } else {
                        resultArray.push(false);
                    }
                }

                if (showValues) {
                    shouldShow = resultArray.includes(true);
                } else if (hideValues) {
                    shouldShow = !resultArray.includes(false);
                }
            }
            else {

                const checkValue = checkValues;
                shouldShow = this.canBeShown(checkValue, showValues, hideValues);
            }
        }

        //6. if none of the conditions are met, then show content
        return shouldShow ? this.renderChildren() : null;
    }
}

export default Selector;
