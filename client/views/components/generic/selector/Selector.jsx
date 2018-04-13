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

    render() {

        const { checkValues, showValues, hideValues, showOverride, showIfNull, showIfNotNull } = this.props;
        
        // 1. if showIfNull prop is true, then show content if checkvalue is null
        if(showIfNull) {

            if (checkValues == null || checkValues == 'null' || (checkValues.length == 1 && checkValues[0] === "")) {
                return this.renderChildren();
            } else {
                return null;
            }
        }

        // 2. if showIfNotNull prop is true, then show content if checkvalue is not null
        if(showIfNotNull) {
            if (checkValues != null && checkValues != 'null' && !(checkValues.length == 1 && checkValues[0] === "")) {
                return this.renderChildren();
            } else {
                return null;
            }
        }

        // 3. check if checkValues is an array and compare with showValues and hideValues
        if(checkValues != null && checkValues.constructor == Array) {

            //4.a check if hideValues is an array and
            if(hideValues != null && hideValues.constructor == Array) {

                let hasValue = false;
                
                //4.b loop through checkValues, comparing each value with every item in hideValues for a match
                for (var i = 0; i < checkValues.length; i++) {

                    const value = checkValues[i];

                    if( hideValues.includes(value) ) {
                        hasValue = true;
                    }
                }

                //4.c if there are no matches, dont show content
                if (hasValue == true && showOverride != true ) return null;
            }

            //5.a check if hideValues is an array and
            else if(showValues != null && showValues.constructor == Array) {

                let hasValue = false;

                //5.b loop through checkValues, comparing each value with every item in showValues for a match
                for (var i = 0; i < checkValues.length; i++) {

                    const value = checkValues[i];

                    if( showValues.includes(value)) {
                        hasValue = true;
                    }
                }

                //5.c if there are no matches, dont show content
                if (hasValue == false) return null;
            }
        }

        //6. if none of the conditions are met, then show content
        return this.renderChildren();
    }
}

export default Selector;
