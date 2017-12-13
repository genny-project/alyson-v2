import './header.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { Grid } from '@genny-project/layson';

class Header extends Component {
  static defaultProps = {
    className: '',
    style: {},
    cols: 1,
    rows: 1,
  }

  static propTypes = {
    className: string,
    style: object,
    children: any,
    cols: any,
    rows: any,
  }

  state = {
  }

  render() {

    const { className, style, cols, rows, children } = this.props;

    const componentStyle = {
      ...style,
    };

    return (

      <Grid className={'header'} style={componentStyle} cols={cols} rows={rows} >
        {children}
      </Grid>
    );
  }
}

export default Header;
