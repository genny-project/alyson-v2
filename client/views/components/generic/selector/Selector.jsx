import React, { Component } from 'react';
import { any, array, bool } from 'prop-types';

class Selector extends Component {
  static propTypes = {
    children: any,
    checkValues: any,
    showValues: any,
    hideValues: any,
    showOverride: bool,
  }

  state = {
  }

  render() {
    const { checkValues, showValues, hideValues, showOverride, children } = this.props;
    // checkValues : the values that will be compared to other values
    // showValues : array of values. if checkValues matches any of these values, return true
    // hideValues : array of values. if checkValues matches any of these values, return false
    // showOverride: if conflict between show and hide results, then return true. default return false.

    if (typeof checkValues === 'string') {
      if ( showValues && showValues != checkValues) { 
        return null;
      }
      // if hideValues includes checkValue, AND showOverride is false
      if ( hideValues && hideValues == checkValues && !showOverride) {
        return null;
      }
      return children;
    } else {
      checkValues.forEach(value => {
        // if showValues doesnt include checkValue
        if ( showValues && !showValues.includes(value) ) { 
          return null;
        }
        // if hideValues includes checkValue, AND showOverride is false
        if ( hideValues && hideValues.includes(value) && !showOverride) {
          return null;
        } 
      });
      return children;
    }

  }
}

export default Selector;
