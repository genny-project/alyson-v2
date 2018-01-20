import './carousel.scss';
import React, { Component } from 'react';
import { string, any } from 'prop-types';
import { Carousel as ReactCarousel} from 'react-responsive-carousel';

class Carousel extends Component {

  static defaultProps = {
    className: '',
    height: '300px'
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
    height: string,
  }

  renderItems = (items) => {

    const {style, height} = this.props;

    const elementHeight = style && style.background ? style.background : height;

    let content = [];

    if (items && items.length > 0) {
      items.map( item  => {
        content.push(
          <div style={{ height: elementHeight }}>
            <div style={{ backgroundImage: `url("${item.img}")`, backgroundSize: 'cover', height: '100%' }}/>
            { item.text ?
              <span className='legend'>{item.text}</span>
            : null }
          </div>
        );
      });
    }
    return(content);
  }

  render() {
    const { className, style } = this.props;
    const componentStyle = { ...style, };

    let items = [
      {
        img: 'http://investorsking.com/wp-content/uploads/2016/09/rice.jpg'
      },
      {
        img: 'http://thenationonlineng.net/wp-content/uploads/2017/10/Bags-of-Rice.jpg',
      },
      {
        img: 'http://c8.alamy.com/comp/DYCDEC/stacks-of-bags-of-rice-sold-at-a-grocery-shop-in-ealing-road-in-north-DYCDEC.jpg',
      }
    ];

    return (
      <div className={`carousel ${className}`} style={componentStyle}>
        <ReactCarousel
        >
          {this.renderItems(items)}
        </ReactCarousel>
      </div>
    );
  }
}

export default Carousel;
