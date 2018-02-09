import './gennyCarousel.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { Carousel } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';

class GennyCarousel extends Component {

    static defaultProps = {
        root: '',
    }

    static propTypes = {
        root: string,
    };

    state = {
    }

    renderItems = (images) => {

        let array = [];

        images.map(image => {
            if (image.uploadURL != null) {
                array.push({
                    img: image.uploadURL,
                    id: image.id || null
                });
            }
        });

        return array;
    }

    render() {

        const { root, ...rest } = this.props;

        let items = [];
        const attribute = BaseEntityQuery.getBaseEntityAttribute(root, 'PRI_IMAGE_URL');
        if(attribute != null) {

            const jsonString = attribute.value;
            if(jsonString != null) {

                const newJsonString = jsonString.substr(0, 1).slice(0, -1);
                // console.log( newJsonString )
                const images = JSON.parse(newJsonString);
                items = this.renderItems(images);
            }
        }

        return (
            <div className="genny-carousel">
                <Carousel
                    items={items}
                    {...rest}
                />
            </div>
        );
    }
}

export default GennyCarousel;
