import './carousel.scss';
import "slick-carousel/slick/slick.css";
import 'slick-carousel/slick/slick-theme.css';

import React, { Component } from 'react';
import { string, any, array, object } from 'prop-types';
import { ImageView, IconSmall } from 'views/components';
import Slider from 'react-slick';

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style,}}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "green" }}
            onClick={onClick}
        />
        //<IconSmall style={{ ...style}} onClick={onClick} className={className} size={12} name='chevron-left' />
    );
}
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
                    <div style={{ height: "100%" }}>
                        <div className="image-slider-container" style={{ height: "100%"}}>
                            <div
                                style={{
                                    "backgroundImage": `url(${item.img})`,
                                    "backgroundPosition": "center",
                                    "backgroundSize": "contain",
                                    "backgroundRepeat": "no-repeat",
                                    "backgroundColor": "lightgray",
                                    "height": "100%",
                                    "width": "100%",
                                }}
                            />
                        </div>
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
                slidesToScroll: 1,
                //nextArrow: <SampleNextArrow/>,
                //prevArrow: <SamplePrevArrow/>
            };
            return (
                <div className={`carousel-main ${className} ${window.getScreenSize()}`} style={componentStyle}>
                    <Slider {...settings}>
                        {this.renderItems(items)}
                    </Slider>
                </div>
            );
        }
    }

    export default Carousel;
