// import './carousel.scss';
import "slick-carousel/slick/slick.css";
import 'slick-carousel/slick/slick-theme.css';

import React, { Component } from 'react';
import { string, any, array, object } from 'prop-types';
// import { Carousel as ReactCarousel} from 'react-responsive-carousel';
import { ImageView } from 'views/components';
import Slider from 'react-slick';

class Carousel extends Component {

    static defaultProps = {
        className: '',
        items: [],
    }

    static propTypes = {
        className: string,
        style: object,
        children: any,
        imageHeight: string,
        items: array,
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

        // handleClick = (event) => {
        //   console.log(event);
        // }

        render() {

            const { className, style, items } = this.props;
            const componentStyle = { ...style, };

            var settings = {
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1
            };
            return (
                <div className={`carousel-main ${className}`} style={componentStyle}>
                    <Slider {...settings}>
                        {this.renderItems(items)}
                    </Slider>
                </div>
            );

            // return (
            //   <div className={`carousel-main ${className}`} style={componentStyle}>
            //     <ReactCarousel
            //       showThumbs
            //       onClickItem={this.handleClick}
            //       onClickThumb={this.handleClick}
            //     >
            //       {this.renderItems(items)}
            //     </ReactCarousel>
            //   </div>
            // );
        }
    }

    export default Carousel;
