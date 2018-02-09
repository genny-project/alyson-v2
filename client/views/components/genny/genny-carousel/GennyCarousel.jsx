import './gennyCarousel.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { Carousel } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';

class GennyCarousel extends Component {

    static defaultProps = {
        root: '',
        attributeCode: '',
    }

    static propTypes = {
        root: string,
        attributeCode: string,
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

        const { root, attributeCode, ...rest } = this.props;

        let items = [];
        const attribute = BaseEntityQuery.getBaseEntityAttribute(root, attributeCode);

        if(attribute != null) {

            const jsonString = attribute.value;

            if(jsonString != null) {

                console.log(jsonString);
                const images = JSON.parse(jsonString);
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
