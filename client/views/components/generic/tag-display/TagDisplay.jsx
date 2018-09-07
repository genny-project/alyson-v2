import './tagDisplay.scss';
import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { BaseEntityQuery } from 'utils/genny';

class TagDisplay extends Component {

  static defaultProps = {
    className: '',

  }

  static propTypes = {
    root: string,
    attribute: string,
    className: string,
    style: object,
  }

  state = {
  }

  renderTags = (data) => {
    if ( Array.isArray(data)) {
      return data.map((item, index) => {
        return (
          <div key={index} className='tag-display-tag' >
            <span>{item}</span>
          </div>
        );
      });
    }
  }

  render() {
    const { className, root, attribute, style } = this.props;
    const componentStyle = { ...style, };
    let filesArray = [];
    if (
      root != null &&
      typeof root === 'string' &&
      root.length > 0 &&
      attribute != null &&
      typeof attribute === 'string' &&
      attribute.length > 0
    ) {
      const attributeObject = BaseEntityQuery.getBaseEntityAttribute(root, attribute);
      const attributeValue = attributeObject ? attributeObject.value : null;


      if(attributeValue != null && attributeValue.startsWith('[')) {
        filesArray = JSON.parse(attributeValue);
      }
    }
    
    return (
      <div className={`tag-display-container ${className}`} style={componentStyle}>
        {this.renderTags(filesArray)}
      </div>
    );
  }
}

export default TagDisplay;
