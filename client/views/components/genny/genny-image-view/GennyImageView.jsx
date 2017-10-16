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

  getCaption(caption) {

      if(caption instanceof String) {
         return <p>{caption}</p>
      }
      else if(caption instanceof Object) {
         return <BaseEntity>
            {
              (query) => {
                return <span>{query.getAlias(caption)}</span>;
              }
            }
          </BaseEntity>
      }
  }

  render() {

    const { root, baseEntity, src, caption } = this.props;

    return (
      <div className="genny-image-view">
        <ImageView root={root} src={src} caption={this.getCaption(caption)} />
      </div>
    );
  }
}

export default GennyImageView;
