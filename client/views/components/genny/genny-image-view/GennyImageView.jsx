import React, { Component } from 'react';
import { ImageView } from 'views/components';
import { object, array, any, string } from 'prop-types';
import store from 'views/store';
import { GennyBridge, BaseEntityQuery } from 'utils/genny';

class GennyImageView extends Component {

  state = {
    image: {}
  }

  static propTypes = {
    baseEntity: object,
    caption: any,
    src: string,
    proxyUrl: string
  };

  render() {

    const { root, baseEntity, caption } = this.props;
    let { proxyUrl } = this.props;

    let { src } = this.props;

    return (
      <div className="genny-image-view">
        <ImageView root={root} src={src} caption={caption}/>
      </div>
    );
  }
}

export default GennyImageView;
