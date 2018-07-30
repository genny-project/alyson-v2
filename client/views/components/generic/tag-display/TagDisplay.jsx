import './tagDisplay.scss';
import React, { Component } from 'react';
import { string, object, array } from 'prop-types';
import { IconSmall } from 'views/components';

class TagDisplay extends Component {

  static defaultProps = {
    className: '',
    data: [
    ]
  }

  static propTypes = {
    className: string,
    style: object,
    data: array,
  }

  state = {
  }

  renderTags = (data) => {
    if (Array.isArray(data)) {
      return data.map((item, index) => {
        return (
          <div key={index} className='tag-display-tag' >
            {item.icon ?
              <IconSmall
                name={item.icon}
                fontSize='12'
              />
              : null}
            <span>{item && item.text}</span>
          </div>
        );
      });
    }
    else if (
      typeof data == 'string' &&
      data.startsWith('[')
    ) {
      const dataArray = JSON.parse(data);
      if (Array.isArray(dataArray)) {
        return dataArray.map((item, index) => {
          return (
            <div key={index} className='tag-display-tag' >
              <span>{item}</span>
            </div>
          );
        });
      }
    }
    else return null;
  }

  render() {
    const { className, data, style } = this.props;
    const { } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`tag-display-container ${className}`} style={componentStyle}>
        {this.renderTags(data)}
      </div>
    );
  }
}

export default TagDisplay;
