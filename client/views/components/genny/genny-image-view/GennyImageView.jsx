import React, { Component } from 'react';
import { ImageView } from '../../';
import { object, array, any, string } from 'prop-types';
import store from 'views/store';
import { GennyBridge } from 'utils/genny';
import { BaseEntity } from '../../../../utils/genny/';

class GennyImageView extends Component {

  state = {
    image: {}
  }

  static propTypes = {
    baseEntity: object,
    caption: any,
    src: string
  };
  render() {

    const { root, baseEntity, src, caption } = this.props;

    return (
      <div className="genny-image-view">
        <ImageView root={root} src={src} caption={caption} />
      </div>
    );
  }
}

export default GennyImageView;
