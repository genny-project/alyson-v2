import './gennySearchbar.scss';
import React, { Component } from 'react';
import { IconSmall } from 'views/components';
import { Grid } from '@genny-project/layson';
import { string, object, bool  } from 'prop-types';
import { GennyBridge, } from 'utils/genny';

class GennySearchBar extends Component {

  static defaultProps = {
    className: '',
    style: {},
  }

  static propTypes = {
    className: string,
    style: object,
  };

  state = {
  }

  render() {

    const { style, className, } = this.props;
    const componentStyle = {
      ...style,
    };

    return (
      <div className={`genny-searchbar`} style={componentStyle}>

      </div>
    );
  }
}

export default GennySearchBar;
