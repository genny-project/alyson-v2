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
    src: string
  };

  render() {

    const { root, baseEntity, caption } = this.props;
    let { src } = this.props;

    // proxy URL if any
    const project_code = GennyBridge.getProject();
    if(project_code != null) {

        const image_proxy_url = BaseEntityQuery.getBaseEntityAttribute(project_code, )
        if(image_proxy_url != null && image_proxy_url.value != null) {
            src = `${image_proxy_url}${src}`;
        }
    }

    return (
      <div className="genny-image-view">
        <ImageView root={root} src={src} caption={caption} />
      </div>
    );
  }
}

export default GennyImageView;
