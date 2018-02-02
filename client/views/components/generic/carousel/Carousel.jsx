import './carousel.scss';
import React, { Component } from 'react';
import { string, any } from 'prop-types';
import { Carousel as ReactCarousel} from 'react-responsive-carousel';
import { ImageView } from 'views/components';

class Carousel extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
    imageHeight: string,
  }

  renderItems = (items) => {

    const {style, imageHeight} = this.props;

    let content = [];

    if (items && items.length > 0) {
      items.map( item  => {
        content.push(
          <div style={{ height: imageHeight }}>
            <img src={item.img} style={{ height: '100%' }}/>
            { item.text ?
              <span className='legend'>{item.text}</span>
            : null }
          </div>
        );
      });
    }
    return(content);
  }

  handleClick = (event) => {
    console.log(event);
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
      },
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
      <div className={`carousel-main ${className}`} style={componentStyle}>
        <ReactCarousel
          showThumbs
          onClickItem={this.handleClick}
          onClickThumb={this.handleClick}
        >
          {this.renderItems(items)}
        </ReactCarousel>
      </div>
    );
  }
}

export default Carousel;
