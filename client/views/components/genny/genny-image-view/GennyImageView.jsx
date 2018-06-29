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

    const { root, baseEntity, caption, proxyUrl } = this.props;
    let { src } = this.props;

    if(proxyUrl == null) {

        // proxy URL if any
        const project_code = GennyBridge.getProject();
        if(project_code != null) {

            proxyUrl = BaseEntityQuery.getBaseEntityAttribute(project_code, 'PRI_IMAGE_PROXY_URL');
        }
    }

    if(proxyUrl != null && proxyUrl.value != null) {

        let proxy = proxyUrl.value;
        if(proxy.endsWith("/")) {
          proxy = proxy.slice(0, -1);
        }

        src = `${proxy}/${src}`;
    }

    return (
      <div className="genny-image-view">
        <ImageView root={root} src={src} caption={caption} proxyUrl={proxyUrl} />
      </div>
    );
  }
}

export default GennyImageView;
