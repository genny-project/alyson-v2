import React, { Component } from 'react';
import { object } from 'prop-types';
import LayoutNotFound from './layout-not-found';
import components from './components';
import { JSONLoader } from '@genny-project/layson';

class LayoutLoader extends Component {

  static propTypes = {
    layouts: object,
    baseEntity: object,
  };

  render() {
    const { layouts, baseEntity } = this.props;

    /* Get the current layout */
    const { current, loaded } = layouts;

    /* If the current layout is null or this layout hasn't been loaded display a LayoutNotFound page */
    if ( !current ) {
      return null;
    }

    if ( loaded[current] == null ) {
      return <LayoutNotFound layout={current} />;
    }

    return <JSONLoader layout={loaded[current]} componentCollection={components} context={baseEntity.data} />;
  }
}

export default LayoutLoader;
